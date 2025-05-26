require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function addPaymentSupport() {
  try {
    console.log('🚀 Adding payment support to database...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Add payment columns to course_bookings table
    console.log('📝 Adding payment_method column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN payment_method TEXT;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ payment_method column already exists');
      } else {
        console.error('   ❌ Error adding payment_method:', error.message);
      }
    }
    
    console.log('📝 Adding payment_id column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN payment_id TEXT;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ payment_id column already exists');
      } else {
        console.error('   ❌ Error adding payment_id:', error.message);
      }
    }
    
    console.log('📝 Adding payment_details column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN payment_details JSONB;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ payment_details column already exists');
      } else {
        console.error('   ❌ Error adding payment_details:', error.message);
      }
    }
    
    // Create payments table for detailed payment tracking
    console.log('📝 Creating payments table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          booking_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          payment_method TEXT NOT NULL,
          payment_provider TEXT NOT NULL,
          payment_id TEXT,
          payment_status TEXT DEFAULT 'pending',
          payment_details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (booking_id) REFERENCES course_bookings (id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `;
      console.log('   ✅ payments table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating payments table:', error.message);
    }
    
    // Create courses table for course management
    console.log('📝 Creating courses table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS courses (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          duration_weeks INTEGER,
          total_sessions INTEGER,
          session_duration_minutes INTEGER DEFAULT 60,
          category TEXT,
          difficulty_level TEXT,
          prerequisites TEXT,
          learning_outcomes TEXT,
          syllabus JSONB,
          is_active BOOLEAN DEFAULT TRUE,
          created_by TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
        );
      `;
      console.log('   ✅ courses table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating courses table:', error.message);
    }
    
    // Create course_tutors table for many-to-many relationship
    console.log('📝 Creating course_tutors table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS course_tutors (
          id TEXT PRIMARY KEY,
          course_id INTEGER NOT NULL,
          tutor_id TEXT NOT NULL,
          is_primary BOOLEAN DEFAULT FALSE,
          hourly_rate REAL,
          availability TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
          FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(course_id, tutor_id)
        );
      `;
      console.log('   ✅ course_tutors table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating course_tutors table:', error.message);
    }
    
    // Add indexes for performance
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments (booking_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_tutors_course ON course_tutors (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_tutors_tutor ON course_tutors (tutor_id);`;
    
    // Insert sample courses
    console.log('📝 Inserting sample courses...');
    const sampleCourses = [
      {
        title: 'WordPress Development Mastery',
        description: 'Learn to build professional WordPress websites from scratch',
        price: 299.99,
        duration_weeks: 8,
        total_sessions: 16,
        category: 'Web Development',
        difficulty_level: 'Beginner to Intermediate',
        prerequisites: 'Basic HTML/CSS knowledge',
        learning_outcomes: 'Build custom WordPress themes and plugins'
      },
      {
        title: 'React.js Complete Course',
        description: 'Master React development with hooks, context, and modern patterns',
        price: 399.99,
        duration_weeks: 10,
        total_sessions: 20,
        category: 'Frontend Development',
        difficulty_level: 'Intermediate',
        prerequisites: 'JavaScript fundamentals',
        learning_outcomes: 'Build modern React applications'
      },
      {
        title: 'Python for Data Science',
        description: 'Learn Python programming for data analysis and machine learning',
        price: 449.99,
        duration_weeks: 12,
        total_sessions: 24,
        category: 'Data Science',
        difficulty_level: 'Beginner',
        prerequisites: 'Basic programming knowledge',
        learning_outcomes: 'Analyze data and build ML models'
      }
    ];
    
    for (const course of sampleCourses) {
      try {
        const result = await sql`
          INSERT INTO courses (title, description, price, duration_weeks, total_sessions, category, difficulty_level, prerequisites, learning_outcomes)
          VALUES (${course.title}, ${course.description}, ${course.price}, ${course.duration_weeks}, ${course.total_sessions}, ${course.category}, ${course.difficulty_level}, ${course.prerequisites}, ${course.learning_outcomes})
          ON CONFLICT DO NOTHING
          RETURNING id;
        `;
        if (result.length > 0) {
          console.log(`   ✅ Created course: ${course.title} (ID: ${result[0].id})`);
        }
      } catch (error) {
        console.log(`   ⚠️ Course ${course.title} may already exist`);
      }
    }
    
    // Assign tutors to courses
    console.log('📝 Assigning tutors to courses...');
    try {
      // Get course IDs
      const courses = await sql`SELECT id, title FROM courses ORDER BY id;`;
      
      // Assign tutor_001 to WordPress course
      if (courses.length > 0) {
        await sql`
          INSERT INTO course_tutors (id, course_id, tutor_id, is_primary, hourly_rate)
          VALUES ('ct_001', ${courses[0].id}, 'tutor_001', true, 50.00)
          ON CONFLICT DO NOTHING;
        `;
        console.log(`   ✅ Assigned tutor_001 to ${courses[0].title}`);
      }
      
      // Assign tutor_002 to React course
      if (courses.length > 1) {
        await sql`
          INSERT INTO course_tutors (id, course_id, tutor_id, is_primary, hourly_rate)
          VALUES ('ct_002', ${courses[1].id}, 'tutor_002', true, 60.00)
          ON CONFLICT DO NOTHING;
        `;
        console.log(`   ✅ Assigned tutor_002 to ${courses[1].title}`);
      }
      
    } catch (error) {
      console.error('   ❌ Error assigning tutors:', error.message);
    }
    
    console.log('🎉 Payment support and course management added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add payment support:', error);
  }
}

addPaymentSupport();
