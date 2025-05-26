import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database tables...');
    
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Create tables one by one with error handling
    console.log('📝 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        whatsapp TEXT,
        role TEXT NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
        profile_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('📝 Creating course_bookings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS course_bookings (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        tutor_id TEXT NOT NULL,
        course_id INTEGER NOT NULL,
        selected_language TEXT NOT NULL,
        selected_time_slot TEXT NOT NULL,
        booking_status TEXT DEFAULT 'pending',
        total_amount REAL NOT NULL,
        privacy_consent BOOLEAN DEFAULT FALSE,
        terms_consent BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;
    
    console.log('📝 Creating demo_classes table...');
    await sql`
      CREATE TABLE IF NOT EXISTS demo_classes (
        id TEXT PRIMARY KEY,
        booking_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        tutor_id TEXT NOT NULL,
        course_id INTEGER NOT NULL,
        scheduled_date TIMESTAMP NOT NULL,
        meeting_link TEXT,
        status TEXT DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES course_bookings (id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;
    
    console.log('📝 Creating notifications table...');
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        action_url TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        priority TEXT DEFAULT 'normal',
        related_booking_id TEXT,
        related_demo_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (related_booking_id) REFERENCES course_bookings (id) ON DELETE SET NULL,
        FOREIGN KEY (related_demo_id) REFERENCES demo_classes (id) ON DELETE SET NULL
      );
    `;
    
    console.log('📝 Creating student_profiles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        current_role TEXT,
        background TEXT,
        experience_level TEXT,
        learning_goals TEXT,
        time_commitment TEXT,
        preferred_schedule TEXT,
        selected_interests TEXT,
        specific_goals TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;
    
    console.log('📝 Creating tutor_profiles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS tutor_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        bio TEXT NOT NULL,
        experience TEXT,
        specializations TEXT,
        languages TEXT NOT NULL,
        timezone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;
    
    // Create indexes
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users (clerk_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_bookings_student ON course_bookings (student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);`;
    
    // Verify tables exist
    console.log('🔍 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('✅ Tables created successfully:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Export for use in other files
export { setupDatabase };

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
