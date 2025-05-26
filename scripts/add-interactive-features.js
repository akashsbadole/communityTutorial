require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function addInteractiveFeatures() {
  try {
    console.log('🚀 Adding interactive features to database...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Create live sessions table
    console.log('📝 Creating live_sessions table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS live_sessions (
          id TEXT PRIMARY KEY,
          course_id INTEGER NOT NULL,
          tutor_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          scheduled_date TIMESTAMP NOT NULL,
          duration_minutes INTEGER DEFAULT 60,
          meeting_link TEXT,
          meeting_password TEXT,
          status TEXT DEFAULT 'scheduled',
          max_participants INTEGER DEFAULT 50,
          recording_url TEXT,
          agenda TEXT,
          materials TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
          FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `;
      console.log('   ✅ live_sessions table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating live_sessions table:', error.message);
    }
    
    // Create session participants table
    console.log('📝 Creating session_participants table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS session_participants (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          student_id TEXT NOT NULL,
          joined_at TIMESTAMP,
          left_at TIMESTAMP,
          attendance_duration INTEGER,
          participated BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES live_sessions (id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `;
      console.log('   ✅ session_participants table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating session_participants table:', error.message);
    }
    
    // Create assignments table
    console.log('📝 Creating assignments table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS assignments (
          id TEXT PRIMARY KEY,
          course_id INTEGER NOT NULL,
          tutor_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          instructions TEXT,
          due_date TIMESTAMP NOT NULL,
          max_points INTEGER DEFAULT 100,
          submission_type TEXT DEFAULT 'file',
          allowed_file_types TEXT,
          max_file_size INTEGER DEFAULT 10485760,
          is_published BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
          FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `;
      console.log('   ✅ assignments table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating assignments table:', error.message);
    }
    
    // Create assignment submissions table
    console.log('📝 Creating assignment_submissions table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS assignment_submissions (
          id TEXT PRIMARY KEY,
          assignment_id TEXT NOT NULL,
          student_id TEXT NOT NULL,
          submission_text TEXT,
          submission_url TEXT,
          file_name TEXT,
          file_size INTEGER,
          file_type TEXT,
          status TEXT DEFAULT 'submitted',
          grade INTEGER,
          feedback TEXT,
          graded_at TIMESTAMP,
          graded_by TEXT,
          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (graded_by) REFERENCES users (id) ON DELETE SET NULL
        );
      `;
      console.log('   ✅ assignment_submissions table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating assignment_submissions table:', error.message);
    }
    
    // Create support tickets table
    console.log('📝 Creating support_tickets table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS support_tickets (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          category TEXT NOT NULL,
          priority TEXT DEFAULT 'normal',
          subject TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT DEFAULT 'open',
          assigned_to TEXT,
          resolution TEXT,
          resolved_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
        );
      `;
      console.log('   ✅ support_tickets table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating support_tickets table:', error.message);
    }
    
    // Create support ticket messages table
    console.log('📝 Creating support_ticket_messages table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS support_ticket_messages (
          id TEXT PRIMARY KEY,
          ticket_id TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          message TEXT NOT NULL,
          is_internal BOOLEAN DEFAULT FALSE,
          attachments TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE,
          FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `;
      console.log('   ✅ support_ticket_messages table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating support_ticket_messages table:', error.message);
    }
    
    // Add indexes for performance
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_live_sessions_course ON live_sessions (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_live_sessions_tutor ON live_sessions (tutor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_session_participants_session ON session_participants (session_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions (assignment_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets (user_id);`;
    
    // Insert sample data
    console.log('📝 Inserting sample live sessions...');
    const sampleSessions = [
      {
        id: 'session_001',
        course_id: 1,
        tutor_id: 'tutor_001',
        title: 'WordPress Basics - Getting Started',
        description: 'Introduction to WordPress development fundamentals',
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        meeting_link: 'https://zoom.us/j/123456789',
        meeting_password: 'wp2024',
        agenda: JSON.stringify([
          'WordPress installation and setup',
          'Understanding themes and plugins',
          'Basic customization techniques',
          'Q&A session'
        ])
      },
      {
        id: 'session_002',
        course_id: 1,
        tutor_id: 'tutor_001',
        title: 'Advanced WordPress Development',
        description: 'Deep dive into custom theme and plugin development',
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        meeting_link: 'https://zoom.us/j/987654321',
        meeting_password: 'advanced2024'
      }
    ];
    
    for (const session of sampleSessions) {
      try {
        await sql`
          INSERT INTO live_sessions (id, course_id, tutor_id, title, description, scheduled_date, meeting_link, meeting_password, agenda)
          VALUES (${session.id}, ${session.course_id}, ${session.tutor_id}, ${session.title}, ${session.description}, ${session.scheduled_date}, ${session.meeting_link}, ${session.meeting_password}, ${session.agenda || null})
          ON CONFLICT (id) DO NOTHING;
        `;
        console.log(`   ✅ Created session: ${session.title}`);
      } catch (error) {
        console.log(`   ⚠️ Session ${session.title} may already exist`);
      }
    }
    
    // Insert sample assignments
    console.log('📝 Inserting sample assignments...');
    const sampleAssignments = [
      {
        id: 'assignment_001',
        course_id: 1,
        tutor_id: 'tutor_001',
        title: 'Create Your First WordPress Theme',
        description: 'Build a custom WordPress theme from scratch using HTML, CSS, and PHP',
        instructions: 'Create a responsive WordPress theme with header, footer, and main content area. Include custom post types and fields.',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        max_points: 100,
        is_published: true
      },
      {
        id: 'assignment_002',
        course_id: 1,
        tutor_id: 'tutor_001',
        title: 'WordPress Plugin Development',
        description: 'Develop a custom WordPress plugin with admin interface',
        instructions: 'Create a plugin that adds custom functionality to WordPress with proper hooks and filters.',
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
        max_points: 150,
        is_published: true
      }
    ];
    
    for (const assignment of sampleAssignments) {
      try {
        await sql`
          INSERT INTO assignments (id, course_id, tutor_id, title, description, instructions, due_date, max_points, is_published)
          VALUES (${assignment.id}, ${assignment.course_id}, ${assignment.tutor_id}, ${assignment.title}, ${assignment.description}, ${assignment.instructions}, ${assignment.due_date}, ${assignment.max_points}, ${assignment.is_published})
          ON CONFLICT (id) DO NOTHING;
        `;
        console.log(`   ✅ Created assignment: ${assignment.title}`);
      } catch (error) {
        console.log(`   ⚠️ Assignment ${assignment.title} may already exist`);
      }
    }
    
    console.log('🎉 Interactive features added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add interactive features:', error);
  }
}

addInteractiveFeatures();
