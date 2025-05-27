import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { validateEmail, sanitizeInput, logSecurityEvent } from "@/lib/security";
import { emailSubscriptionRateLimit } from "@/lib/rate-limit";

// Mailchimp integration (will be implemented when package is available)
async function addToMailchimp(email: string, preferences: any = {}) {
  try {
    // Check if Mailchimp credentials are available
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || "us1";

    if (!apiKey || !audienceId) {
      console.log(
        "[MAILCHIMP] Credentials not configured, skipping Mailchimp integration"
      );
      return { success: false, reason: "credentials_missing" };
    }

    // Mailchimp API integration would go here
    // For now, we'll simulate the integration
    console.log(`[MAILCHIMP] Would add ${email} to audience ${audienceId}`);

    // Simulate successful addition
    return {
      success: true,
      mailchimp_id: `mock_${Date.now()}`,
      status: "subscribed",
    };
  } catch (error) {
    console.error("[MAILCHIMP] Error adding subscriber:", error);
    return { success: false, error: error.message };
  }
}

async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Email subscription request");

    // Get request data
    const body = await request.json();
    const { email, source = "footer", preferences = {} } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Valid email address is required", code: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedSource = sanitizeInput(source);

    // Get client info for tracking
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if email already exists
    const existingSubscription = await sql`
      SELECT id, email, status, mailchimp_id
      FROM email_subscriptions
      WHERE email = ${sanitizedEmail};
    `;

    if (existingSubscription.length > 0) {
      const subscription = existingSubscription[0];

      if (subscription.status === "active") {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed to our newsletter!",
          status: "already_subscribed",
          subscription_id: subscription.id,
        });
      } else {
        // Reactivate subscription
        await sql`
          UPDATE email_subscriptions
          SET status = 'active',
              unsubscribed_at = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE email = ${sanitizedEmail};
        `;

        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          status: "reactivated",
          subscription_id: subscription.id,
        });
      }
    }

    // Create new subscription
    const subscriptionId = `sub_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const verificationToken = Math.random().toString(36).substr(2, 32);

    // Add to Mailchimp
    const mailchimpResult = await addToMailchimp(sanitizedEmail, preferences);

    // Save to database
    await sql`
      INSERT INTO email_subscriptions (
        id, email, source, preferences, ip_address, user_agent,
        verification_token, mailchimp_id, verified, status
      ) VALUES (
        ${subscriptionId}, ${sanitizedEmail}, ${sanitizedSource},
        ${JSON.stringify(preferences)}, ${ipAddress}, ${userAgent},
        ${verificationToken}, ${mailchimpResult.mailchimp_id || null},
        ${mailchimpResult.success}, 'active'
      );
    `;

    // Log the subscription event
    await logSecurityEvent(
      "EMAIL_SUBSCRIPTION",
      {
        email: sanitizedEmail,
        source: sanitizedSource,
        mailchimp_success: mailchimpResult.success,
        ip_address: ipAddress,
      },
      undefined,
      request
    );

    console.log(`[API] Email subscription created: ${sanitizedEmail}`);

    // Send welcome email (would be implemented with email service)
    // await sendWelcomeEmail(sanitizedEmail);

    return NextResponse.json({
      success: true,
      message:
        "Thank you for subscribing! You'll receive updates about our latest courses and offers.",
      status: "subscribed",
      subscription_id: subscriptionId,
      mailchimp_integrated: mailchimpResult.success,
      verification_required: !mailchimpResult.success,
    });
  } catch (error) {
    console.error("[API] Error processing email subscription:", error);

    // Log the error
    await logSecurityEvent(
      "EMAIL_SUBSCRIPTION_ERROR",
      {
        error: error.message,
        stack: error.stack,
      },
      undefined,
      request
    );

    return NextResponse.json(
      {
        error: "Failed to process subscription. Please try again.",
        code: "SUBSCRIPTION_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting email subscription stats");

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get subscription statistics
    const stats = await sql`
      SELECT
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed,
        COUNT(CASE WHEN verified = true THEN 1 END) as verified_subscriptions,
        COUNT(CASE WHEN source = 'footer' THEN 1 END) as footer_subscriptions,
        COUNT(CASE WHEN source = 'course_page' THEN 1 END) as course_page_subscriptions
      FROM email_subscriptions;
    `;

    // Get recent subscriptions
    const recentSubscriptions = await sql`
      SELECT email, source, subscribed_at, verified, status
      FROM email_subscriptions
      ORDER BY subscribed_at DESC
      LIMIT 10;
    `;

    return NextResponse.json({
      success: true,
      stats: stats[0],
      recent_subscriptions: recentSubscriptions,
      isDummyData: true,
    });
  } catch (error) {
    console.error("[API] Error getting subscription stats:", error);
    return NextResponse.json(
      { error: "Failed to get subscription stats" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("[API] Unsubscribe request");

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Find subscription
    const subscription = await sql`
      SELECT id, verification_token, mailchimp_id
      FROM email_subscriptions
      WHERE email = ${sanitizedEmail} AND status = 'active';
    `;

    if (subscription.length === 0) {
      return NextResponse.json(
        { error: "Subscription not found or already unsubscribed" },
        { status: 404 }
      );
    }

    // Verify token if provided
    if (token && subscription[0].verification_token !== token) {
      return NextResponse.json(
        { error: "Invalid unsubscribe token" },
        { status: 403 }
      );
    }

    // Update subscription status
    await sql`
      UPDATE email_subscriptions
      SET status = 'unsubscribed',
          unsubscribed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ${sanitizedEmail};
    `;

    // Remove from Mailchimp (would be implemented)
    // await removeFromMailchimp(subscription[0].mailchimp_id);

    // Log the unsubscribe event
    await logSecurityEvent(
      "EMAIL_UNSUBSCRIBE",
      {
        email: sanitizedEmail,
        token_verified: !!token,
      },
      undefined,
      request
    );

    console.log(`[API] Email unsubscribed: ${sanitizedEmail}`);

    return NextResponse.json({
      success: true,
      message: "You have been successfully unsubscribed from our newsletter.",
    });
  } catch (error) {
    console.error("[API] Error processing unsubscribe:", error);
    return NextResponse.json(
      { error: "Failed to process unsubscribe request" },
      { status: 500 }
    );
  }
}

// Export rate-limited POST handler
export const POST = emailSubscriptionRateLimit(handlePOST);
