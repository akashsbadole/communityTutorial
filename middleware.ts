import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/tutor(.*)",
  "/student(.*)",
  "/admin/contacts(.*)",
]);

const isProtectedApiRoute = createRouteMatcher([
  "/api/course-booking(.*)",
  "/api/notifications(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect page routes
  if (isProtectedRoute(req)) {
    auth.protect();
  }

  // For API routes, we'll handle auth in the route handlers themselves
  // This allows for better error handling and user experience
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
