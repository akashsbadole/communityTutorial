import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, getCourseBookingsByStudentId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting enrolled courses for student");
    
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

    console.log("[API] Database user found:", dbUser.id);

    // Get course bookings for the student
    const bookings = await getCourseBookingsByStudentId(dbUser.id);
    console.log("[API] Found bookings:", bookings.length);

    // Transform bookings into enrolled courses format
    const enrolledCourses = bookings.map((booking) => ({
      id: `course-${booking.courseId}`,
      title: getCourseTitle(booking.courseId),
      tutor: "John Doe", // This would come from tutor lookup
      tutorId: booking.tutorId,
      tutorEmail: "john.doe@example.com", // This would come from tutor lookup
      tutorPhone: "+1234567890",
      tutorWhatsApp: "+1987654321",
      progress: Math.floor(Math.random() * 100), // This would be calculated
      status: booking.bookingStatus === "confirmed" ? "in-progress" : "pending",
      nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalSessions: 16,
      completedSessions: Math.floor(Math.random() * 10),
      price: `$${booking.totalAmount}`,
      enrolledDate: booking.createdAt,
      description: getCourseDescription(booking.courseId),
      syllabus: getCourseSyllabus(booking.courseId),
      assignments: getCourseAssignments(booking.courseId),
      resources: getCourseResources(booking.courseId),
    }));

    return NextResponse.json({
      success: true,
      enrolledCourses,
      totalCourses: enrolledCourses.length,
    });

  } catch (error) {
    console.error("[API] Error getting enrolled courses:", error);
    return NextResponse.json(
      { error: "Failed to get enrolled courses" },
      { status: 500 }
    );
  }
}

// Helper functions to get course data (these would typically come from a courses database)
function getCourseTitle(courseId: number): string {
  const titles: { [key: number]: string } = {
    1: "WordPress Development",
    2: "React Basics",
    3: "Python Fundamentals",
    4: "Digital Marketing",
    5: "UI/UX Design",
    6: "Data Science",
  };
  return titles[courseId] || "Unknown Course";
}

function getCourseDescription(courseId: number): string {
  const descriptions: { [key: number]: string } = {
    1: "Learn to build professional WordPress websites from scratch",
    2: "Master the fundamentals of React development",
    3: "Get started with Python programming",
    4: "Learn digital marketing strategies and tools",
    5: "Design beautiful user interfaces and experiences",
    6: "Analyze data and build machine learning models",
  };
  return descriptions[courseId] || "Course description not available";
}

function getCourseSyllabus(courseId: number) {
  const syllabi: { [key: number]: any[] } = {
    1: [
      { module: "WordPress Basics", completed: true, duration: "4 hours" },
      { module: "Theme Development", completed: true, duration: "6 hours" },
      { module: "Plugin Development", completed: false, duration: "8 hours" },
      { module: "Advanced Customization", completed: false, duration: "6 hours" },
    ],
    2: [
      { module: "React Fundamentals", completed: true, duration: "5 hours" },
      { module: "Components & Props", completed: false, duration: "4 hours" },
      { module: "State Management", completed: false, duration: "6 hours" },
      { module: "Hooks & Context", completed: false, duration: "5 hours" },
    ],
  };
  return syllabi[courseId] || [];
}

function getCourseAssignments(courseId: number) {
  const assignments: { [key: number]: any[] } = {
    1: [
      {
        id: 1,
        title: "Create Custom Theme",
        description: "Build a responsive WordPress theme from scratch",
        dueDate: "2024-01-25",
        status: "pending",
        submittedDate: null,
        grade: null,
        feedback: null,
      },
      {
        id: 2,
        title: "Plugin Development Project",
        description: "Develop a custom WordPress plugin with admin interface",
        dueDate: "2024-01-30",
        status: "not-started",
        submittedDate: null,
        grade: null,
        feedback: null,
      },
    ],
  };
  return assignments[courseId] || [];
}

function getCourseResources(courseId: number) {
  const resources: { [key: number]: any[] } = {
    1: [
      { name: "WordPress Codex", url: "#", type: "documentation" },
      { name: "Theme Development Guide", url: "#", type: "pdf" },
      { name: "Sample Code Repository", url: "#", type: "github" },
    ],
  };
  return resources[courseId] || [];
}
