import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting email subscription management data");
    
    // Check admin access
    const context = await getSecurityContext();
    if (!context) {
      await logSecurityEvent("UNAUTHORIZED_EMAIL_ADMIN_ACCESS", { endpoint: "/api/admin/email-subscriptions" }, undefined, request);
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (context.role !== "admin" && !context.isSuperAdmin) {
      await logSecurityEvent("INSUFFICIENT_PERMISSIONS_EMAIL_ADMIN", { 
        endpoint: "/api/admin/email-subscriptions",
        userRole: context.role 
      }, context, request);
      
      return NextResponse.json(
        { 
          error: "Admin access required", 
          code: "ADMIN_ACCESS_REQUIRED",
          userRole: context.role 
        },
        { status: 403 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);
    
    // Get comprehensive subscription statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed,
        COUNT(CASE WHEN verified = true THEN 1 END) as verified_subscriptions,
        COUNT(CASE WHEN source = 'footer' THEN 1 END) as footer_subscriptions,
        COUNT(CASE WHEN source = 'course_page' THEN 1 END) as course_page_subscriptions,
        COUNT(CASE WHEN source = 'popup' THEN 1 END) as popup_subscriptions,
        COUNT(CASE WHEN mailchimp_id IS NOT NULL THEN 1 END) as mailchimp_synced
      FROM email_subscriptions;
    `;
    
    // Get recent subscriptions with details
    const recentSubscriptions = await sql`
      SELECT 
        id, email, source, status, verified, mailchimp_id,
        subscribed_at, unsubscribed_at, ip_address,
        preferences
      FROM email_subscriptions 
      ORDER BY subscribed_at DESC 
      LIMIT 50;
    `;
    
    // Get subscription trends (last 30 days)
    const trends = await sql`
      SELECT 
        DATE(subscribed_at) as date,
        COUNT(*) as subscriptions,
        COUNT(CASE WHEN source = 'footer' THEN 1 END) as footer_subs,
        COUNT(CASE WHEN source = 'course_page' THEN 1 END) as course_subs
      FROM email_subscriptions 
      WHERE subscribed_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(subscribed_at)
      ORDER BY date DESC;
    `;
    
    // Get email campaigns if any
    const campaigns = await sql`
      SELECT 
        id, name, subject, status, recipients_count,
        open_rate, click_rate, sent_at, created_at
      FROM email_campaigns 
      ORDER BY created_at DESC 
      LIMIT 20;
    `;

    // Log successful access
    await logSecurityEvent("EMAIL_ADMIN_ACCESS", { 
      endpoint: "/api/admin/email-subscriptions",
      totalSubscriptions: stats[0].total_subscriptions 
    }, context, request);

    return NextResponse.json({
      success: true,
      data: {
        stats: stats[0],
        recent_subscriptions: recentSubscriptions,
        trends: trends,
        campaigns: campaigns,
        mailchimp_configured: !!(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID)
      },
      isDummyData: false
    });
    
  } catch (error) {
    console.error("[API] Error getting email subscription data:", error);
    return NextResponse.json(
      { error: "Failed to get email subscription data", code: "DATABASE_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Admin email action");
    
    // Check admin access
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (context.role !== "admin" && !context.isSuperAdmin) {
      return NextResponse.json(
        { 
          error: "Admin access required", 
          code: "ADMIN_ACCESS_REQUIRED" 
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, email, campaignData } = body;

    // Sanitize inputs
    const sanitizedAction = sanitizeInput(action);
    const sanitizedEmail = email ? sanitizeInput(email.toLowerCase()) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    switch (sanitizedAction) {
      case 'unsubscribe_user':
        if (!sanitizedEmail) {
          return NextResponse.json(
            { error: "Email is required for unsubscribe action" },
            { status: 400 }
          );
        }

        await sql`
          UPDATE email_subscriptions 
          SET status = 'unsubscribed', 
              unsubscribed_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE email = ${sanitizedEmail};
        `;

        await logSecurityEvent("ADMIN_UNSUBSCRIBE_USER", {
          email: sanitizedEmail,
          adminId: context.dbUser.id
        }, context, request);

        return NextResponse.json({
          success: true,
          message: `User ${sanitizedEmail} has been unsubscribed`
        });

      case 'reactivate_user':
        if (!sanitizedEmail) {
          return NextResponse.json(
            { error: "Email is required for reactivate action" },
            { status: 400 }
          );
        }

        await sql`
          UPDATE email_subscriptions 
          SET status = 'active', 
              unsubscribed_at = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE email = ${sanitizedEmail};
        `;

        await logSecurityEvent("ADMIN_REACTIVATE_USER", {
          email: sanitizedEmail,
          adminId: context.dbUser.id
        }, context, request);

        return NextResponse.json({
          success: true,
          message: `User ${sanitizedEmail} has been reactivated`
        });

      case 'create_campaign':
        if (!campaignData || !campaignData.name || !campaignData.subject) {
          return NextResponse.json(
            { error: "Campaign name and subject are required" },
            { status: 400 }
          );
        }

        const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await sql`
          INSERT INTO email_campaigns (
            id, name, subject, content, status, created_by
          ) VALUES (
            ${campaignId}, 
            ${sanitizeInput(campaignData.name)}, 
            ${sanitizeInput(campaignData.subject)},
            ${sanitizeInput(campaignData.content || '')},
            'draft',
            ${context.dbUser.id}
          );
        `;

        await logSecurityEvent("ADMIN_CREATE_CAMPAIGN", {
          campaignId,
          campaignName: campaignData.name,
          adminId: context.dbUser.id
        }, context, request);

        return NextResponse.json({
          success: true,
          message: "Email campaign created successfully",
          campaignId
        });

      case 'export_subscribers':
        const subscribers = await sql`
          SELECT email, source, status, verified, subscribed_at
          FROM email_subscriptions 
          WHERE status = 'active'
          ORDER BY subscribed_at DESC;
        `;

        await logSecurityEvent("ADMIN_EXPORT_SUBSCRIBERS", {
          count: subscribers.length,
          adminId: context.dbUser.id
        }, context, request);

        return NextResponse.json({
          success: true,
          message: "Subscriber data exported",
          data: subscribers,
          count: subscribers.length
        });

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error("[API] Error processing admin email action:", error);
    return NextResponse.json(
      { error: "Failed to process admin action", code: "PROCESSING_ERROR" },
      { status: 500 }
    );
  }
}
