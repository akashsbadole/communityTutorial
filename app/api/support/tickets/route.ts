import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Creating support ticket");
    
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
    const { category, priority, subject, description } = body;

    if (!category || !subject || !description) {
      return NextResponse.json(
        { error: "Category, subject, and description are required" },
        { status: 400 }
      );
    }

    const validCategories = ["technical", "billing", "course", "general"];
    const validPriorities = ["low", "normal", "high", "urgent"];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be one of: technical, billing, course, general" },
        { status: 400 }
      );
    }

    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority. Must be one of: low, normal, high, urgent" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Save ticket to database
    // 2. Generate unique ticket number
    // 3. Send confirmation email to user
    // 4. Notify support team
    // 5. Set up auto-responses based on category

    // Mock ticket data
    const ticketId = `ticket_${Date.now()}`;
    const ticketNumber = `TH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const ticketData = {
      id: ticketId,
      ticketNumber,
      userId: dbUser.id,
      userName: user.fullName,
      userEmail: user.emailAddresses[0]?.emailAddress,
      category,
      priority: priority || "normal",
      subject,
      description,
      status: "open",
      assignedTo: null,
      resolution: null,
      createdAt: new Date().toISOString(),
      estimatedResponse: getEstimatedResponse(priority || "normal"),
    };

    console.log("[API] Support ticket created successfully:", ticketNumber);

    return NextResponse.json({
      success: true,
      message: "Support ticket created successfully",
      ticket: ticketData,
      nextSteps: [
        "You will receive a confirmation email shortly",
        "Our support team will review your ticket",
        "You'll be notified of any updates via email",
        "You can track your ticket status in your dashboard"
      ],
    });

  } catch (error) {
    console.error("[API] Error creating support ticket:", error);
    return NextResponse.json(
      { error: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting user support tickets");
    
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

    // Mock tickets data - in real implementation, fetch from database
    const tickets = [
      {
        id: "ticket_001",
        ticketNumber: "TH-ABC123",
        category: "technical",
        priority: "high",
        subject: "Cannot access course videos",
        description: "I'm unable to play any of the course videos. They just show a loading spinner.",
        status: "in_progress",
        assignedTo: {
          id: "support_001",
          name: "Sarah Johnson",
          role: "Technical Support"
        },
        resolution: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        messages: [
          {
            id: "msg_001",
            senderId: dbUser.id,
            senderName: user.fullName,
            message: "I'm unable to play any of the course videos. They just show a loading spinner.",
            isInternal: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "msg_002",
            senderId: "support_001",
            senderName: "Sarah Johnson",
            message: "Hi! I'm looking into this issue. Can you please tell me which browser you're using and if you have any ad blockers enabled?",
            isInternal: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "msg_003",
            senderId: dbUser.id,
            senderName: user.fullName,
            message: "I'm using Chrome with uBlock Origin. Let me try disabling it.",
            isInternal: false,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          }
        ]
      },
      {
        id: "ticket_002",
        ticketNumber: "TH-DEF456",
        category: "billing",
        priority: "normal",
        subject: "Refund request for course",
        description: "I'd like to request a refund for the WordPress course as I'm unable to continue due to personal reasons.",
        status: "resolved",
        assignedTo: {
          id: "support_002",
          name: "Mike Chen",
          role: "Billing Support"
        },
        resolution: "Refund processed successfully. Amount will be credited to your original payment method within 5-7 business days.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        messages: [
          {
            id: "msg_004",
            senderId: dbUser.id,
            senderName: user.fullName,
            message: "I'd like to request a refund for the WordPress course as I'm unable to continue due to personal reasons.",
            isInternal: false,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "msg_005",
            senderId: "support_002",
            senderName: "Mike Chen",
            message: "I understand your situation. I've processed your refund request. You should see the amount credited within 5-7 business days.",
            isInternal: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ]
      }
    ];

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === "open").length,
      inProgress: tickets.filter(t => t.status === "in_progress").length,
      resolved: tickets.filter(t => t.status === "resolved").length,
      closed: tickets.filter(t => t.status === "closed").length,
    };

    return NextResponse.json({
      success: true,
      tickets,
      stats,
    });

  } catch (error) {
    console.error("[API] Error getting support tickets:", error);
    return NextResponse.json(
      { error: "Failed to get support tickets" },
      { status: 500 }
    );
  }
}

function getEstimatedResponse(priority: string): string {
  switch (priority) {
    case "urgent":
      return "Within 1 hour";
    case "high":
      return "Within 4 hours";
    case "normal":
      return "Within 24 hours";
    case "low":
      return "Within 48 hours";
    default:
      return "Within 24 hours";
  }
}
