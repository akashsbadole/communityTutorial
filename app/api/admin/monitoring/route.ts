import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";
import { adminRateLimit } from "@/lib/rate-limit";

// Flagged keywords for content monitoring
const FLAGGED_KEYWORDS = [
  // Harassment
  'harassment', 'harass', 'bully', 'bullying', 'intimidate', 'threaten', 'threat',
  // Inappropriate content
  'inappropriate', 'offensive', 'abuse', 'abusive', 'discriminate', 'discrimination',
  // Personal information sharing
  'phone number', 'address', 'personal info', 'meet in person', 'meet offline',
  // Spam/Commercial
  'buy now', 'click here', 'free money', 'get rich', 'make money fast',
  // Academic dishonesty
  'cheat', 'cheating', 'plagiarize', 'copy answers', 'do my homework'
];

// Calculate sentiment score (simplified)
function calculateSentimentScore(text: string): number {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'helpful', 'thank', 'thanks', 'appreciate'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'stupid', 'useless', 'worst', 'horrible'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  // Normalize to -1 to 1 scale
  const maxWords = Math.max(positiveWords.length, negativeWords.length);
  return Math.max(-1, Math.min(1, score / maxWords));
}

// Determine risk level based on content
function determineRiskLevel(text: string, flaggedKeywords: string[]): string {
  const lowerText = text.toLowerCase();
  const flaggedCount = flaggedKeywords.filter(keyword => lowerText.includes(keyword)).length;
  
  if (flaggedCount >= 3) return 'high';
  if (flaggedCount >= 1) return 'medium';
  return 'low';
}

