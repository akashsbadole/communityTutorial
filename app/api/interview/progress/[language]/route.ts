import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Get user progress for specific language
async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      `[API] Getting user progress for language: ${resolvedParams.language}`
    );

    // For public access, we'll return demo/placeholder data
    const context = await getSecurityContext();

    const languageSlug = sanitizeInput(resolvedParams.language);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get language ID from slug
    const language = await sql`
      SELECT id, name FROM programming_languages
      WHERE slug = ${languageSlug} AND is_active = true;
    `;

    if (language.length === 0) {
      return NextResponse.json(
        { error: "Language not found", code: "LANGUAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const languageId = language[0].id;
    const studentId = context?.dbUser?.id || "demo_user";

    // Get analytics data
    const analytics = await sql`
      SELECT
        total_sessions, total_questions_answered, average_score,
        average_confidence, improvement_rate, weak_categories,
        strong_categories, last_session_date
      FROM interview_analytics
      WHERE student_id = ${studentId} AND language_id = ${languageId};
    `;

    // Get recent sessions
    const recentSessions = await sql`
      SELECT
        id, session_status, start_time, end_time, total_duration,
        overall_score, confidence_score, total_questions
      FROM interview_sessions
      WHERE student_id = ${studentId} AND language_id = ${languageId}
      ORDER BY start_time DESC
      LIMIT 10;
    `;

    // Get category performance
    const categoryPerformance = await sql`
      SELECT
        q.category,
        COUNT(r.id) as total_responses,
        AVG(r.confidence_score) as avg_confidence,
        AVG(CASE WHEN r.is_correct THEN 100 ELSE 0 END) as accuracy_rate
      FROM interview_responses r
      JOIN interview_questions q ON r.question_id = q.id
      JOIN interview_sessions s ON r.session_id = s.id
      WHERE s.student_id = ${studentId} AND q.language_id = ${languageId}
      GROUP BY q.category
      ORDER BY avg_confidence DESC;
    `;

    // Calculate improvement trend
    const sessionTrend = await sql`
      SELECT
        DATE(start_time) as session_date,
        AVG(overall_score) as avg_score,
        AVG(confidence_score) as avg_confidence,
        COUNT(*) as session_count
      FROM interview_sessions
      WHERE student_id = ${studentId} AND language_id = ${languageId}
      AND session_status = 'completed'
      GROUP BY DATE(start_time)
      ORDER BY session_date DESC
      LIMIT 30;
    `;

    // Prepare progress data
    const progressData = {
      language: {
        id: languageId,
        name: language[0].name,
        slug: languageSlug,
      },
      analytics:
        analytics.length > 0
          ? analytics[0]
          : {
              total_sessions: 0,
              total_questions_answered: 0,
              average_score: 0,
              average_confidence: 0,
              improvement_rate: 0,
              weak_categories: [],
              strong_categories: [],
              last_session_date: null,
            },
      recent_sessions: recentSessions,
      category_performance: categoryPerformance,
      session_trend: sessionTrend,
      summary: {
        total_sessions: recentSessions.length,
        completed_sessions: recentSessions.filter(
          (s) => s.session_status === "completed"
        ).length,
        avg_score:
          recentSessions.length > 0
            ? recentSessions.reduce(
                (sum, s) => sum + (s.overall_score || 0),
                0
              ) / recentSessions.length
            : 0,
        avg_confidence:
          recentSessions.length > 0
            ? recentSessions.reduce(
                (sum, s) => sum + (s.confidence_score || 0),
                0
              ) / recentSessions.length
            : 0,
        total_time_spent: recentSessions.reduce(
          (sum, s) => sum + (s.total_duration || 0),
          0
        ),
      },
    };

    return NextResponse.json({
      success: true,
      progress: progressData,
      language_slug: languageSlug,
    });
  } catch (error) {
    console.error(
      `[API] Error getting progress for ${resolvedParams.language}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to get user progress", code: "PROGRESS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Export handler
export const GET = handleGET;
