import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Sending message to tutor");
    
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
    const { tutorId, subject, message, messageType, courseId } = body;

    if (!tutorId || !message) {
      return NextResponse.json(
        { error: "Tutor ID and message are required" },
        { status: 400 }
      );
    }

    if (!messageType || !["platform", "email", "whatsapp"].includes(messageType)) {
      return NextResponse.json(
        { error: "Valid message type is required (platform, email, whatsapp)" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Verify user is enrolled with this tutor
    // 2. Check if messaging is allowed (privacy consent)
    // 3. Save message to database
    // 4. Send notification to tutor
    // 5. Handle different message types (email, WhatsApp, etc.)

    // Mock message data
    const messageId = `message_${Date.now()}`;
    const messageData = {
      id: messageId,
      senderId: dbUser.id,
      senderName: user.fullName,
      receiverId: tutorId,
      subject: subject || "Message from Student",
      message,
      messageType,
      courseId: courseId || null,
      isRead: false,
      sentAt: new Date().toISOString(),
    };

    // Mock tutor response based on message type
    let deliveryInfo = {};
    
    switch (messageType) {
      case "platform":
        deliveryInfo = {
          method: "Platform Message",
          status: "delivered",
          description: "Message sent through platform messaging system"
        };
        break;
      case "email":
        deliveryInfo = {
          method: "Email",
          status: "sent",
          description: "Email sent to tutor's registered email address",
          emailAddress: "john.doe@example.com"
        };
        break;
      case "whatsapp":
        deliveryInfo = {
          method: "WhatsApp",
          status: "sent", 
          description: "Message sent via WhatsApp",
          phoneNumber: "+1987654321"
        };
        break;
    }

    console.log("[API] Message sent successfully:", messageId);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageData,
      delivery: deliveryInfo,
      estimatedResponse: "Tutors typically respond within 2-4 hours during business hours",
    });

  } catch (error) {
    console.error("[API] Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting message history");
    
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

    // Mock message history - in real implementation, fetch from database
    const messageHistory = [
      {
        id: "message_001",
        senderId: dbUser.id,
        senderName: user.fullName,
        receiverId: "tutor_001",
        receiverName: "John Doe",
        subject: "Question about WordPress Hooks",
        message: "Hi John, I'm having trouble understanding how WordPress hooks work. Could you explain the difference between actions and filters?",
        messageType: "platform",
        courseId: 1,
        courseName: "WordPress Development Mastery",
        isRead: true,
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reply: {
          id: "reply_001",
          message: "Great question! Actions allow you to add functionality at specific points, while filters let you modify data. I'll cover this in detail in our next session.",
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        }
      },
      {
        id: "message_002",
        senderId: dbUser.id,
        senderName: user.fullName,
        receiverId: "tutor_001", 
        receiverName: "John Doe",
        subject: "Assignment Clarification",
        message: "For the theme assignment, should I include custom post types or focus only on the basic structure?",
        messageType: "email",
        courseId: 1,
        courseName: "WordPress Development Mastery",
        isRead: true,
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reply: {
          id: "reply_002",
          message: "Focus on the basic structure first. Custom post types are bonus points but not required for this assignment.",
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        }
      },
      {
        id: "message_003",
        senderId: dbUser.id,
        senderName: user.fullName,
        receiverId: "tutor_001",
        receiverName: "John Doe", 
        subject: "Session Reschedule Request",
        message: "Hi, I have a conflict with tomorrow's session. Can we reschedule to Thursday?",
        messageType: "whatsapp",
        courseId: 1,
        courseName: "WordPress Development Mastery",
        isRead: false,
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        reply: null
      }
    ];

    return NextResponse.json({
      success: true,
      messages: messageHistory,
      totalMessages: messageHistory.length,
      unreadMessages: messageHistory.filter(m => !m.isRead).length,
    });

  } catch (error) {
    console.error("[API] Error getting message history:", error);
    return NextResponse.json(
      { error: "Failed to get message history" },
      { status: 500 }
    );
  }
}