// Get monitoring data for admin
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting admin monitoring data");
    
    // Check admin access
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (context.role !== "admin" && !context.isSuperAdmin) {
      await logSecurityEvent("UNAUTHORIZED_MONITORING_ACCESS", {
        userId: context.dbUser.id,
        userRole: context.role
      }, context, request);
      
      return NextResponse.json(
        { error: "Admin access required", code: "ADMIN_ACCESS_REQUIRED" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const riskLevel = searchParams.get('riskLevel');
    const reviewed = searchParams.get('reviewed');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get monitoring data with filters
    const monitoringData = await sql`
      SELECT 
        m.id, m.monitor_type, m.content_type, m.content_id, m.content_text,
        m.sender_id, m.sender_role, m.receiver_id, m.receiver_role,
        m.sentiment_score, m.flagged_keywords, m.risk_level,
        m.admin_reviewed, m.admin_action, m.admin_notes,
        m.reviewed_by, m.reviewed_at, m.created_at,
        u1.full_name as sender_name, u1.email as sender_email,
        u2.full_name as receiver_name, u2.email as receiver_email
      FROM admin_monitoring m
      LEFT JOIN users u1 ON m.sender_id = u1.id
      LEFT JOIN users u2 ON m.receiver_id = u2.id
      WHERE 1=1
      ${contentType ? sql`AND m.content_type = ${sanitizeInput(contentType)}` : sql``}
      ${riskLevel ? sql`AND m.risk_level = ${sanitizeInput(riskLevel)}` : sql``}
      ${reviewed === 'true' ? sql`AND m.admin_reviewed = true` : reviewed === 'false' ? sql`AND m.admin_reviewed = false` : sql``}
      ORDER BY 
        CASE m.risk_level 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        m.created_at DESC
      LIMIT ${limit};
    `;

    // Get summary statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk,
        COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk,
        COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk,
        COUNT(CASE WHEN admin_reviewed = true THEN 1 END) as reviewed,
        COUNT(CASE WHEN admin_reviewed = false THEN 1 END) as pending_review,
        COUNT(CASE WHEN content_type = 'chat' THEN 1 END) as chat_messages,
        COUNT(CASE WHEN content_type = 'notice' THEN 1 END) as notices,
        AVG(sentiment_score) as avg_sentiment
      FROM admin_monitoring
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
    `;

    // Get recent flagged content
    const recentFlagged = await sql`
      SELECT 
        content_type, content_text, risk_level, created_at,
        sender_role, flagged_keywords
      FROM admin_monitoring
      WHERE risk_level IN ('high', 'medium')
      AND admin_reviewed = false
      ORDER BY created_at DESC
      LIMIT 10;
    `;

    // Log admin access
    await logSecurityEvent("ADMIN_MONITORING_ACCESSED", {
      contentType,
      riskLevel,
      itemCount: monitoringData.length
    }, context, request);

    return NextResponse.json({
      success: true,
      data: {
        monitoringItems: monitoringData,
        statistics: stats[0],
        recentFlagged: recentFlagged,
        filters: {
          contentType,
          riskLevel,
          reviewed,
          limit
        }
      }
    });

  } catch (error) {
    console.error("[API] Error getting monitoring data:", error);
    return NextResponse.json(
      { error: "Failed to get monitoring data", code: "MONITORING_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Review and take action on flagged content
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Processing admin monitoring action");
    
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
        { error: "Admin access required", code: "ADMIN_ACCESS_REQUIRED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { monitoringId, action, notes } = body;

    // Validate required fields
    if (!monitoringId || !action) {
      return NextResponse.json(
        { error: "Monitoring ID and action are required", code: "MISSING_REQUIRED_FIELDS" },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ['approved', 'warning_sent', 'content_removed', 'user_suspended', 'escalated'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action", code: "INVALID_ACTION" },
        { status: 400 }
      );
    }

    const sanitizedMonitoringId = sanitizeInput(monitoringId);
    const sanitizedAction = sanitizeInput(action);
    const sanitizedNotes = notes ? sanitizeInput(notes) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get monitoring item details
    const monitoringItem = await sql`
      SELECT 
        id, content_type, content_id, sender_id, sender_role,
        content_text, risk_level
      FROM admin_monitoring 
      WHERE id = ${sanitizedMonitoringId};
    `;

    if (monitoringItem.length === 0) {
      return NextResponse.json(
        { error: "Monitoring item not found", code: "MONITORING_ITEM_NOT_FOUND" },
        { status: 404 }
      );
    }

    const item = monitoringItem[0];

    // Update monitoring record
    await sql`
      UPDATE admin_monitoring 
      SET 
        admin_reviewed = true,
        admin_action = ${sanitizedAction},
        admin_notes = ${sanitizedNotes},
        reviewed_by = ${context.dbUser.id},
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ${sanitizedMonitoringId};
    `;

    // Take appropriate action based on the decision
    switch (sanitizedAction) {
      case 'content_removed':
        // Remove content based on type
        if (item.content_type === 'notice') {
          await sql`
            UPDATE notice_board 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${item.content_id};
          `;
        } else if (item.content_type === 'chat') {
          await sql`
            UPDATE chat_messages 
            SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${item.content_id};
          `;
        }
        break;

      case 'warning_sent':
        // Create a warning record (would trigger email notification)
        const warningId = `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await sql`
          INSERT INTO admin_activities (
            id, admin_id, activity_type, description, target_user_id, metadata
          ) VALUES (
            ${warningId}, ${context.dbUser.id}, 'warning_sent',
            'Warning sent for inappropriate content', ${item.sender_id},
            ${JSON.stringify({ monitoringId: sanitizedMonitoringId, contentType: item.content_type })}
          );
        `;
        break;

      case 'user_suspended':
        // Suspend user (would require additional user status field)
        await sql`
          INSERT INTO admin_activities (
            id, admin_id, activity_type, description, target_user_id, metadata
          ) VALUES (
            ${`suspend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}, 
            ${context.dbUser.id}, 'user_suspended',
            'User suspended for policy violation', ${item.sender_id},
            ${JSON.stringify({ monitoringId: sanitizedMonitoringId, reason: sanitizedNotes })}
          );
        `;
        break;
    }

    // Log admin action
    await logSecurityEvent("ADMIN_MONITORING_ACTION", {
      monitoringId: sanitizedMonitoringId,
      action: sanitizedAction,
      contentType: item.content_type,
      riskLevel: item.risk_level,
      targetUserId: item.sender_id
    }, context, request);

    console.log(`[API] Admin action taken: ${sanitizedAction} on ${sanitizedMonitoringId}`);

    return NextResponse.json({
      success: true,
      message: "Admin action completed successfully",
      action: {
        monitoringId: sanitizedMonitoringId,
        action: sanitizedAction,
        notes: sanitizedNotes,
        reviewedBy: context.dbUser.fullName,
        reviewedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("[API] Error processing admin action:", error);
    return NextResponse.json(
      { error: "Failed to process admin action", code: "ADMIN_ACTION_ERROR" },
      { status: 500 }
    );
  }
}

// Add content to monitoring (called by other APIs)
export async function addToMonitoring(
  monitorType: string,
  contentType: string,
  contentId: string,
  contentText: string,
  senderId: string,
  senderRole: string,
  receiverId?: string,
  receiverRole?: string
) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Analyze content
    const flaggedKeywords = FLAGGED_KEYWORDS.filter(keyword => 
      contentText.toLowerCase().includes(keyword)
    );
    
    const sentimentScore = calculateSentimentScore(contentText);
    const riskLevel = determineRiskLevel(contentText, flaggedKeywords);
    
    // Only add to monitoring if there's potential risk
    if (riskLevel !== 'low' || flaggedKeywords.length > 0) {
      const monitoringId = `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await sql`
        INSERT INTO admin_monitoring (
          id, monitor_type, content_type, content_id, content_text,
          sender_id, sender_role, receiver_id, receiver_role,
          sentiment_score, flagged_keywords, risk_level
        ) VALUES (
          ${monitoringId}, ${monitorType}, ${contentType}, ${contentId}, ${contentText},
          ${senderId}, ${senderRole}, ${receiverId || null}, ${receiverRole || null},
          ${sentimentScore}, ${flaggedKeywords}, ${riskLevel}
        );
      `;
      
      console.log(`[MONITORING] Added ${contentType} to monitoring: ${riskLevel} risk`);
    }
    
  } catch (error) {
    console.error("[MONITORING] Error adding content to monitoring:", error);
  }
}

// Export rate-limited handlers
export const GET = adminRateLimit(handleGET);
export const POST = adminRateLimit(handlePOST);
