import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  getSecurityContext,
  logSecurityEvent,
  sanitizeInput,
} from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Get specific interview session
async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(`[API] Getting session data for: ${resolvedParams.sessionId}`);

    const sanitizedSessionId = sanitizeInput(resolvedParams.sessionId);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get session data
    const sessions = await sql`
      SELECT
        s.id, s.student_id, s.language_id, s.session_type, s.total_questions,
        s.current_question, s.session_status, s.start_time, s.end_time,
        s.total_duration, s.overall_score, s.confidence_score,
        s.session_settings, s.voice_analysis_data,
        l.name as language_name, l.slug as language_slug, l.color_code
      FROM interview_sessions s
      JOIN programming_languages l ON s.language_id = l.id
      WHERE s.id = ${sanitizedSessionId};
    `;

    if (sessions.length === 0) {
      return NextResponse.json(
        { error: "Interview session not found", code: "SESSION_NOT_FOUND" },
        { status: 404 }
      );
    }

    const session = sessions[0];

    // Get questions for this session (recreate the same random set)
    const sessionSettings = session.session_settings || {
      difficulty: "mixed",
      questionCount: 10,
    };

    let questions;
    if (sessionSettings.difficulty === "mixed") {
      questions = await sql`
        SELECT
          id, question_title, question_text, answer_text, code_example,
          explanation, difficulty, category, time_to_answer, tags, question_order
        FROM interview_questions
        WHERE language_id = ${session.language_id} AND is_active = true
        ORDER BY question_order ASC, id ASC
        LIMIT ${session.total_questions};
      `;
    } else {
      questions = await sql`
        SELECT
          id, question_title, question_text, answer_text, code_example,
          explanation, difficulty, category, time_to_answer, tags, question_order
        FROM interview_questions
        WHERE language_id = ${session.language_id}
        AND difficulty = ${sessionSettings.difficulty}
        AND is_active = true
        ORDER BY question_order ASC, id ASC
        LIMIT ${session.total_questions};
      `;
    }

    // Get existing responses for this session
    const responses = await sql`
      SELECT
        id, question_id, student_answer, response_time, confidence_score,
        voice_analysis, is_correct, feedback, created_at
      FROM interview_responses
      WHERE session_id = ${sanitizedSessionId}
      ORDER BY created_at ASC;
    `;

    // Add response data to questions
    const questionsWithResponses = questions.map((question) => {
      const response = responses.find((r) => r.question_id === question.id);
      return {
        ...question,
        response: response || null,
      };
    });

    const sessionData = {
      ...session,
      questions: questionsWithResponses,
      responses: responses,
    };

    return NextResponse.json({
      success: true,
      session: sessionData,
    });
  } catch (error) {
    console.error(
      `[API] Error getting session ${resolvedParams.sessionId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to get session data", code: "SESSION_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Update session (for progress tracking)
async function handlePATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(`[API] Updating session: ${resolvedParams.sessionId}`);

    const context = await getSecurityContext();
    const body = await request.json();
    const { currentQuestion, sessionStatus, overallScore, confidenceScore } =
      body;

    const sanitizedSessionId = sanitizeInput(resolvedParams.sessionId);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Verify session exists and user has access
    const session = await sql`
      SELECT student_id FROM interview_sessions
      WHERE id = ${sanitizedSessionId};
    `;

    if (session.length === 0) {
      return NextResponse.json(
        { error: "Session not found", code: "SESSION_NOT_FOUND" },
        { status: 404 }
      );
    }

    // For demo purposes, allow anonymous updates
    // In production, add proper authorization check here

    // Update session
    const updateFields = [];
    if (currentQuestion !== undefined)
      updateFields.push(`current_question = ${currentQuestion}`);
    if (sessionStatus) updateFields.push(`session_status = '${sessionStatus}'`);
    if (overallScore !== undefined)
      updateFields.push(`overall_score = ${overallScore}`);
    if (confidenceScore !== undefined)
      updateFields.push(`confidence_score = ${confidenceScore}`);

    if (sessionStatus === "completed") {
      updateFields.push(`end_time = CURRENT_TIMESTAMP`);
    }

    if (updateFields.length > 0) {
      await sql`
        UPDATE interview_sessions
        SET ${sql.unsafe(updateFields.join(", "))}
        WHERE id = ${sanitizedSessionId};
      `;
    }

    // Log session update
    if (context) {
      await logSecurityEvent(
        "INTERVIEW_SESSION_UPDATED",
        {
          sessionId: sanitizedSessionId,
          updates: {
            currentQuestion,
            sessionStatus,
            overallScore,
            confidenceScore,
          },
        },
        context,
        request
      );
    }

    return NextResponse.json({
      success: true,
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error(
      `[API] Error updating session ${resolvedParams.sessionId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to update session", code: "SESSION_UPDATE_ERROR" },
      { status: 500 }
    );
  }
}

// Export handlers
export const GET = handleGET;
export const PATCH = handlePATCH;
