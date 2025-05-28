import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { apiRateLimit } from "@/lib/rate-limit";

// Get all programming languages with statistics
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting programming languages for interview platform");

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats") === "true";
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Base query for languages
    let languagesQuery = sql`
      SELECT
        id, name, slug, description, icon_url, color_code,
        difficulty_level, popularity_rank, github_repo_url,
        documentation_url, is_active, created_at
      FROM programming_languages
      WHERE is_active = true
    `;

    // Add difficulty filter if specified
    if (difficulty && difficulty !== "all") {
      languagesQuery = sql`
        SELECT
          id, name, slug, description, icon_url, color_code,
          difficulty_level, popularity_rank, github_repo_url,
          documentation_url, is_active, created_at
        FROM programming_languages
        WHERE is_active = true AND difficulty_level = ${difficulty}
      `;
    }

    // Add ordering and limit
    const languages = await sql`
      SELECT
        id, name, slug, description, icon_url, color_code,
        difficulty_level, popularity_rank, github_repo_url,
        documentation_url, is_active, created_at
      FROM programming_languages
      WHERE is_active = true
      ${
        difficulty && difficulty !== "all"
          ? sql`AND difficulty_level = ${difficulty}`
          : sql``
      }
      ORDER BY popularity_rank ASC, name ASC
      LIMIT ${limit};
    `;

    // If stats are requested, get additional statistics
    if (includeStats) {
      for (let i = 0; i < languages.length; i++) {
        const language = languages[i];

        // Get question count
        const questionStats = await sql`
          SELECT
            COUNT(*) as total_questions,
            COUNT(CASE WHEN difficulty = 'beginner' THEN 1 END) as beginner_count,
            COUNT(CASE WHEN difficulty = 'intermediate' THEN 1 END) as intermediate_count,
            COUNT(CASE WHEN difficulty = 'advanced' THEN 1 END) as advanced_count
          FROM interview_questions
          WHERE language_id = ${language.id} AND is_active = true;
        `;

        // Get session statistics
        const sessionStats = await sql`
          SELECT
            COUNT(*) as total_sessions,
            AVG(overall_score) as avg_score,
            AVG(confidence_score) as avg_confidence
          FROM interview_sessions
          WHERE language_id = ${language.id} AND session_status = 'completed';
        `;

        // Get tutor video count
        const videoStats = await sql`
          SELECT COUNT(*) as video_count
          FROM tutor_intro_videos
          WHERE language_id = ${language.id} AND is_active = true;
        `;

        // Add statistics to language object
        languages[i] = {
          ...language,
          statistics: {
            total_questions: parseInt(questionStats[0]?.total_questions || 0),
            beginner_questions: parseInt(questionStats[0]?.beginner_count || 0),
            intermediate_questions: parseInt(
              questionStats[0]?.intermediate_count || 0
            ),
            advanced_questions: parseInt(questionStats[0]?.advanced_count || 0),
            total_sessions: parseInt(sessionStats[0]?.total_sessions || 0),
            avg_score: parseFloat(sessionStats[0]?.avg_score || 0),
            avg_confidence: parseFloat(sessionStats[0]?.avg_confidence || 0),
            video_count: parseInt(videoStats[0]?.video_count || 0),
          },
        };
      }
    }

    // Get platform statistics
    const platformStats = await sql`
      SELECT
        (SELECT COUNT(*) FROM programming_languages WHERE is_active = true) as total_languages,
        (SELECT COUNT(*) FROM interview_questions WHERE is_active = true) as total_questions,
        (SELECT COUNT(*) FROM interview_sessions) as total_sessions,
        (SELECT COUNT(DISTINCT tutor_id) FROM tutor_intro_videos WHERE is_active = true) as total_tutors;
    `;

    return NextResponse.json({
      success: true,
      languages,
      platform_stats: platformStats[0],
      total_count: languages.length,
      filters: {
        difficulty,
        includeStats,
        limit,
      },
    });
  } catch (error) {
    console.error("[API] Error getting programming languages:", error);
    return NextResponse.json(
      {
        error: "Failed to get programming languages",
        code: "LANGUAGES_FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}

// Add new programming language (admin only)
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Adding new programming language");

    // For now, we'll skip authentication check for demo purposes
    // In production, add proper admin authentication here

    const body = await request.json();
    const {
      name,
      slug,
      description,
      iconUrl,
      colorCode,
      difficultyLevel = "intermediate",
      githubRepoUrl,
      documentationUrl,
    } = body;

    // Validate required fields
    if (!name || !slug || !description) {
      return NextResponse.json(
        {
          error: "Name, slug, and description are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if language already exists
    const existingLanguage = await sql`
      SELECT id FROM programming_languages
      WHERE name = ${name} OR slug = ${slug};
    `;

    if (existingLanguage.length > 0) {
      return NextResponse.json(
        {
          error: "Programming language with this name or slug already exists",
          code: "LANGUAGE_EXISTS",
        },
        { status: 409 }
      );
    }

    // Get next popularity rank
    const maxRank = await sql`
      SELECT COALESCE(MAX(popularity_rank), 0) as max_rank
      FROM programming_languages;
    `;
    const nextRank = (maxRank[0]?.max_rank || 0) + 1;

    // Create new language
    const languageId = `lang_${slug}`;

    await sql`
      INSERT INTO programming_languages (
        id, name, slug, description, icon_url, color_code,
        difficulty_level, popularity_rank, github_repo_url, documentation_url
      ) VALUES (
        ${languageId}, ${name}, ${slug}, ${description}, ${iconUrl || null},
        ${colorCode || "#6B7280"}, ${difficultyLevel}, ${nextRank},
        ${githubRepoUrl || null}, ${documentationUrl || null}
      );
    `;

    console.log(`[API] Programming language added: ${languageId}`);

    return NextResponse.json({
      success: true,
      message: "Programming language added successfully",
      language: {
        id: languageId,
        name,
        slug,
        description,
        difficulty_level: difficultyLevel,
        popularity_rank: nextRank,
      },
    });
  } catch (error) {
    console.error("[API] Error adding programming language:", error);
    return NextResponse.json(
      {
        error: "Failed to add programming language",
        code: "LANGUAGE_CREATION_ERROR",
      },
      { status: 500 }
    );
  }
}

// Update programming language (admin only)
export async function PATCH(request: NextRequest) {
  try {
    console.log("[API] Updating programming language");

    const body = await request.json();
    const { languageId, updates } = body;

    if (!languageId) {
      return NextResponse.json(
        { error: "Language ID is required", code: "MISSING_LANGUAGE_ID" },
        { status: 400 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if language exists
    const existingLanguage = await sql`
      SELECT id FROM programming_languages WHERE id = ${languageId};
    `;

    if (existingLanguage.length === 0) {
      return NextResponse.json(
        { error: "Programming language not found", code: "LANGUAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (updates.name) {
      updateFields.push("name = $" + (updateValues.length + 1));
      updateValues.push(updates.name);
    }
    if (updates.description) {
      updateFields.push("description = $" + (updateValues.length + 1));
      updateValues.push(updates.description);
    }
    if (updates.colorCode) {
      updateFields.push("color_code = $" + (updateValues.length + 1));
      updateValues.push(updates.colorCode);
    }
    if (updates.difficultyLevel) {
      updateFields.push("difficulty_level = $" + (updateValues.length + 1));
      updateValues.push(updates.difficultyLevel);
    }
    if (updates.isActive !== undefined) {
      updateFields.push("is_active = $" + (updateValues.length + 1));
      updateValues.push(updates.isActive);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update", code: "NO_UPDATE_FIELDS" },
        { status: 400 }
      );
    }

    // Add updated_at field
    updateFields.push("updated_at = CURRENT_TIMESTAMP");

    // Execute update
    await sql`
      UPDATE programming_languages
      SET ${sql.unsafe(updateFields.join(", "))}
      WHERE id = ${languageId};
    `;

    console.log(`[API] Programming language updated: ${languageId}`);

    return NextResponse.json({
      success: true,
      message: "Programming language updated successfully",
      languageId,
    });
  } catch (error) {
    console.error("[API] Error updating programming language:", error);
    return NextResponse.json(
      {
        error: "Failed to update programming language",
        code: "LANGUAGE_UPDATE_ERROR",
      },
      { status: 500 }
    );
  }
}

// Export handlers
export const GET = handleGET;
export const POST = handlePOST;
