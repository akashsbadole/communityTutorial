import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  getSecurityContext,
  logSecurityEvent,
  sanitizeInput,
} from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Save interview response
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Saving interview response");

    const context = await getSecurityContext();
    const body = await request.json();
    const {
      sessionId,
      questionId,
      studentAnswer,
      responseTime,
      confidenceScore,
      voiceAnalysis,
    } = body;

    // Validate required fields
    if (!sessionId || !questionId) {
      return NextResponse.json(
        {
          error: "Session ID and Question ID are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 }
      );
    }

    const sanitizedSessionId = sanitizeInput(sessionId);
    const sanitizedQuestionId = sanitizeInput(questionId);
    const sanitizedAnswer = studentAnswer ? sanitizeInput(studentAnswer) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Verify session exists
    const session = await sql`
      SELECT id, student_id FROM interview_sessions
      WHERE id = ${sanitizedSessionId};
    `;

    if (session.length === 0) {
      return NextResponse.json(
        { error: "Session not found", code: "SESSION_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Verify question exists
    const question = await sql`
      SELECT id FROM interview_questions
      WHERE id = ${sanitizedQuestionId};
    `;

    if (question.length === 0) {
      return NextResponse.json(
        { error: "Question not found", code: "QUESTION_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Check if response already exists
    const existingResponse = await sql`
      SELECT id FROM interview_responses
      WHERE session_id = ${sanitizedSessionId} AND question_id = ${sanitizedQuestionId};
    `;

    if (existingResponse.length > 0) {
      // Update existing response
      await sql`
        UPDATE interview_responses
        SET
          student_answer = ${sanitizedAnswer},
          response_time = ${responseTime || 0},
          confidence_score = ${confidenceScore || 0},
          voice_analysis = ${
            voiceAnalysis ? JSON.stringify(voiceAnalysis) : null
          }
        WHERE session_id = ${sanitizedSessionId} AND question_id = ${sanitizedQuestionId};
      `;

      console.log(
        `[API] Response updated for session ${sanitizedSessionId}, question ${sanitizedQuestionId}`
      );

      return NextResponse.json({
        success: true,
        message: "Response updated successfully",
        response: {
          sessionId: sanitizedSessionId,
          questionId: sanitizedQuestionId,
          updated: true,
        },
      });
    } else {
      // Create new response
      const responseId = `response_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      await sql`
        INSERT INTO interview_responses (
          id, session_id, question_id, student_answer, response_time,
          confidence_score, voice_analysis
        ) VALUES (
          ${responseId}, ${sanitizedSessionId}, ${sanitizedQuestionId},
          ${sanitizedAnswer}, ${responseTime || 0}, ${confidenceScore || 0},
          ${voiceAnalysis ? JSON.stringify(voiceAnalysis) : null}
        );
      `;

      // Log response creation
      if (context) {
        await logSecurityEvent(
          "INTERVIEW_RESPONSE_SAVED",
          {
            responseId,
            sessionId: sanitizedSessionId,
            questionId: sanitizedQuestionId,
            hasVoiceAnalysis: !!voiceAnalysis,
            confidenceScore,
          },
          context,
          request
        );
      }

      console.log(`[API] Response saved: ${responseId}`);

      return NextResponse.json({
        success: true,
        message: "Response saved successfully",
        response: {
          id: responseId,
          sessionId: sanitizedSessionId,
          questionId: sanitizedQuestionId,
          confidenceScore,
          responseTime,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("[API] Error saving interview response:", error);
    return NextResponse.json(
      { error: "Failed to save response", code: "RESPONSE_SAVE_ERROR" },
      { status: 500 }
    );
  }
}

// Get responses for a session
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting interview responses");

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const questionId = searchParams.get("questionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required", code: "MISSING_SESSION_ID" },
        { status: 400 }
      );
    }

    const sanitizedSessionId = sanitizeInput(sessionId);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    let responses;
    if (questionId) {
      // Get specific response
      const sanitizedQuestionId = sanitizeInput(questionId);
      responses = await sql`
        SELECT
          r.id, r.session_id, r.question_id, r.student_answer,
          r.response_time, r.confidence_score, r.voice_analysis,
          r.is_correct, r.feedback, r.created_at,
          q.question_title, q.question_text, q.answer_text
        FROM interview_responses r
        JOIN interview_questions q ON r.question_id = q.id
        WHERE r.session_id = ${sanitizedSessionId}
        AND r.question_id = ${sanitizedQuestionId};
      `;
    } else {
      // Get all responses for session
      responses = await sql`
        SELECT
          r.id, r.session_id, r.question_id, r.student_answer,
          r.response_time, r.confidence_score, r.voice_analysis,
          r.is_correct, r.feedback, r.created_at,
          q.question_title, q.question_text, q.answer_text, q.difficulty
        FROM interview_responses r
        JOIN interview_questions q ON r.question_id = q.id
        WHERE r.session_id = ${sanitizedSessionId}
        ORDER BY r.created_at ASC;
      `;
    }

    // Parse voice analysis JSON
    const processedResponses = responses.map((response) => ({
      ...response,
      voice_analysis: response.voice_analysis
        ? JSON.parse(response.voice_analysis)
        : null,
    }));

    return NextResponse.json({
      success: true,
      responses: processedResponses,
      sessionId: sanitizedSessionId,
      total_count: responses.length,
    });
  } catch (error) {
    console.error("[API] Error getting interview responses:", error);
    return NextResponse.json(
      { error: "Failed to get responses", code: "RESPONSES_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Export handlers
export const GET = handleGET;
export const POST = handlePOST;
