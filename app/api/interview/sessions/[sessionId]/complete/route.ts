import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  getSecurityContext,
  logSecurityEvent,
  sanitizeInput,
} from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Complete interview session
async function handlePOST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(`[API] Completing session: ${resolvedParams.sessionId}`);

    const context = await getSecurityContext();
    const body = await request.json();
    const { totalDuration, responses = [] } = body;

    const sanitizedSessionId = sanitizeInput(resolvedParams.sessionId);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get session data
    const sessions = await sql`
      SELECT
        id, student_id, language_id, total_questions, session_status
      FROM interview_sessions
      WHERE id = ${sanitizedSessionId};
    `;

    if (sessions.length === 0) {
      return NextResponse.json(
        { error: "Session not found", code: "SESSION_NOT_FOUND" },
        { status: 404 }
      );
    }

    const session = sessions[0];

    if (session.session_status === "completed") {
      return NextResponse.json(
        {
          error: "Session already completed",
          code: "SESSION_ALREADY_COMPLETED",
        },
        { status: 409 }
      );
    }

    // Calculate overall scores
    const responseScores = responses
      .filter((r) => r.confidenceScore)
      .map((r) => r.confidenceScore);
    const overallScore =
      responseScores.length > 0
        ? responseScores.reduce((a, b) => a + b, 0) / responseScores.length
        : 0;

    const confidenceScores = responses
      .filter((r) => r.voiceAnalysis?.confidence_score)
      .map((r) => r.voiceAnalysis.confidence_score);
    const avgConfidence =
      confidenceScores.length > 0
        ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
        : 0;

    // Update session as completed
    await sql`
      UPDATE interview_sessions
      SET
        session_status = 'completed',
        end_time = CURRENT_TIMESTAMP,
        total_duration = ${totalDuration || 0},
        overall_score = ${overallScore},
        confidence_score = ${avgConfidence}
      WHERE id = ${sanitizedSessionId};
    `;

    // Update or create analytics record
    const studentId = session.student_id;
    const languageId = session.language_id;

    if (studentId !== "anonymous_user") {
      // Check if analytics record exists
      const existingAnalytics = await sql`
        SELECT id FROM interview_analytics
        WHERE student_id = ${studentId} AND language_id = ${languageId};
      `;

      if (existingAnalytics.length > 0) {
        // Update existing analytics
        await sql`
          UPDATE interview_analytics
          SET
            total_sessions = total_sessions + 1,
            total_questions_answered = total_questions_answered + ${responses.length},
            average_score = (average_score * (total_sessions - 1) + ${overallScore}) / total_sessions,
            average_confidence = (average_confidence * (total_sessions - 1) + ${avgConfidence}) / total_sessions,
            last_session_date = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE student_id = ${studentId} AND language_id = ${languageId};
        `;
      } else {
        // Create new analytics record
        const analyticsId = `analytics_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        await sql`
          INSERT INTO interview_analytics (
            id, student_id, language_id, total_sessions, total_questions_answered,
            average_score, average_confidence, last_session_date
          ) VALUES (
            ${analyticsId}, ${studentId}, ${languageId}, 1, ${responses.length},
            ${overallScore}, ${avgConfidence}, CURRENT_TIMESTAMP
          );
        `;
      }
    }

    // Log session completion
    if (context) {
      await logSecurityEvent(
        "INTERVIEW_SESSION_COMPLETED",
        {
          sessionId: sanitizedSessionId,
          languageId: session.language_id,
          totalQuestions: session.total_questions,
          responsesCount: responses.length,
          overallScore,
          avgConfidence,
          totalDuration,
        },
        context,
        request
      );
    }

    // Get final session data
    const completedSession = await sql`
      SELECT
        s.id, s.language_id, s.total_questions, s.session_status,
        s.start_time, s.end_time, s.total_duration, s.overall_score,
        s.confidence_score, l.name as language_name
      FROM interview_sessions s
      JOIN programming_languages l ON s.language_id = l.id
      WHERE s.id = ${sanitizedSessionId};
    `;

    console.log(`[API] Session completed: ${sanitizedSessionId}`);

    return NextResponse.json({
      success: true,
      message: "Session completed successfully",
      session: completedSession[0],
      results: {
        totalQuestions: session.total_questions,
        answeredQuestions: responses.length,
        overallScore: Math.round(overallScore),
        confidenceScore: Math.round(avgConfidence),
        totalDuration,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      `[API] Error completing session ${resolvedParams.sessionId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to complete session", code: "SESSION_COMPLETION_ERROR" },
      { status: 500 }
    );
  }
}

// Export handler
export const POST = handlePOST;
