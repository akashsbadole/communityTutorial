import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    console.log("[DEBUG] Auth debug endpoint called");

    const { userId: authUserId } = auth();
    const user = await currentUser();

    console.log("[DEBUG] Auth userId:", authUserId);
    console.log("[DEBUG] CurrentUser ID:", user?.id);
    console.log(
      "[DEBUG] CurrentUser email:",
      user?.emailAddresses[0]?.emailAddress
    );
    console.log("[DEBUG] CurrentUser fullName:", user?.fullName);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authMethod: {
        authUserId,
        currentUserId: user?.id,
        currentUserEmail: user?.emailAddresses[0]?.emailAddress,
        currentUserName: user?.fullName,
        isAuthenticated: !!user?.id,
      },
      clerkHeaders: {
        authStatus: request.headers.get("x-clerk-auth-status"),
        authReason: request.headers.get("x-clerk-auth-reason"),
        authMessage: request.headers.get("x-clerk-auth-message"),
      },
      cookies: request.cookies.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value.substring(0, 20) + "...", // Truncate for security
      })),
    });
  } catch (error) {
    console.error("[DEBUG] Auth debug error:", error);
    return NextResponse.json(
      {
        error: "Debug error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
