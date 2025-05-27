import { NextRequest, NextResponse } from "next/server";

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
};

// In-memory rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting result interface
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalRequests: number;
}

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Check rate limit for a request
export function checkRateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const { windowMs, maxRequests, message } = { ...DEFAULT_CONFIG, ...config };
  
  // Get client IP
  const ip = getClientIP(request);
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  
  // Clean up expired entries
  cleanupExpiredEntries();
  
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
      totalRequests: 1,
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
    totalRequests: rateLimitData.count,
  };
}

// Rate limit middleware for API routes
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: Partial<RateLimitConfig> = {}
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    const rateLimitResult = checkRateLimit(request, config);
    
    // Add rate limit headers to response
    const headers = {
      "X-RateLimit-Limit": (config.maxRequests || DEFAULT_CONFIG.maxRequests).toString(),
      "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
      "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
      "X-RateLimit-Used": rateLimitResult.totalRequests.toString(),
    };
    
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      
      return NextResponse.json(
        {
          error: config.message || DEFAULT_CONFIG.message,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter,
          limit: config.maxRequests || DEFAULT_CONFIG.maxRequests,
          remaining: rateLimitResult.remaining,
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }
    
    // Call the original handler
    const response = await handler(request);
    
    // Add rate limit headers to successful response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

// Specific rate limiters for different endpoints
export const emailSubscriptionRateLimit = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5, // 5 email subscriptions per 5 minutes
    message: "Too many subscription attempts. Please try again in a few minutes.",
  });

export const chatRateLimit = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30, // 30 chat requests per minute
    message: "Too many chat requests. Please slow down.",
  });

export const adminRateLimit = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200, // 200 admin requests per 15 minutes
    message: "Too many admin requests. Please try again later.",
  });

export const authRateLimit = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 auth attempts per 15 minutes
    message: "Too many authentication attempts. Please try again later.",
  });

export const apiRateLimit = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withRateLimit(handler, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 API requests per 15 minutes
    message: "Too many API requests. Please try again later.",
  });

// Get rate limit status for monitoring
export function getRateLimitStatus(): {
  totalIPs: number;
  activeWindows: number;
  topIPs: Array<{ ip: string; requests: number; resetTime: number }>;
} {
  cleanupExpiredEntries();
  
  const now = Date.now();
  const activeEntries = Array.from(rateLimitStore.entries())
    .filter(([_, data]) => now <= data.resetTime)
    .map(([key, data]) => ({
      ip: key.replace('rate_limit_', ''),
      requests: data.count,
      resetTime: data.resetTime,
    }))
    .sort((a, b) => b.requests - a.requests);
  
  return {
    totalIPs: rateLimitStore.size,
    activeWindows: activeEntries.length,
    topIPs: activeEntries.slice(0, 10), // Top 10 IPs by request count
  };
}

// Clear rate limit for specific IP (admin function)
export function clearRateLimit(ip: string): boolean {
  const key = `rate_limit_${ip}`;
  return rateLimitStore.delete(key);
}

// Clear all rate limits (admin function)
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
