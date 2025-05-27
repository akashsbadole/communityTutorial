import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting chat messages");
    
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

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // In a real implementation, verify user has access to this room
    // and fetch messages from chat_messages table
    
    // Mock chat messages
    const messages = [
      {
        id: "msg_001",
        roomId: roomId,
        senderId: "student_001",
        senderName: "Alice Johnson",
        senderRole: "student",
        message: "Hi John, I have a question about the WordPress assignment.",
        messageType: "text",
        isRead: true,
        isDeleted: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg_002",
        roomId: roomId,
        senderId: "tutor_001",
        senderName: "John Doe",
        senderRole: "tutor",
        message: "Hello! I'd be happy to help. What specific part are you having trouble with?",
        messageType: "text",
        isRead: dbUser.role === "tutor",
        isDeleted: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg_003",
        roomId: roomId,
        senderId: "student_001",
        senderName: "Alice Johnson",
        senderRole: "student",
        message: "I'm struggling with creating custom post types. The code doesn't seem to work.",
        messageType: "text",
        isRead: false,
        isDeleted: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      messages,
      totalMessages: messages.length,
      unreadCount: messages.filter(m => !m.isRead && m.senderId !== dbUser.id).length,
      isDummyData: true,
    });

  } catch (error) {
    console.error("[API] Error getting chat messages:", error);
    return NextResponse.json(
      { error: "Failed to get chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Sending chat message");
    
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
    const { roomId, message, messageType, replyToId } = body;

    if (!roomId || !message) {
      return NextResponse.json(
        { error: "Room ID and message are required" },
        { status: 400 }
      );
    }

    // In a real implementation, verify user has access to this room
    // and both parties have given privacy consent

    // Create new message
    const messageId = `msg_${Date.now()}`;
    const newMessage = {
      id: messageId,
      roomId,
      senderId: dbUser.id,
      senderName: user.fullName,
      senderRole: dbUser.role,
      message: message.trim(),
      messageType: messageType || "text",
      fileUrl: null,
      fileName: null,
      fileSize: null,
      isRead: false,
      isDeleted: false,
      replyToId: replyToId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real implementation, save to chat_messages table
    console.log("[API] Chat message sent:", newMessage);

    // Update room's last activity
    // In a real implementation, update chat_rooms table

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageData: newMessage,
    });

  } catch (error) {
    console.error("[API] Error sending chat message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("[API] Updating chat message");
    
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
    const { messageId, action, roomId } = body;

    if (!messageId || !action) {
      return NextResponse.json(
        { error: "Message ID and action are required" },
        { status: 400 }
      );
    }

    let result = {};

    switch (action) {
      case "mark_read":
        // Mark message as read
        // In a real implementation, update chat_messages table
        result = {
          messageId,
          isRead: true,
          readAt: new Date().toISOString(),
        };
        break;

      case "mark_room_read":
        // Mark all messages in room as read
        if (!roomId) {
          return NextResponse.json(
            { error: "Room ID is required for mark_room_read action" },
            { status: 400 }
          );
        }
        // In a real implementation, update all unread messages in room
        result = {
          roomId,
          markedRead: true,
          updatedAt: new Date().toISOString(),
        };
        break;

      case "delete":
        // Soft delete message (only sender can delete)
        // In a real implementation, verify sender and update chat_messages table
        result = {
          messageId,
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    console.log("[API] Chat message updated:", result);

    return NextResponse.json({
      success: true,
      message: "Message updated successfully",
      result,
    });

  } catch (error) {
    console.error("[API] Error updating chat message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
