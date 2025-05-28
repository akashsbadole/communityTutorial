import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get specific programming language by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(`[API] Getting language data for: ${resolvedParams.slug}`);

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats") !== "false"; // Default to true

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get language data
    const languages = await sql`
      SELECT
        id, name, slug, description, icon_url, color_code,
        difficulty_level, popularity_rank, github_repo_url,
        documentation_url, is_active, created_at
      FROM programming_languages
      WHERE slug = ${resolvedParams.slug} AND is_active = true;
    `;

    if (languages.length === 0) {
      return NextResponse.json(
        { error: "Programming language not found", code: "LANGUAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const language = languages[0];

    // Get statistics if requested
    if (includeStats) {
      // Get question statistics
      const questionStats = await sql`
        SELECT
          COUNT(*) as total_questions,
          COUNT(CASE WHEN difficulty = 'beginner' THEN 1 END) as beginner_questions,
          COUNT(CASE WHEN difficulty = 'intermediate' THEN 1 END) as intermediate_questions,
          COUNT(CASE WHEN difficulty = 'advanced' THEN 1 END) as advanced_questions,
          COUNT(DISTINCT category) as total_categories
        FROM interview_questions
        WHERE language_id = ${language.id} AND is_active = true;
      `;

      // Get session statistics
      const sessionStats = await sql`
        SELECT
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN session_status = 'completed' THEN 1 END) as completed_sessions,
          AVG(overall_score) as avg_score,
          AVG(confidence_score) as avg_confidence
        FROM interview_sessions
        WHERE language_id = ${language.id};
      `;

      // Get tutor video count
      const videoStats = await sql`
        SELECT
          COUNT(*) as video_count,
          COUNT(DISTINCT tutor_id) as tutor_count
        FROM tutor_intro_videos
        WHERE language_id = ${language.id} AND is_active = true;
      `;

      // Get recent questions for preview
      const recentQuestions = await sql`
        SELECT
          id, question_title, difficulty, category, time_to_answer
        FROM interview_questions
        WHERE language_id = ${language.id} AND is_active = true
        ORDER BY question_order ASC, created_at DESC
        LIMIT 5;
      `;

      // Add statistics to language object
      language.statistics = {
        total_questions: parseInt(questionStats[0]?.total_questions || 0),
        beginner_questions: parseInt(questionStats[0]?.beginner_questions || 0),
        intermediate_questions: parseInt(
          questionStats[0]?.intermediate_questions || 0
        ),
        advanced_questions: parseInt(questionStats[0]?.advanced_questions || 0),
        total_categories: parseInt(questionStats[0]?.total_categories || 0),
        total_sessions: parseInt(sessionStats[0]?.total_sessions || 0),
        completed_sessions: parseInt(sessionStats[0]?.completed_sessions || 0),
        avg_score: parseFloat(sessionStats[0]?.avg_score || 0),
        avg_confidence: parseFloat(sessionStats[0]?.avg_confidence || 0),
        video_count: parseInt(videoStats[0]?.video_count || 0),
        tutor_count: parseInt(videoStats[0]?.tutor_count || 0),
      };

      language.recent_questions = recentQuestions;
    }

    return NextResponse.json({
      success: true,
      language,
      slug: resolvedParams.slug,
    });
  } catch (error) {
    console.error(
      `[API] Error getting language ${resolvedParams.slug}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to get language data", code: "LANGUAGE_FETCH_ERROR" },
      { status: 500 }
    );
  }
}
