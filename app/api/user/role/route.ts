import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, updateUserRole } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting user role");
    
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("[API] User authenticated:", user.id);

    // Get user from database
    const dbUser = await getUserByClerkId(user.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    console.log("[API] User role:", dbUser.role);

    return NextResponse.json({
      success: true,
      role: dbUser.role,
      canBecomeStudent: dbUser.role !== "tutor", // Tutors cannot become students
      canBecomeTutor: true, // Students can always become tutors
    });

  } catch (error) {
    console.error("[API] Error getting user role:", error);
    return NextResponse.json(
      { error: "Failed to get user role" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Updating user role");
    
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newRole } = body;

    if (!newRole || !["student", "tutor"].includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'student' or 'tutor'" },
        { status: 400 }
      );
    }

    console.log("[API] User authenticated:", user.id);
    console.log("[API] Requested role change to:", newRole);

    // Get user from database
    const dbUser = await getUserByClerkId(user.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    console.log("[API] Current user role:", dbUser.role);

    // Role change validation rules
    if (dbUser.role === "tutor" && newRole === "student") {
      return NextResponse.json(
        { 
          error: "Tutors cannot become students. This is a platform policy to maintain teaching integrity.",
          code: "TUTOR_TO_STUDENT_NOT_ALLOWED"
        },
        { status: 403 }
      );
    }

    if (dbUser.role === newRole) {
      return NextResponse.json(
        { 
          success: true,
          message: `User is already a ${newRole}`,
          role: dbUser.role
        }
      );
    }

    // Update user role
    const success = await updateUserRole(dbUser.id, newRole);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    console.log("[API] Role updated successfully to:", newRole);

    return NextResponse.json({
      success: true,
      message: `Role updated to ${newRole} successfully`,
      role: newRole,
      previousRole: dbUser.role,
    });

  } catch (error) {
    console.error("[API] Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}

// Helper function to check if role change is allowed
function isRoleChangeAllowed(currentRole: string, newRole: string): boolean {
  // Tutors cannot become students
  if (currentRole === "tutor" && newRole === "student") {
    return false;
  }
  
  // Students can become tutors
  if (currentRole === "student" && newRole === "tutor") {
    return true;
  }
  
  // Same role is allowed (no change)
  if (currentRole === newRole) {
    return true;
  }
  
  return false;
}

export async function PUT(request: NextRequest) {
  try {
    console.log("[API] Checking role change eligibility");
    
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetRole } = body;

    if (!targetRole || !["student", "tutor"].includes(targetRole)) {
      return NextResponse.json(
        { error: "Invalid target role. Must be 'student' or 'tutor'" },
        { status: 400 }
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

    const isAllowed = isRoleChangeAllowed(dbUser.role, targetRole);
    
    return NextResponse.json({
      success: true,
      currentRole: dbUser.role,
      targetRole,
      isAllowed,
      reason: isAllowed 
        ? "Role change is allowed" 
        : dbUser.role === "tutor" && targetRole === "student"
        ? "Tutors cannot become students to maintain teaching integrity"
        : "Role change not permitted",
    });

  } catch (error) {
    console.error("[API] Error checking role change eligibility:", error);
    return NextResponse.json(
      { error: "Failed to check role change eligibility" },
      { status: 500 }
    );
  }
}
