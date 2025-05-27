import { NextRequest, NextResponse } from "next/server";
import {
  getSecurityContext,
  logSecurityEvent,
  sanitizeInput,
} from "@/lib/security";
import { chatRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting chat rooms");

    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      await logSecurityEvent(
        "UNAUTHORIZED_CHAT_ACCESS",
        { endpoint: "/api/chat/rooms" },
        undefined,
        request
      );
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Log access
    await logSecurityEvent(
      "CHAT_ROOMS_ACCESS",
      {
        endpoint: "/api/chat/rooms",
        userRole: context.role,
      },
      context,
      request
    );

    // In a real implementation, fetch chat rooms from database
    // For now, return mock data
    const chatRooms = [
      {
        id: "chat_room_001",
        studentId: "student_001",
        studentName: "Alice Johnson",
        tutorId: "tutor_001",
        tutorName: "John Doe",
        courseId: 1,
        courseName: "WordPress Development Mastery",
        isActive: true,
        privacyConsentStudent: true,
        privacyConsentTutor: true,
        lastMessage: {
          id: "msg_002",
          senderId: "tutor_001",
          senderName: "John Doe",
          message:
            "Hello! I'd be happy to help. What specific part are you having trouble with?",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        unreadCount: dbUser.role === "student" ? 1 : 0,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Filter rooms based on user role
    const userRooms = chatRooms.filter(
      (room) =>
        (context.role === "student" && room.studentId === context.dbUser.id) ||
        (context.role === "tutor" && room.tutorId === context.dbUser.id) ||
        context.isSuperAdmin
    );

    return NextResponse.json({
      success: true,
      chatRooms: userRooms,
      totalRooms: userRooms.length,
      isDummyData: true,
    });
  } catch (error) {
    console.error("[API] Error getting chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to get chat rooms" },
      { status: 500 }
    );
  }
}

async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Creating chat room");

    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      await logSecurityEvent(
        "UNAUTHORIZED_CHAT_CREATE",
        { endpoint: "/api/chat/rooms" },
        undefined,
        request
      );
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tutorId, studentId, courseId, privacyConsent } = body;

    // Sanitize inputs
    const sanitizedTutorId = sanitizeInput(tutorId);
    const sanitizedStudentId = sanitizeInput(studentId);
    const sanitizedCourseId = courseId
      ? sanitizeInput(courseId.toString())
      : null;

    if (!sanitizedTutorId || !sanitizedStudentId) {
      return NextResponse.json(
        {
          error: "Tutor ID and Student ID are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 }
      );
    }

    if (!privacyConsent) {
      return NextResponse.json(
        {
          error: "Privacy consent is required to start chat",
          code: "PRIVACY_CONSENT_REQUIRED",
        },
        { status: 400 }
      );
    }

    // Check if user is either the student or tutor in this chat
    if (
      context.dbUser.id !== sanitizedStudentId &&
      context.dbUser.id !== sanitizedTutorId &&
      !context.isSuperAdmin
    ) {
      await logSecurityEvent(
        "UNAUTHORIZED_CHAT_CREATE_ATTEMPT",
        {
          userId: context.dbUser.id,
          attemptedStudentId: sanitizedStudentId,
          attemptedTutorId: sanitizedTutorId,
        },
        context,
        request
      );

      return NextResponse.json(
        {
          error: "You can only create chat rooms you're part of",
          code: "UNAUTHORIZED_CHAT_CREATION",
        },
        { status: 403 }
      );
    }

    // In a real implementation, check if room already exists and create if not
    const roomId = `chat_room_${Date.now()}`;
    const chatRoom = {
      id: roomId,
      studentId: sanitizedStudentId,
      tutorId: sanitizedTutorId,
      courseId: sanitizedCourseId || null,
      isActive: true,
      privacyConsentStudent:
        context.role === "student" ? privacyConsent : false,
      privacyConsentTutor: context.role === "tutor" ? privacyConsent : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Log successful chat room creation
    await logSecurityEvent(
      "CHAT_ROOM_CREATED",
      {
        roomId,
        studentId: sanitizedStudentId,
        tutorId: sanitizedTutorId,
        courseId: sanitizedCourseId,
        userRole: context.role,
      },
      context,
      request
    );

    // In a real implementation, save to chat_rooms table
    console.log("[API] Chat room created:", chatRoom);

    return NextResponse.json({
      success: true,
      message: "Chat room created successfully",
      chatRoom,
    });
  } catch (error) {
    console.error("[API] Error creating chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}

// Export rate-limited POST handler
export const POST = chatRateLimit(handlePOST);
