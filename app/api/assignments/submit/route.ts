import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Submitting assignment");
    
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

    const body = await request.json();
    const { assignmentId, submissionType, submissionText, submissionUrl, fileName, fileSize, fileType } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    // Validate submission based on type
    if (submissionType === "text" && !submissionText) {
      return NextResponse.json(
        { error: "Submission text is required for text submissions" },
        { status: 400 }
      );
    }

    if (submissionType === "url" && !submissionUrl) {
      return NextResponse.json(
        { error: "Submission URL is required for URL submissions" },
        { status: 400 }
      );
    }

    if (submissionType === "file" && (!fileName || !fileSize)) {
      return NextResponse.json(
        { error: "File information is required for file submissions" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Validate user is enrolled in the course
    // 2. Check assignment exists and is published
    // 3. Verify submission deadline hasn't passed
    // 4. Handle file upload to cloud storage
    // 5. Save submission to database

    // Mock submission data
    const submissionId = `submission_${Date.now()}`;
    const submissionData = {
      id: submissionId,
      assignmentId,
      studentId: dbUser.id,
      studentName: user.fullName,
      submissionType,
      submissionText: submissionText || null,
      submissionUrl: submissionUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      fileType: fileType || null,
      status: "submitted",
      submittedAt: new Date().toISOString(),
      grade: null,
      feedback: null,
      gradedAt: null,
    };

    console.log("[API] Assignment submitted successfully:", submissionId);

    return NextResponse.json({
      success: true,
      message: "Assignment submitted successfully",
      submission: submissionData,
    });

  } catch (error) {
    console.error("[API] Error submitting assignment:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting user assignments");
    
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

    // Mock assignments data - in real implementation, fetch from database
    const assignments = [
      {
        id: "assignment_001",
        title: "Create Your First WordPress Theme",
        description: "Build a custom WordPress theme from scratch using HTML, CSS, and PHP",
        instructions: "Create a responsive WordPress theme with header, footer, and main content area. Include custom post types and fields.",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        maxPoints: 100,
        submissionType: "file",
        allowedFileTypes: [".zip", ".rar", ".tar.gz"],
        maxFileSize: 10485760, // 10MB
        course: {
          id: 1,
          title: "WordPress Development Mastery"
        },
        tutor: {
          id: "tutor_001",
          name: "John Doe"
        },
        submission: {
          id: "submission_001",
          status: "submitted",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fileName: "my-wordpress-theme.zip",
          fileSize: 2048576,
          grade: 85,
          feedback: "Great work! The theme structure is well organized. Consider adding more custom post types.",
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
      },
      {
        id: "assignment_002", 
        title: "WordPress Plugin Development",
        description: "Develop a custom WordPress plugin with admin interface",
        instructions: "Create a plugin that adds custom functionality to WordPress with proper hooks and filters.",
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        maxPoints: 150,
        submissionType: "file",
        allowedFileTypes: [".zip", ".rar"],
        maxFileSize: 5242880, // 5MB
        course: {
          id: 1,
          title: "WordPress Development Mastery"
        },
        tutor: {
          id: "tutor_001",
          name: "John Doe"
        },
        submission: null // Not submitted yet
      }
    ];

    return NextResponse.json({
      success: true,
      assignments,
      totalAssignments: assignments.length,
      submittedAssignments: assignments.filter(a => a.submission).length,
      pendingAssignments: assignments.filter(a => !a.submission).length,
    });

  } catch (error) {
    console.error("[API] Error getting assignments:", error);
    return NextResponse.json(
      { error: "Failed to get assignments" },
      { status: 500 }
    );
  }
}
