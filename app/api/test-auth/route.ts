import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    console.log("[TEST] Testing auth endpoint");
    
    const { userId: clerkUserId } = auth();
    console.log("[TEST] Clerk user ID:", clerkUserId);
    
    if (!clerkUserId) {
      console.log("[TEST] No user ID found");
      return NextResponse.json(
        { 
          error: "Unauthorized", 
          authenticated: false,
          userId: null 
        },
        { status: 401 }
      );
    }

    console.log("[TEST] User authenticated successfully");
    return NextResponse.json({
      success: true,
      authenticated: true,
      userId: clerkUserId,
      message: "Authentication working correctly"
    });

  } catch (error) {
    console.error("[TEST] Auth test error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
