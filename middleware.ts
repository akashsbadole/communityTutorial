import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define role-based route protection
const isStudentRoute = createRouteMatcher(["/student(.*)"]);
const isTutorRoute = createRouteMatcher(["/tutor(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/tutor(.*)",
  "/student(.*)",
  "/admin(.*)",
]);

const isProtectedApiRoute = createRouteMatcher([
  "/api/course-booking(.*)",
  "/api/notifications(.*)",
  "/api/student(.*)",
  "/api/tutor(.*)",
  "/api/admin(.*)",
  "/api/chat(.*)",
  "/api/assignments(.*)",
  "/api/sessions(.*)",
  "/api/messages(.*)",
  "/api/support(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Protect all routes that require authentication
  if (isProtectedRoute(req) || isProtectedApiRoute(req)) {
    auth.protect();

    // Get user role from session
    const userRole = auth().sessionClaims?.metadata?.role as string;
    const userEmail = auth().sessionClaims?.email as string;
    const isSuperAdmin = userEmail === "admin@traininghub.com";

    // Role-based access control
    if (!isSuperAdmin) {
      // Students cannot access tutor or admin routes
      if (userRole === "student" && (isTutorRoute(req) || isAdminRoute(req))) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error:
                "Access denied. Students cannot access tutor/admin resources.",
              code: "ROLE_ACCESS_DENIED",
              userRole: "student",
            },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/student/dashboard", req.url));
      }

      // Tutors cannot access student or admin routes
      if (userRole === "tutor" && (isStudentRoute(req) || isAdminRoute(req))) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error:
                "Access denied. Tutors cannot access student/admin resources.",
              code: "ROLE_ACCESS_DENIED",
              userRole: "tutor",
            },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/tutor/dashboard", req.url));
      }

      // Only admins can access admin routes
      if (isAdminRoute(req) && userRole !== "admin") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error: "Access denied. Admin privileges required.",
              code: "ADMIN_ACCESS_REQUIRED",
              userRole,
            },
            { status: 403 }
          );
        }
        const redirectUrl =
          userRole === "student" ? "/student/dashboard" : "/tutor/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    // Log access for security monitoring
    if (pathname.startsWith("/api/")) {
      const ip = req.headers.get("x-forwarded-for") || "unknown";
      console.log(
        `[SECURE API ACCESS] ${userRole || "unknown"} -> ${pathname} from ${ip}`
      );
    }
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
