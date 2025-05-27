import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
};

// In-memory rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
export function checkRateLimit(
  request: NextRequest,
  options: { windowMs?: number; maxRequests?: number } = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const {
    windowMs = RATE_LIMIT_CONFIG.windowMs,
    maxRequests = RATE_LIMIT_CONFIG.maxRequests,
  } = options;

  // Get client IP
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const key = `rate_limit_${ip}`;

  // Clean up expired entries
  for (const [storeKey, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(storeKey);
    }
  }

  // Get or create rate limit data for this IP
  let rateLimitData = rateLimitStore.get(key);

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Create new rate limit window
    rateLimitData = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, rateLimitData);

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: rateLimitData.resetTime,
    };
  }

  // Increment request count
  rateLimitData.count++;
  rateLimitStore.set(key, rateLimitData);

  const allowed = rateLimitData.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - rateLimitData.count);

  return {
    allowed,
    remaining,
    resetTime: rateLimitData.resetTime,
  };
}

// Security headers
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
};

// Input validation and sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .substring(0, 1000); // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
}

export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

// Role-based access control
export type UserRole = "student" | "tutor" | "admin";

export interface SecurityContext {
  user: any;
  dbUser: any;
  role: UserRole;
  isSuperAdmin: boolean;
  permissions: string[];
}

// Permission definitions
const PERMISSIONS = {
  // Student permissions
  "student:view_dashboard": ["student"],
  "student:enroll_course": ["student"],
  "student:submit_assignment": ["student"],
  "student:join_session": ["student"],
  "student:chat_tutor": ["student"],
  "student:create_support_ticket": ["student"],

  // Tutor permissions
  "tutor:view_dashboard": ["tutor"],
  "tutor:manage_courses": ["tutor"],
  "tutor:grade_assignments": ["tutor"],
  "tutor:create_sessions": ["tutor"],
  "tutor:chat_student": ["tutor"],
  "tutor:view_earnings": ["tutor"],

  // Admin permissions
  "admin:view_dashboard": ["admin"],
  "admin:manage_users": ["admin"],
  "admin:send_sms": ["admin"],
  "admin:view_analytics": ["admin"],
  "admin:export_data": ["admin"],
  "admin:manage_settings": ["admin"],

  // Cross-role permissions
  "user:view_profile": ["student", "tutor", "admin"],
  "user:update_profile": ["student", "tutor", "admin"],
  "user:change_password": ["student", "tutor", "admin"],
};

export async function getSecurityContext(): Promise<SecurityContext | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    // Try to get user from database first
    let dbUser;
    try {
      dbUser = await getUserByClerkId(user.id);
    } catch (error) {
      console.error("Error fetching user from database:", error);
      dbUser = null;
    }

    // If database user doesn't exist, create a basic context from Clerk data
    if (!dbUser) {
      dbUser = {
        id: user.id,
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        fullName: user.fullName || "",
        role: (user.publicMetadata?.role as string) || "student",
        isSuperAdmin:
          user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com",
        profileCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const role = (dbUser.role ||
      user.publicMetadata?.role ||
      "student") as UserRole;
    const isSuperAdmin =
      dbUser.isSuperAdmin ||
      user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com";

    // Get permissions for the user's role
    const permissions = Object.entries(PERMISSIONS)
      .filter(([_, roles]) => roles.includes(role) || isSuperAdmin)
      .map(([permission]) => permission);

    return {
      user,
      dbUser,
      role,
      isSuperAdmin,
      permissions,
    };
  } catch (error) {
    console.error("Error getting security context:", error);
    return null;
  }
}

export function hasPermission(
  context: SecurityContext | null,
  permission: string
): boolean {
  if (!context) return false;
  if (context.isSuperAdmin) return true;
  return context.permissions.includes(permission);
}

export function requirePermission(permission: string) {
  return async function (request: NextRequest) {
    // Check rate limit first
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: RATE_LIMIT_CONFIG.message,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_CONFIG.maxRequests.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(
              rateLimitResult.resetTime
            ).toISOString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const context = await getSecurityContext();

    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (!hasPermission(context, permission)) {
      return NextResponse.json(
        {
          error: "Insufficient permissions",
          code: "INSUFFICIENT_PERMISSIONS",
          required: permission,
          userRole: context.role,
        },
        { status: 403 }
      );
    }

    return context;
  };
}

// Role-based route protection
export function requireRole(allowedRoles: UserRole[]) {
  return async function (request: NextRequest) {
    // Check rate limit first
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: RATE_LIMIT_CONFIG.message,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_CONFIG.maxRequests.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(
              rateLimitResult.resetTime
            ).toISOString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const context = await getSecurityContext();

    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(context.role) && !context.isSuperAdmin) {
      return NextResponse.json(
        {
          error: "Access denied for your role",
          code: "ROLE_ACCESS_DENIED",
          userRole: context.role,
          allowedRoles,
        },
        { status: 403 }
      );
    }

    return context;
  };
}

// Audit logging
export async function logSecurityEvent(
  action: string,
  details: any,
  context?: SecurityContext,
  request?: NextRequest
) {
  try {
    const logEntry = {
      id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      userId: context?.dbUser?.id || "anonymous",
      userRole: context?.role || "unknown",
      ipAddress:
        request?.headers.get("x-forwarded-for") ||
        request?.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request?.headers.get("user-agent") || "unknown",
      details: typeof details === "object" ? JSON.stringify(details) : details,
    };

    // In production, save to database or external logging service
    console.log("[SECURITY LOG]", logEntry);

    // TODO: Save to admin_activities table
    // await saveSecurityLog(logEntry);
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

// Request validation
export function validateRequest(request: NextRequest, schema: any) {
  try {
    const contentType = request.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // Validate JSON payload size
      const contentLength = request.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("Request payload too large");
      }
    }

    // Validate required headers
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    // In production, validate origin against allowed domains
    if (process.env.NODE_ENV === "production") {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
      if (origin && !allowedOrigins.includes(origin)) {
        throw new Error("Invalid origin");
      }
    }

    return true;
  } catch (error) {
    console.error("Request validation failed:", error);
    return false;
  }
}

// SQL injection prevention
export function sanitizeSqlInput(input: any): any {
  if (typeof input === "string") {
    return input.replace(/['";\\]/g, ""); // Remove SQL injection characters
  }
  if (typeof input === "number") {
    return isNaN(input) ? 0 : input;
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeSqlInput);
  }
  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key)] = sanitizeSqlInput(value);
    }
    return sanitized;
  }
  return input;
}

// CSRF protection
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get("x-csrf-token");
  const sessionToken = request.cookies.get("csrf-token")?.value;

  if (!token || !sessionToken || token !== sessionToken) {
    return false;
  }

  return true;
}

// File upload security
export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/x-rar-compressed",
  ];

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  // Check file extension matches MIME type
  const extension = file.name.split(".").pop()?.toLowerCase();
  const mimeToExt: { [key: string]: string[] } = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/gif": ["gif"],
    "image/webp": ["webp"],
    "application/pdf": ["pdf"],
    "application/msword": ["doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      "docx",
    ],
    "application/zip": ["zip"],
    "application/x-rar-compressed": ["rar"],
  };

  const expectedExtensions = mimeToExt[file.type];
  if (
    !expectedExtensions ||
    !extension ||
    !expectedExtensions.includes(extension)
  ) {
    return { valid: false, error: "File extension does not match file type" };
  }

  return { valid: true };
}
