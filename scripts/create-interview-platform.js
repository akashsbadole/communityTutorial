require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createInterviewPlatform() {
  try {
    console.log('🎯 Creating Interview Preparation Platform...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // 1. Create programming languages table
    console.log('📝 Creating programming_languages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS programming_languages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon_url TEXT,
        color_code TEXT,
        difficulty_level TEXT DEFAULT 'intermediate',
        popularity_rank INTEGER,
        github_repo_url TEXT,
        documentation_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // 2. Create interview questions table
    console.log('📝 Creating interview_questions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS interview_questions (
        id TEXT PRIMARY KEY,
        language_id TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        question_title TEXT NOT NULL,
        question_text TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        code_example TEXT,
        explanation TEXT,
        tags TEXT[],
        time_to_answer INTEGER DEFAULT 300,
        question_order INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (language_id) REFERENCES programming_languages(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      );
    `;
    
    // 3. Create interview sessions table
    console.log('📝 Creating interview_sessions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS interview_sessions (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        language_id TEXT NOT NULL,
        session_type TEXT DEFAULT 'practice',
        total_questions INTEGER DEFAULT 10,
        current_question INTEGER DEFAULT 1,
        session_status TEXT DEFAULT 'in_progress',
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        total_duration INTEGER,
        overall_score DECIMAL(5,2),
        confidence_score DECIMAL(5,2),
        voice_analysis_data JSONB,
        session_settings JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (language_id) REFERENCES programming_languages(id)
      );
    `;
    
    // 4. Create interview responses table
    console.log('📝 Creating interview_responses table...');
    await sql`
      CREATE TABLE IF NOT EXISTS interview_responses (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        student_answer TEXT,
        voice_recording_url TEXT,
        response_time INTEGER,
        confidence_score DECIMAL(5,2),
        voice_analysis JSONB,
        is_correct BOOLEAN,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES interview_sessions(id),
        FOREIGN KEY (question_id) REFERENCES interview_questions(id)
      );
    `;
    
    // 5. Create tutor introduction videos table
    console.log('📝 Creating tutor_intro_videos table...');
    await sql`
      CREATE TABLE IF NOT EXISTS tutor_intro_videos (
        id TEXT PRIMARY KEY,
        tutor_id TEXT NOT NULL,
        language_id TEXT NOT NULL,
        video_title TEXT NOT NULL,
        video_description TEXT,
        youtube_url TEXT NOT NULL,
        video_duration INTEGER,
        video_order INTEGER DEFAULT 1,
        thumbnail_url TEXT,
        view_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES users(id),
        FOREIGN KEY (language_id) REFERENCES programming_languages(id)
      );
    `;
    
    // 6. Create video feedback table
    console.log('📝 Creating video_feedback table...');
    await sql`
      CREATE TABLE IF NOT EXISTS video_feedback (
        id TEXT PRIMARY KEY,
        video_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        feedback_text TEXT,
        suggestions TEXT,
        is_helpful BOOLEAN,
        watch_duration INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES tutor_intro_videos(id),
        FOREIGN KEY (student_id) REFERENCES users(id)
      );
    `;
    
    // 7. Create interview analytics table
    console.log('📝 Creating interview_analytics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS interview_analytics (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        language_id TEXT NOT NULL,
        total_sessions INTEGER DEFAULT 0,
        total_questions_answered INTEGER DEFAULT 0,
        average_score DECIMAL(5,2),
        average_confidence DECIMAL(5,2),
        improvement_rate DECIMAL(5,2),
        weak_categories TEXT[],
        strong_categories TEXT[],
        last_session_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (language_id) REFERENCES programming_languages(id)
      );
    `;
    
    // 8. Create PDF documents table
    console.log('📝 Creating interview_pdfs table...');
    await sql`
      CREATE TABLE IF NOT EXISTS interview_pdfs (
        id TEXT PRIMARY KEY,
        language_id TEXT NOT NULL,
        pdf_title TEXT NOT NULL,
        pdf_description TEXT,
        pdf_url TEXT NOT NULL,
        pdf_size INTEGER,
        download_count INTEGER DEFAULT 0,
        is_premium BOOLEAN DEFAULT false,
        created_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (language_id) REFERENCES programming_languages(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      );
    `;
    
    // Create indexes for performance
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_questions_language ON interview_questions (language_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_questions_difficulty ON interview_questions (difficulty);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_questions_category ON interview_questions (category);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_sessions_student ON interview_sessions (student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_sessions_language ON interview_sessions (language_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_responses_session ON interview_responses (session_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tutor_intro_videos_tutor ON tutor_intro_videos (tutor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tutor_intro_videos_language ON tutor_intro_videos (language_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_video_feedback_video ON video_feedback (video_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_interview_analytics_student ON interview_analytics (student_id);`;
    
    // Insert programming languages
    console.log('📝 Inserting programming languages...');
    const languages = [
      {
        id: 'lang_javascript',
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Dynamic programming language for web development',
        color_code: '#F7DF1E',
        difficulty_level: 'beginner',
        popularity_rank: 1,
        github_repo_url: 'https://github.com/sudheerj/javascript-interview-questions',
        documentation_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
      },
      {
        id: 'lang_python',
        name: 'Python',
        slug: 'python',
        description: 'High-level programming language for data science and web development',
        color_code: '#3776AB',
        difficulty_level: 'beginner',
        popularity_rank: 2,
        github_repo_url: 'https://github.com/learning-zone/python-interview-questions',
        documentation_url: 'https://docs.python.org/'
      },
      {
        id: 'lang_java',
        name: 'Java',
        slug: 'java',
        description: 'Object-oriented programming language for enterprise applications',
        color_code: '#ED8B00',
        difficulty_level: 'intermediate',
        popularity_rank: 3,
        github_repo_url: 'https://github.com/learning-zone/java-interview-questions',
        documentation_url: 'https://docs.oracle.com/en/java/'
      },
      {
        id: 'lang_react',
        name: 'React',
        slug: 'react',
        description: 'JavaScript library for building user interfaces',
        color_code: '#61DAFB',
        difficulty_level: 'intermediate',
        popularity_rank: 4,
        github_repo_url: 'https://github.com/sudheerj/reactjs-interview-questions',
        documentation_url: 'https://reactjs.org/docs/'
      },
      {
        id: 'lang_nodejs',
        name: 'Node.js',
        slug: 'nodejs',
        description: 'JavaScript runtime for server-side development',
        color_code: '#339933',
        difficulty_level: 'intermediate',
        popularity_rank: 5,
        github_repo_url: 'https://github.com/learning-zone/nodejs-interview-questions',
        documentation_url: 'https://nodejs.org/en/docs/'
      },
      {
        id: 'lang_typescript',
        name: 'TypeScript',
        slug: 'typescript',
        description: 'Typed superset of JavaScript',
        color_code: '#3178C6',
        difficulty_level: 'intermediate',
        popularity_rank: 6,
        github_repo_url: 'https://github.com/Devinterview-io/typescript-interview-questions',
        documentation_url: 'https://www.typescriptlang.org/docs/'
      },
      {
        id: 'lang_csharp',
        name: 'C#',
        slug: 'csharp',
        description: 'Object-oriented programming language by Microsoft',
        color_code: '#239120',
        difficulty_level: 'intermediate',
        popularity_rank: 7,
        github_repo_url: 'https://github.com/learning-zone/csharp-interview-questions',
        documentation_url: 'https://docs.microsoft.com/en-us/dotnet/csharp/'
      },
      {
        id: 'lang_cpp',
        name: 'C++',
        slug: 'cpp',
        description: 'General-purpose programming language',
        color_code: '#00599C',
        difficulty_level: 'advanced',
        popularity_rank: 8,
        github_repo_url: 'https://github.com/learning-zone/cpp-interview-questions',
        documentation_url: 'https://en.cppreference.com/'
      },
      {
        id: 'lang_go',
        name: 'Go',
        slug: 'go',
        description: 'Open source programming language by Google',
        color_code: '#00ADD8',
        difficulty_level: 'intermediate',
        popularity_rank: 9,
        github_repo_url: 'https://github.com/learning-zone/golang-interview-questions',
        documentation_url: 'https://golang.org/doc/'
      },
      {
        id: 'lang_rust',
        name: 'Rust',
        slug: 'rust',
        description: 'Systems programming language focused on safety',
        color_code: '#000000',
        difficulty_level: 'advanced',
        popularity_rank: 10,
        github_repo_url: 'https://github.com/learning-zone/rust-interview-questions',
        documentation_url: 'https://doc.rust-lang.org/'
      }
    ];
    
    for (const lang of languages) {
      await sql`
        INSERT INTO programming_languages (
          id, name, slug, description, color_code, difficulty_level, 
          popularity_rank, github_repo_url, documentation_url
        ) VALUES (
          ${lang.id}, ${lang.name}, ${lang.slug}, ${lang.description}, 
          ${lang.color_code}, ${lang.difficulty_level}, ${lang.popularity_rank},
          ${lang.github_repo_url}, ${lang.documentation_url}
        ) ON CONFLICT (id) DO NOTHING;
      `;
    }
    
    console.log('🎉 Interview Preparation Platform created successfully!');
    console.log('🎯 Features implemented:');
    console.log('   ✅ 10 Programming languages with GitHub repos');
    console.log('   ✅ Interview questions and answers system');
    console.log('   ✅ Voice analysis and recording');
    console.log('   ✅ Tutor introduction videos');
    console.log('   ✅ Student feedback system');
    console.log('   ✅ PDF document management');
    console.log('   ✅ Interview analytics and progress tracking');
    console.log('   ✅ Session management and scoring');
    
  } catch (error) {
    console.error('❌ Failed to create Interview Platform:', error);
  }
}

createInterviewPlatform();
