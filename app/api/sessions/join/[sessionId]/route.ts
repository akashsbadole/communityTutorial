import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    console.log("[API] Joining live session:", params.sessionId);
    
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

    // In a real implementation, you would:
    // 1. Verify user is enrolled in the course
    // 2. Check if session is live/scheduled
    // 3. Record participant join time
    // 4. Return meeting link and credentials

    // For now, return mock session data
    const sessionData = {
      sessionId: params.sessionId,
      title: "WordPress Basics - Getting Started",
      meetingLink: "https://zoom.us/j/123456789",
      meetingPassword: "wp2024",
      status: "live",
      scheduledDate: new Date().toISOString(),
      duration: 60,
      agenda: [
        "WordPress installation and setup",
        "Understanding themes and plugins", 
        "Basic customization techniques",
        "Q&A session"
      ],
      materials: [
        {
          name: "Session Slides",
          url: "#",
          type: "pdf"
        },
        {
          name: "Code Examples",
          url: "#", 
          type: "github"
        }
      ],
      tutor: {
        name: "John Doe",
        email: "john.doe@example.com"
      }
    };

    // Record participant join (in real implementation)
    const participantId = `participant_${Date.now()}`;
    
    console.log("[API] User joined session successfully");

    return NextResponse.json({
      success: true,
      message: "Successfully joined live session",
      session: sessionData,
      participantId,
      joinedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[API] Error joining session:", error);
    return NextResponse.json(
      { error: "Failed to join session" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    console.log("[API] Getting session details:", params.sessionId);
    
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Mock session data - in real implementation, fetch from database
    const sessionData = {
      id: params.sessionId,
      title: "WordPress Basics - Getting Started",
      description: "Introduction to WordPress development fundamentals",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      status: "scheduled", // 'scheduled', 'live', 'completed', 'cancelled'
      meetingLink: "https://zoom.us/j/123456789",
      meetingPassword: "wp2024",
      maxParticipants: 50,
      currentParticipants: 12,
      agenda: [
        "WordPress installation and setup",
        "Understanding themes and plugins",
        "Basic customization techniques", 
        "Q&A session"
      ],
      materials: [
        {
          name: "Session Slides",
          url: "#",
          type: "pdf"
        },
        {
          name: "Code Examples", 
          url: "#",
          type: "github"
        },
        {
          name: "WordPress Documentation",
          url: "https://developer.wordpress.org/",
          type: "link"
        }
      ],
      tutor: {
        id: "tutor_001",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/avatars/john-doe.jpg"
      },
      course: {
        id: 1,
        title: "WordPress Development Mastery",
        category: "Web Development"
      }
    };

    return NextResponse.json({
      success: true,
      session: sessionData,
    });

  } catch (error) {
    console.error("[API] Error getting session details:", error);
    return NextResponse.json(
      { error: "Failed to get session details" },
      { status: 500 }
    );
  }
}
