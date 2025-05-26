import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    console.log("[HEALTH] Health check endpoint called");
    
    // Test Clerk authentication
    const user = await currentUser();
    
    // Test database connection (import db functions)
    const { getUserByClerkId } = await import("@/lib/db");
    
    let dbStatus = "disconnected";
    let userStatus = "not_authenticated";
    
    if (user?.id) {
      userStatus = "authenticated";
      try {
        // Try to query database
        await getUserByClerkId(user.id);
        dbStatus = "connected";
      } catch (dbError) {
        console.error("[HEALTH] Database error:", dbError);
        dbStatus = "error";
      }
    }
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      auth: {
        status: userStatus,
        userId: user?.id || null,
        email: user?.emailAddresses[0]?.emailAddress || null,
      },
      database: {
        status: dbStatus,
      },
      environment: process.env.NODE_ENV,
    });

  } catch (error) {
    console.error("[HEALTH] Health check error:", error);
    return NextResponse.json(
      { 
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
