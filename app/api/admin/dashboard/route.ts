import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";
import {
  getSecurityContext,
  requireRole,
  logSecurityEvent,
  sanitizeInput,
  validateRequest,
} from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting admin dashboard data");

    // Validate request
    if (!validateRequest(request, {})) {
      return NextResponse.json(
        { error: "Invalid request", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Check role-based access
    const context = await getSecurityContext();
    if (!context) {
      await logSecurityEvent(
        "UNAUTHORIZED_ADMIN_ACCESS",
        { endpoint: "/api/admin/dashboard" },
        undefined,
        request
      );
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Require admin role
    if (context.role !== "admin" && !context.isSuperAdmin) {
      await logSecurityEvent(
        "INSUFFICIENT_PERMISSIONS",
        {
          endpoint: "/api/admin/dashboard",
          userRole: context.role,
          requiredRole: "admin",
        },
        context,
        request
      );

      return NextResponse.json(
        {
          error: "Super Admin access required",
          code: "ADMIN_ACCESS_REQUIRED",
          userRole: context.role,
        },
        { status: 403 }
      );
    }

    // Log successful access
    await logSecurityEvent(
      "ADMIN_DASHBOARD_ACCESS",
      { endpoint: "/api/admin/dashboard" },
      context,
      request
    );

    // In a real implementation, you would fetch actual data from database
    // For now, return mock data with a note
    const dashboardData = {
      isDummyData: true,
      message: "This is dummy data for demonstration purposes",
      stats: {
        totalStudents: 1247,
        totalTutors: 89,
        totalCourses: 156,
        totalEarnings: 89750.5,
        monthlyGrowth: 12.5,
        activeSessions: 23,
        pendingSupport: 8,
        systemHealth: 98.5,
      },
      recentStudents: [
        {
          id: "student_001",
          name: "Alice Johnson",
          email: "alice@example.com",
          phone: "+1234567890",
          enrolledCourses: 3,
          totalSpent: 1250.0,
          joinedDate: "2024-01-15",
          status: "active",
          lastActivity: "2 hours ago",
        },
        {
          id: "student_002",
          name: "Bob Smith",
          email: "bob@example.com",
          phone: "+1234567891",
          enrolledCourses: 2,
          totalSpent: 850.0,
          joinedDate: "2024-02-20",
          status: "active",
          lastActivity: "1 day ago",
        },
      ],
      recentTutors: [
        {
          id: "tutor_001",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1987654321",
          specialization: "WordPress Development",
          totalStudents: 45,
          totalEarnings: 12500.0,
          rating: 4.8,
          joinedDate: "2023-08-15",
          status: "active",
          lastActivity: "30 minutes ago",
        },
      ],
      courseStats: [
        {
          id: 1,
          title: "WordPress Development Mastery",
          category: "Web Development",
          enrollments: 156,
          revenue: 23400.0,
          rating: 4.7,
          completion: 78,
          status: "active",
        },
      ],
      earningsData: {
        thisMonth: 15750.0,
        lastMonth: 14200.0,
        growth: 10.9,
        breakdown: {
          courseEnrollments: 12500.0,
          tutorCommissions: 2800.0,
          subscriptions: 450.0,
        },
      },
      systemHealth: {
        uptime: 99.8,
        responseTime: 245,
        activeUsers: 1247,
        errorRate: 0.02,
        lastBackup: "2 hours ago",
      },
    };

    console.log("[API] Admin dashboard data retrieved successfully");

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("[API] Error getting admin dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to get dashboard data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Admin action");

    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await getUserByClerkId(user.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user is super admin
    const isSuperAdmin =
      dbUser.role === "admin" ||
      user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com";

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, targetType, targetId, details } = body;

    // Log admin activity
    const activityId = `activity_${Date.now()}`;
    const adminActivity = {
      id: activityId,
      adminId: dbUser.id,
      action,
      targetType,
      targetId,
      details: JSON.stringify(details),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      createdAt: new Date().toISOString(),
    };

    // In a real implementation, save to admin_activities table
    console.log("[API] Admin activity logged:", adminActivity);

    return NextResponse.json({
      success: true,
      message: "Admin action completed successfully",
      activityId,
    });
  } catch (error) {
    console.error("[API] Error processing admin action:", error);
    return NextResponse.json(
      { error: "Failed to process admin action" },
      { status: 500 }
    );
  }
}
