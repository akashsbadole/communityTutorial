import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  getSecurityContext,
  logSecurityEvent,
  sanitizeInput,
} from "@/lib/security";
import { getQuestionsByDifficulty } from "@/lib/static-questions";

// Create new interview session
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Creating new interview session");

    // Get security context (for now, we'll allow anonymous sessions for demo)
    const context = await getSecurityContext();

    const body = await request.json();
    const {
      languageId,
      sessionSettings = {
        questionCount: 10,
        timeLimit: 300,
        includeVoiceAnalysis: true,
        difficulty: "mixed",
      },
    } = body;

    // Validate required fields
    if (!languageId) {
      return NextResponse.json(
        { error: "Language ID is required", code: "MISSING_LANGUAGE_ID" },
        { status: 400 }
      );
    }

    const sanitizedLanguageId = sanitizeInput(languageId);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Verify language exists
    const language = await sql`
      SELECT id, name FROM programming_languages
      WHERE id = ${sanitizedLanguageId} AND is_active = true;
    `;

    if (language.length === 0) {
      return NextResponse.json(
        { error: "Programming language not found", code: "LANGUAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Get questions based on settings
    const questionCount = Math.min(
      Math.max(sessionSettings.questionCount || 10, 1),
      50
    ); // Limit between 1-50

    // First try to get static questions
    const languageSlug = language[0].name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    let questions = getQuestionsByDifficulty(
      languageSlug,
      sessionSettings.difficulty || "mixed",
      questionCount
    );

    // If we don't have enough static questions, supplement with database questions
    if (questions.length < questionCount) {
      const remainingCount = questionCount - questions.length;
      let dbQuestions;

      if (sessionSettings.difficulty === "mixed") {
        dbQuestions = await sql`
          SELECT
            id, question_title, question_text, answer_text, code_example,
            explanation, difficulty, category, time_to_answer, tags
          FROM interview_questions
          WHERE language_id = ${sanitizedLanguageId} AND is_active = true
          ORDER BY RANDOM()
          LIMIT ${remainingCount};
        `;
      } else {
        dbQuestions = await sql`
          SELECT
            id, question_title, question_text, answer_text, code_example,
            explanation, difficulty, category, time_to_answer, tags
          FROM interview_questions
          WHERE language_id = ${sanitizedLanguageId}
          AND difficulty = ${sessionSettings.difficulty}
          AND is_active = true
          ORDER BY RANDOM()
          LIMIT ${remainingCount};
        `;
      }

      // Combine static and database questions
      questions = [...questions, ...dbQuestions];
    }

    if (questions.length === 0) {
      return NextResponse.json(
        {
          error: "No questions found for this language and difficulty",
          code: "NO_QUESTIONS_FOUND",
        },
        { status: 404 }
      );
    }

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Handle anonymous users - don't store in database
    if (!context?.dbUser?.id) {
      console.log(
        "[API] Creating anonymous interview session (no database storage)"
      );

      return NextResponse.json({
        success: true,
        sessionId,
        session: {
          id: sessionId,
          language_id: sanitizedLanguageId,
          language_name: language[0].name,
          total_questions: questions.length,
          current_question: 1,
          session_status: "in_progress",
          start_time: new Date().toISOString(),
          questions: questions,
          settings: sessionSettings,
          anonymous: true,
        },
      });
    }

    const studentId = context.dbUser.id;

    await sql`
      INSERT INTO interview_sessions (
        id, student_id, language_id, session_type, total_questions,
        current_question, session_status, session_settings
      ) VALUES (
        ${sessionId}, ${studentId}, ${sanitizedLanguageId}, 'practice',
        ${questions.length}, 1, 'in_progress', ${JSON.stringify(
      sessionSettings
    )}
      );
    `;

    // Log session creation
    if (context) {
      await logSecurityEvent(
        "INTERVIEW_SESSION_CREATED",
        {
          sessionId,
          languageId: sanitizedLanguageId,
          questionCount: questions.length,
          difficulty: sessionSettings.difficulty,
        },
        context,
        request
      );
    }

    console.log(`[API] Interview session created: ${sessionId}`);

    return NextResponse.json({
      success: true,
      sessionId,
      session: {
        id: sessionId,
        language_id: sanitizedLanguageId,
        language_name: language[0].name,
        total_questions: questions.length,
        current_question: 1,
        session_status: "in_progress",
        start_time: new Date().toISOString(),
        questions: questions,
        settings: sessionSettings,
      },
    });
  } catch (error) {
    console.error("[API] Error creating interview session:", error);
    return NextResponse.json(
      {
        error: "Failed to create interview session",
        code: "SESSION_CREATION_ERROR",
      },
      { status: 500 }
    );
  }
}

// Get user's interview sessions
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting user interview sessions");

    // For public access, return demo data or empty array
    const context = await getSecurityContext();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const languageId = searchParams.get("languageId");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Build query with filters
    let sessionsQuery = sql`
      SELECT
        s.id, s.language_id, s.session_type, s.total_questions,
        s.current_question, s.session_status, s.start_time, s.end_time,
        s.total_duration, s.overall_score, s.confidence_score,
        l.name as language_name, l.slug as language_slug
      FROM interview_sessions s
      JOIN programming_languages l ON s.language_id = l.id
      WHERE s.student_id = ${context?.dbUser?.id || "demo_user"}
    `;

    // Add filters
    if (status) {
      sessionsQuery = sql`
        SELECT
          s.id, s.language_id, s.session_type, s.total_questions,
          s.current_question, s.session_status, s.start_time, s.end_time,
          s.total_duration, s.overall_score, s.confidence_score,
          l.name as language_name, l.slug as language_slug
        FROM interview_sessions s
        JOIN programming_languages l ON s.language_id = l.id
        WHERE s.student_id = ${context?.dbUser?.id || "demo_user"}
        AND s.session_status = ${status}
      `;
    }

    if (languageId) {
      sessionsQuery = sql`
        SELECT
          s.id, s.language_id, s.session_type, s.total_questions,
          s.current_question, s.session_status, s.start_time, s.end_time,
          s.total_duration, s.overall_score, s.confidence_score,
          l.name as language_name, l.slug as language_slug
        FROM interview_sessions s
        JOIN programming_languages l ON s.language_id = l.id
        WHERE s.student_id = ${context?.dbUser?.id || "demo_user"}
        ${status ? sql`AND s.session_status = ${status}` : sql``}
        AND s.language_id = ${languageId}
      `;
    }

    const sessions = await sql`
      SELECT
        s.id, s.language_id, s.session_type, s.total_questions,
        s.current_question, s.session_status, s.start_time, s.end_time,
        s.total_duration, s.overall_score, s.confidence_score,
        l.name as language_name, l.slug as language_slug
      FROM interview_sessions s
      JOIN programming_languages l ON s.language_id = l.id
      WHERE s.student_id = ${context?.dbUser?.id || "demo_user"}
      ${status ? sql`AND s.session_status = ${status}` : sql``}
      ${languageId ? sql`AND s.language_id = ${languageId}` : sql``}
      ORDER BY s.start_time DESC
      LIMIT ${limit};
    `;

    return NextResponse.json({
      success: true,
      sessions,
      total_count: sessions.length,
      filters: {
        status,
        languageId,
        limit,
      },
    });
  } catch (error) {
    console.error("[API] Error getting interview sessions:", error);
    return NextResponse.json(
      {
        error: "Failed to get interview sessions",
        code: "SESSIONS_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}

// Export handlers
export const GET = handleGET;
export const POST = handlePOST;
