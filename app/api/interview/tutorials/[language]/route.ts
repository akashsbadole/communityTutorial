import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sanitizeInput, getSecurityContext } from "@/lib/security";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "video" | "article" | "documentation" | "github";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration?: string;
  author?: string;
  tags: string[];
  isStored?: boolean;
  viewCount?: number;
  isFeatured?: boolean;
  createdAt?: string;
}

// Get tutorials for a specific language
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      `[API] Getting tutorials for language: ${resolvedParams.language}`
    );

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty") || "all";
    const type = searchParams.get("type") || "all";

    // Connect to database to get stored video tutorials
    const sql = neon(process.env.DATABASE_URL!);

    // Get language data
    let language = null;
    try {
      const languages = await sql`
        SELECT id, name, slug FROM programming_languages
        WHERE slug = ${resolvedParams.language} AND is_active = true;
      `;
      if (languages.length > 0) {
        language = languages[0];
      }
    } catch (dbError) {
      console.log("[API] Database not available, using static tutorials only");
    }

    // Get tutorials from static data and external sources
    let tutorials = getStaticTutorials(resolvedParams.language);

    // Get stored video tutorials from database if available
    let videoTutorials = [];
    if (language) {
      try {
        const videoQuery = sql`
          SELECT
            id, title, description, video_url, difficulty, duration,
            instructor_name, created_at, view_count, is_featured
          FROM tutorial_videos
          WHERE language_id = ${language.id} AND is_active = true
          ORDER BY is_featured DESC, view_count DESC, created_at DESC;
        `;

        videoTutorials = await videoQuery;

        // Transform database tutorials to match static format
        const dbTutorials = videoTutorials.map((video) => ({
          id: `video_${video.id}`,
          title: video.title,
          description: video.description,
          url: video.video_url,
          type: "video" as const,
          difficulty: video.difficulty as
            | "beginner"
            | "intermediate"
            | "advanced",
          duration: video.duration,
          author: video.instructor_name,
          tags: ["video", "tutorial", "stored"],
          isStored: true,
          viewCount: video.view_count,
          isFeatured: video.is_featured,
          createdAt: video.created_at,
        }));

        // Combine static and database tutorials
        tutorials = [...tutorials, ...dbTutorials];
      } catch (dbError) {
        console.log(
          "[API] Database tutorials not available, using static only"
        );
      }
    }

    // Filter by difficulty
    if (difficulty !== "all") {
      tutorials = tutorials.filter((t) => t.difficulty === difficulty);
    }

    // Filter by type
    if (type !== "all") {
      tutorials = tutorials.filter((t) => t.type === type);
    }

    return NextResponse.json({
      success: true,
      tutorials,
      total_count: tutorials.length,
      video_count: videoTutorials.length,
      language: resolvedParams.language,
      filters: { difficulty, type },
    });
  } catch (error) {
    console.error(
      `[API] Error getting tutorials for ${resolvedParams.language}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to get tutorials", code: "TUTORIALS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

function getStaticTutorials(language: string): Tutorial[] {
  const tutorialData: Record<string, Tutorial[]> = {
    javascript: [
      {
        id: "js_tut_1",
        title: "JavaScript Fundamentals - MDN",
        description:
          "Complete guide to JavaScript basics including variables, functions, objects, and control structures.",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        type: "documentation",
        difficulty: "beginner",
        duration: "3-4 hours",
        author: "MDN Web Docs",
        tags: ["basics", "fundamentals", "syntax", "variables", "functions"],
      },
      {
        id: "js_tut_2",
        title: "Async JavaScript Deep Dive",
        description:
          "Master asynchronous programming with promises, async/await, and the event loop.",
        url: "https://javascript.info/async",
        type: "article",
        difficulty: "intermediate",
        duration: "2-3 hours",
        author: "JavaScript.info",
        tags: ["async", "promises", "event-loop", "callbacks"],
      },
      {
        id: "js_tut_3",
        title: "JavaScript Interview Questions Repository",
        description:
          "Comprehensive collection of 1000+ JavaScript interview questions with detailed answers.",
        url: "https://github.com/sudheerj/javascript-interview-questions",
        type: "github",
        difficulty: "intermediate",
        author: "Sudheer Jonna",
        tags: ["interview", "questions", "practice", "comprehensive"],
      },
      {
        id: "js_tut_4",
        title: "ES6+ Modern JavaScript Features",
        description:
          "Learn modern JavaScript features including arrow functions, destructuring, modules, and more.",
        url: "https://es6.io/",
        type: "video",
        difficulty: "intermediate",
        duration: "4-5 hours",
        author: "Wes Bos",
        tags: ["es6", "modern", "features", "modules", "destructuring"],
      },
      {
        id: "js_tut_5",
        title: "You Don't Know JS Book Series",
        description:
          "Deep dive into JavaScript core concepts and advanced topics.",
        url: "https://github.com/getify/You-Dont-Know-JS",
        type: "github",
        difficulty: "advanced",
        author: "Kyle Simpson",
        tags: ["advanced", "deep-dive", "concepts", "book"],
      },
      {
        id: "js_tut_6",
        title: "JavaScript Algorithms and Data Structures",
        description:
          "Learn algorithms and data structures implemented in JavaScript.",
        url: "https://github.com/trekhleb/javascript-algorithms",
        type: "github",
        difficulty: "advanced",
        author: "Oleksii Trekhleb",
        tags: ["algorithms", "data-structures", "problem-solving"],
      },
    ],

    python: [
      {
        id: "py_tut_1",
        title: "Python Official Tutorial",
        description:
          "The official Python tutorial covering all language fundamentals and standard library.",
        url: "https://docs.python.org/3/tutorial/",
        type: "documentation",
        difficulty: "beginner",
        duration: "4-5 hours",
        author: "Python Software Foundation",
        tags: ["official", "basics", "fundamentals", "standard-library"],
      },
      {
        id: "py_tut_2",
        title: "Python Interview Questions Repository",
        description:
          "Comprehensive Python interview questions with detailed explanations and examples.",
        url: "https://github.com/learning-zone/python-interview-questions",
        type: "github",
        difficulty: "intermediate",
        author: "Learning Zone",
        tags: ["interview", "questions", "practice", "examples"],
      },
      {
        id: "py_tut_3",
        title: "Real Python Tutorials",
        description:
          "High-quality Python tutorials covering advanced topics and best practices.",
        url: "https://realpython.com/",
        type: "article",
        difficulty: "intermediate",
        author: "Real Python Team",
        tags: ["advanced", "best-practices", "tutorials", "practical"],
      },
      {
        id: "py_tut_4",
        title: "Automate the Boring Stuff with Python",
        description:
          "Practical programming for total beginners. Learn Python by automating everyday tasks.",
        url: "https://automatetheboringstuff.com/",
        type: "article",
        difficulty: "beginner",
        duration: "6-8 hours",
        author: "Al Sweigart",
        tags: ["automation", "practical", "beginner-friendly", "projects"],
      },
      {
        id: "py_tut_5",
        title: "Python Design Patterns",
        description:
          "Learn common design patterns and their implementation in Python.",
        url: "https://github.com/faif/python-patterns",
        type: "github",
        difficulty: "advanced",
        author: "Sakis Kasampalis",
        tags: ["design-patterns", "architecture", "advanced", "oop"],
      },
    ],

    java: [
      {
        id: "java_tut_1",
        title: "Oracle Java Tutorials",
        description:
          "Official Java tutorials from Oracle covering all aspects of Java programming.",
        url: "https://docs.oracle.com/javase/tutorial/",
        type: "documentation",
        difficulty: "beginner",
        duration: "6-8 hours",
        author: "Oracle",
        tags: ["official", "comprehensive", "fundamentals", "oop"],
      },
      {
        id: "java_tut_2",
        title: "Java Interview Questions Repository",
        description:
          "Extensive collection of Java interview questions covering core concepts and frameworks.",
        url: "https://github.com/learning-zone/java-interview-questions",
        type: "github",
        difficulty: "intermediate",
        author: "Learning Zone",
        tags: [
          "interview",
          "questions",
          "oop",
          "collections",
          "multithreading",
        ],
      },
      {
        id: "java_tut_3",
        title: "Java Concurrency in Practice",
        description:
          "Deep dive into Java concurrency and multithreading concepts.",
        url: "https://jcip.net/",
        type: "article",
        difficulty: "advanced",
        author: "Brian Goetz",
        tags: ["concurrency", "multithreading", "advanced", "performance"],
      },
    ],

    react: [
      {
        id: "react_tut_1",
        title: "React Official Documentation",
        description:
          "The official React documentation with interactive examples and comprehensive guides.",
        url: "https://react.dev/",
        type: "documentation",
        difficulty: "beginner",
        duration: "4-5 hours",
        author: "React Team",
        tags: ["official", "components", "hooks", "jsx", "state"],
      },
      {
        id: "react_tut_2",
        title: "React Interview Questions Repository",
        description:
          "Top React interview questions with detailed explanations and code examples.",
        url: "https://github.com/sudheerj/reactjs-interview-questions",
        type: "github",
        difficulty: "intermediate",
        author: "Sudheer Jonna",
        tags: ["interview", "components", "state", "lifecycle", "hooks"],
      },
      {
        id: "react_tut_3",
        title: "React Patterns",
        description:
          "Common React patterns and best practices for building scalable applications.",
        url: "https://reactpatterns.com/",
        type: "article",
        difficulty: "intermediate",
        author: "React Community",
        tags: ["patterns", "best-practices", "architecture", "scalability"],
      },
    ],

    nodejs: [
      {
        id: "node_tut_1",
        title: "Node.js Official Guides",
        description:
          "Official Node.js guides covering core concepts and best practices.",
        url: "https://nodejs.org/en/docs/guides/",
        type: "documentation",
        difficulty: "beginner",
        duration: "3-4 hours",
        author: "Node.js Foundation",
        tags: ["official", "server-side", "npm", "modules"],
      },
      {
        id: "node_tut_2",
        title: "Node.js Interview Questions",
        description:
          "Comprehensive Node.js interview questions covering async programming and server concepts.",
        url: "https://github.com/learning-zone/nodejs-interview-questions",
        type: "github",
        difficulty: "intermediate",
        author: "Learning Zone",
        tags: ["interview", "async", "server", "express", "npm"],
      },
    ],

    typescript: [
      {
        id: "ts_tut_1",
        title: "TypeScript Handbook",
        description:
          "Official TypeScript handbook covering types, interfaces, and advanced features.",
        url: "https://www.typescriptlang.org/docs/",
        type: "documentation",
        difficulty: "beginner",
        duration: "4-5 hours",
        author: "Microsoft",
        tags: ["official", "types", "interfaces", "generics"],
      },
      {
        id: "ts_tut_2",
        title: "TypeScript Interview Questions",
        description:
          "TypeScript interview questions focusing on type system and advanced features.",
        url: "https://github.com/Devinterview-io/typescript-interview-questions",
        type: "github",
        difficulty: "intermediate",
        author: "DevInterview.io",
        tags: ["interview", "types", "generics", "advanced"],
      },
    ],
  };

  return tutorialData[language] || [];
}

// Add new video tutorial
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      `[API] Adding video tutorial for language: ${resolvedParams.language}`
    );

    const context = await getSecurityContext();
    const body = await request.json();
    const {
      title,
      description,
      videoUrl,
      difficulty = "intermediate",
      duration,
      instructorName,
      isFeatured = false,
    } = body;

    // Validate required fields
    if (!title || !description || !videoUrl) {
      return NextResponse.json(
        {
          error: "Title, description, and video URL are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(videoUrl)) {
      return NextResponse.json(
        {
          error: "Please provide a valid YouTube URL",
          code: "INVALID_VIDEO_URL",
        },
        { status: 400 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get language data
    const languages = await sql`
      SELECT id, name FROM programming_languages
      WHERE slug = ${resolvedParams.language} AND is_active = true;
    `;

    if (languages.length === 0) {
      return NextResponse.json(
        { error: "Programming language not found", code: "LANGUAGE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const language = languages[0];

    // Insert video tutorial
    const result = await sql`
      INSERT INTO tutorial_videos (
        language_id, title, description, video_url, difficulty,
        duration, instructor_name, is_featured, created_by, is_active
      ) VALUES (
        ${language.id}, ${sanitizeInput(title)}, ${sanitizeInput(description)},
        ${sanitizeInput(videoUrl)}, ${difficulty}, ${duration || null},
        ${sanitizeInput(instructorName) || "Anonymous"}, ${isFeatured},
        ${context?.dbUser?.id || "anonymous"}, true
      ) RETURNING id, title, video_url;
    `;

    console.log(`[API] Video tutorial added: ${result[0].id}`);

    return NextResponse.json({
      success: true,
      message: "Video tutorial added successfully",
      tutorial: {
        id: result[0].id,
        title: result[0].title,
        videoUrl: result[0].video_url,
        language: language.name,
        difficulty,
        instructorName: instructorName || "Anonymous",
      },
    });
  } catch (error) {
    console.error(`[API] Error adding video tutorial:`, error);
    return NextResponse.json(
      {
        error: "Failed to add video tutorial",
        code: "VIDEO_TUTORIAL_ADD_ERROR",
      },
      { status: 500 }
    );
  }
}
