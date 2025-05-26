import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  createCourseBooking,
  createDemoClass,
  createNotification,
  getUserByClerkId,
  createUser,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Course booking request received");

    // Get current user - this is the most reliable method
    const user = await currentUser();

    console.log("[API] CurrentUser:", user?.id);
    console.log("[API] User email:", user?.emailAddresses[0]?.emailAddress);

    if (!user || !user.id) {
      console.log("[API] No authenticated user found");
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    console.log("[API] Using user ID:", user.id);

    const body = await request.json();
    console.log("[API] Request body:", JSON.stringify(body, null, 2));

    const {
      tutorId,
      courseId,
      selectedLanguage,
      selectedTimeSlot,
      totalAmount,
      privacyConsent,
      termsConsent,
      notes,
      userInfo,
    } = body;

    // Map string course IDs to integer IDs
    const courseIdMap: { [key: string]: number } = {
      "wordpress-dev": 1,
      "react-basics": 2,
      "python-fundamentals": 3,
      "digital-marketing": 4,
      "ui-ux-design": 5,
      "data-science": 6,
    };

    const numericCourseId = courseIdMap[courseId] || 1; // Default to 1 if not found

    console.log("[API] Extracted data:", {
      tutorId,
      courseId,
      numericCourseId,
      selectedLanguage,
      selectedTimeSlot,
      totalAmount,
      privacyConsent,
      termsConsent,
    });

    // Validate required fields
    if (
      !tutorId ||
      !courseId ||
      !selectedLanguage ||
      !selectedTimeSlot ||
      !totalAmount
    ) {
      console.log("[API] Missing required fields");
      return NextResponse.json(
        { error: "Missing required booking information" },
        { status: 400 }
      );
    }

    if (!privacyConsent || !termsConsent) {
      console.log("[API] Missing consent");
      return NextResponse.json(
        { error: "Privacy and terms consent required" },
        { status: 400 }
      );
    }

    // Get or create user in our database
    console.log("[API] Looking up user by Clerk ID:", user.id);
    let dbUser = await getUserByClerkId(user.id);
    console.log("[API] Found user:", dbUser ? "Yes" : "No");

    // If user doesn't exist in our database, create them
    if (!dbUser) {
      console.log("[API] Creating user from Clerk data");
      const userId = await createUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        fullName: user.fullName || "",
        phone: user.phoneNumbers[0]?.phoneNumber || "",
        whatsapp: user.phoneNumbers[0]?.phoneNumber || "",
        role: "student",
      });

      console.log("[API] Created user with ID:", userId);

      if (userId) {
        dbUser = {
          id: userId,
          email: user.emailAddresses[0]?.emailAddress || "",
          fullName: user.fullName || "",
          phone: user.phoneNumbers[0]?.phoneNumber || "",
          whatsapp: user.phoneNumbers[0]?.phoneNumber || "",
        };
      }
    }

    if (!dbUser) {
      console.log("[API] No user found or created");
      return NextResponse.json(
        { error: "Failed to create or find user" },
        { status: 500 }
      );
    }

    // Create course booking
    console.log("[API] Creating course booking...");
    const bookingId = await createCourseBooking({
      studentId: dbUser.id,
      tutorId,
      courseId: numericCourseId,
      selectedLanguage,
      selectedTimeSlot,
      totalAmount: parseFloat(totalAmount),
      privacyConsent,
      termsConsent,
      notes,
    });

    console.log("[API] Booking created with ID:", bookingId);

    if (!bookingId) {
      console.log("[API] Failed to create booking");
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Schedule demo class (1 day from now)
    const demoDate = new Date();
    demoDate.setDate(demoDate.getDate() + 1);

    // Parse time slot to get the time
    const [day, time] = selectedTimeSlot.split("-");
    const [hours, minutes] = time.split(":");
    demoDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const demoId = await createDemoClass({
      bookingId,
      studentId: dbUser.id,
      tutorId,
      courseId: numericCourseId,
      scheduledDate: demoDate,
      meetingLink: `https://zoom.us/j/${Math.random()
        .toString()
        .substr(2, 11)}`,
    });

    // Create notifications for both student and tutor
    if (demoId) {
      // Student notification
      await createNotification({
        userId: dbUser.id,
        type: "demo_scheduled",
        title: "Demo Class Scheduled",
        message: `Your demo class has been scheduled for ${demoDate.toLocaleDateString()} at ${time}`,
        actionUrl: `/student/demo-class/${demoId}`,
        priority: "high",
        relatedBookingId: bookingId,
        relatedDemoId: demoId,
      });

      // Tutor notification
      await createNotification({
        userId: tutorId,
        type: "new_student",
        title: "New Student Enrolled",
        message: `${
          dbUser.fullName || dbUser.email
        } has enrolled in your course`,
        actionUrl: `/tutor/students/${bookingId}`,
        priority: "high",
        relatedBookingId: bookingId,
        relatedDemoId: demoId,
      });
    }

    return NextResponse.json({
      success: true,
      bookingId,
      demoId,
      demoDate: demoDate.toISOString(),
      message: "Course booked successfully! Demo class scheduled.",
    });
  } catch (error) {
    console.error("Course booking error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // If it's a database error, provide a more helpful message
    if (error instanceof Error && error.message.includes("Database")) {
      return NextResponse.json(
        {
          error: "Database temporarily unavailable. Please try again later.",
          details: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : "No stack"
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUserData = await currentUser();

    if (!currentUserData || !currentUserData.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(currentUserData.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Here you would typically fetch user's bookings
    // For now, return empty array
    return NextResponse.json({
      bookings: [],
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
