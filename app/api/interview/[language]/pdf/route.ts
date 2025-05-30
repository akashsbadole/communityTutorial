import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sanitizeInput } from "@/lib/security";
import { getRandomQuestions } from "@/lib/static-questions";

// Generate PDF for interview questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      `[API] Generating PDF for language: ${resolvedParams.language}`
    );

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty") || "all";
    const includeAnswers = searchParams.get("includeAnswers") === "true";

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get language data
    const languages = await sql`
      SELECT id, name, slug, description, color_code
      FROM programming_languages
      WHERE slug = ${resolvedParams.language} AND is_active = true;
    `;

    if (languages.length === 0) {
      return NextResponse.json(
        { error: "Programming language not found", code: "LANGUAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const language = languages[0];

    // Get static questions
    let questions = getRandomQuestions(resolvedParams.language, 50);

    // Filter by difficulty if specified
    if (difficulty !== "all") {
      questions = questions.filter((q) => q.difficulty === difficulty);
    }

    // Get additional questions from database
    let dbQuestions;
    if (difficulty === "all") {
      dbQuestions = await sql`
        SELECT
          question_title, question_text, answer_text, code_example,
          explanation, difficulty, category, tags
        FROM interview_questions
        WHERE language_id = ${language.id} AND is_active = true
        ORDER BY difficulty, category, question_title;
      `;
    } else {
      dbQuestions = await sql`
        SELECT
          question_title, question_text, answer_text, code_example,
          explanation, difficulty, category, tags
        FROM interview_questions
        WHERE language_id = ${language.id}
        AND difficulty = ${difficulty}
        AND is_active = true
        ORDER BY category, question_title;
      `;
    }

    // Combine questions
    const allQuestions = [...questions, ...dbQuestions];

    if (allQuestions.length === 0) {
      return NextResponse.json(
        {
          error: "No questions found for this language",
          code: "NO_QUESTIONS_FOUND",
        },
        { status: 404 }
      );
    }

    // Generate HTML content for PDF
    const htmlContent = generatePDFHTML(
      language,
      allQuestions,
      includeAnswers,
      difficulty
    );

    // Return HTML content that can be converted to PDF on client side
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${language.name}_interview_questions.html"`,
      },
    });
  } catch (error) {
    console.error(
      `[API] Error generating PDF for ${resolvedParams.language}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to generate PDF", code: "PDF_GENERATION_ERROR" },
      { status: 500 }
    );
  }
}

// Store PDF preferences
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      `[API] Storing PDF preferences for language: ${resolvedParams.language}`
    );

    const body = await request.json();
    const {
      difficulty = "all",
      includeAnswers = true,
      includeCodeExamples = true,
      format = "html",
    } = body;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Store PDF generation request (for analytics)
    await sql`
      INSERT INTO pdf_downloads (
        language_slug, difficulty, include_answers, include_code_examples,
        format, download_date, ip_address
      ) VALUES (
        ${resolvedParams.language}, ${difficulty}, ${includeAnswers},
        ${includeCodeExamples}, ${format}, NOW(),
        ${request.headers.get("x-forwarded-for") || "unknown"}
      );
    `;

    return NextResponse.json({
      success: true,
      message: "PDF preferences stored successfully",
      preferences: {
        language: resolvedParams.language,
        difficulty,
        includeAnswers,
        includeCodeExamples,
        format,
      },
    });
  } catch (error) {
    console.error(`[API] Error storing PDF preferences:`, error);
    return NextResponse.json(
      {
        error: "Failed to store PDF preferences",
        code: "PDF_PREFERENCES_ERROR",
      },
      { status: 500 }
    );
  }
}

function generatePDFHTML(
  language: any,
  questions: any[],
  includeAnswers: boolean,
  difficulty: string
) {
  const difficultyText =
    difficulty === "all"
      ? "All Levels"
      : difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${language.name} Interview Questions - ${difficultyText}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, ${
              language.color_code || "#3B82F6"
            }, ${language.color_code || "#3B82F6"}88);
            color: white;
            border-radius: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .stat {
            text-align: center;
        }
        .stat-number {
            font-size: 1.5em;
            font-weight: bold;
            color: ${language.color_code || "#3B82F6"};
        }
        .question {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .question-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #2c3e50;
        }
        .difficulty-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .difficulty-beginner {
            background: #d4edda;
            color: #155724;
        }
        .difficulty-intermediate {
            background: #fff3cd;
            color: #856404;
        }
        .difficulty-advanced {
            background: #f8d7da;
            color: #721c24;
        }
        .question-text {
            margin: 15px 0;
            font-size: 1.1em;
            line-height: 1.7;
        }
        .answer-section {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid ${language.color_code || "#3B82F6"};
            border-radius: 0 5px 5px 0;
        }
        .answer-title {
            font-weight: bold;
            color: ${language.color_code || "#3B82F6"};
            margin-bottom: 10px;
        }
        .code-example {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 10px 0;
        }
        .category {
            display: inline-block;
            background: #e9ecef;
            color: #495057;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-right: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
        }
        @media print {
            body { margin: 0; }
            .question { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${language.name} Interview Questions</h1>
        <p>${
          language.description ||
          `Comprehensive ${language.name} interview preparation`
        }</p>
        <p>Difficulty Level: ${difficultyText}</p>
    </div>

    <div class="stats">
        <div class="stat">
            <div class="stat-number">${questions.length}</div>
            <div>Total Questions</div>
        </div>
        <div class="stat">
            <div class="stat-number">${
              questions.filter((q) => q.difficulty === "beginner").length
            }</div>
            <div>Beginner</div>
        </div>
        <div class="stat">
            <div class="stat-number">${
              questions.filter((q) => q.difficulty === "intermediate").length
            }</div>
            <div>Intermediate</div>
        </div>
        <div class="stat">
            <div class="stat-number">${
              questions.filter((q) => q.difficulty === "advanced").length
            }</div>
            <div>Advanced</div>
        </div>
    </div>

    ${questions
      .map(
        (question, index) => `
        <div class="question">
            <div class="question-header">
                <div class="question-title">${index + 1}. ${
          question.question_title || question.title
        }</div>
                <div class="difficulty-badge difficulty-${question.difficulty}">
                    ${question.difficulty}
                </div>
            </div>

            ${
              question.category
                ? `<div class="category">${question.category}</div>`
                : ""
            }

            <div class="question-text">
                ${question.question_text || question.text}
            </div>

            ${
              includeAnswers && (question.answer_text || question.answer)
                ? `
                <div class="answer-section">
                    <div class="answer-title">Answer:</div>
                    <div>${question.answer_text || question.answer}</div>

                    ${
                      question.code_example
                        ? `
                        <div class="code-example">${question.code_example}</div>
                    `
                        : ""
                    }

                    ${
                      question.explanation
                        ? `
                        <div style="margin-top: 10px;">
                            <strong>Explanation:</strong> ${question.explanation}
                        </div>
                    `
                        : ""
                    }
                </div>
            `
                : ""
            }
        </div>
    `
      )
      .join("")}

    <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} | TrainingHub Interview Preparation Platform</p>
        <p>Visit our platform for interactive interview practice and more resources</p>
    </div>

    <script>
        // Auto-print functionality
        window.onload = function() {
            if (confirm('Would you like to save this as PDF? Click OK to open print dialog.')) {
                window.print();
            }
        }
    </script>
</body>
</html>
  `;
}
