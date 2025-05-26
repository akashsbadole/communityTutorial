require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function addMissingColumns() {
  try {
    console.log('🚀 Adding missing columns to course_bookings table...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Add missing columns to course_bookings table
    console.log('📝 Adding demo_scheduled column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN demo_scheduled BOOLEAN DEFAULT FALSE;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ demo_scheduled column already exists');
      } else {
        console.error('   ❌ Error adding demo_scheduled:', error.message);
      }
    }
    
    console.log('📝 Adding demo_completed column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN demo_completed BOOLEAN DEFAULT FALSE;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ demo_completed column already exists');
      } else {
        console.error('   ❌ Error adding demo_completed:', error.message);
      }
    }
    
    console.log('📝 Adding payment_status column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN payment_status TEXT DEFAULT 'pending';`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ payment_status column already exists');
      } else {
        console.error('   ❌ Error adding payment_status:', error.message);
      }
    }
    
    console.log('📝 Adding booking_date column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ booking_date column already exists');
      } else {
        console.error('   ❌ Error adding booking_date:', error.message);
      }
    }
    
    console.log('📝 Adding demo_date column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN demo_date TIMESTAMP;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ demo_date column already exists');
      } else {
        console.error('   ❌ Error adding demo_date:', error.message);
      }
    }
    
    console.log('📝 Adding course_start_date column...');
    try {
      await sql`ALTER TABLE course_bookings ADD COLUMN course_start_date TIMESTAMP;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ course_start_date column already exists');
      } else {
        console.error('   ❌ Error adding course_start_date:', error.message);
      }
    }
    
    // Also add missing columns to demo_classes table
    console.log('📝 Adding duration_minutes column to demo_classes...');
    try {
      await sql`ALTER TABLE demo_classes ADD COLUMN duration_minutes INTEGER DEFAULT 60;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ duration_minutes column already exists');
      } else {
        console.error('   ❌ Error adding duration_minutes:', error.message);
      }
    }
    
    console.log('📝 Adding student_attended column to demo_classes...');
    try {
      await sql`ALTER TABLE demo_classes ADD COLUMN student_attended BOOLEAN DEFAULT FALSE;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ student_attended column already exists');
      } else {
        console.error('   ❌ Error adding student_attended:', error.message);
      }
    }
    
    console.log('📝 Adding tutor_notes column to demo_classes...');
    try {
      await sql`ALTER TABLE demo_classes ADD COLUMN tutor_notes TEXT;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ tutor_notes column already exists');
      } else {
        console.error('   ❌ Error adding tutor_notes:', error.message);
      }
    }
    
    console.log('📝 Adding student_feedback column to demo_classes...');
    try {
      await sql`ALTER TABLE demo_classes ADD COLUMN student_feedback TEXT;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ student_feedback column already exists');
      } else {
        console.error('   ❌ Error adding student_feedback:', error.message);
      }
    }
    
    console.log('📝 Adding rating column to demo_classes...');
    try {
      await sql`ALTER TABLE demo_classes ADD COLUMN rating INTEGER;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ rating column already exists');
      } else {
        console.error('   ❌ Error adding rating:', error.message);
      }
    }
    
    // Add missing columns to notifications table
    console.log('📝 Adding expires_at column to notifications...');
    try {
      await sql`ALTER TABLE notifications ADD COLUMN expires_at TIMESTAMP;`;
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('   ✅ expires_at column already exists');
      } else {
        console.error('   ❌ Error adding expires_at:', error.message);
      }
    }
    
    // Verify the table structure
    console.log('🔍 Verifying course_bookings table structure...');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'course_bookings' 
      ORDER BY ordinal_position;
    `;
    
    console.log('✅ course_bookings table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    console.log('🎉 Missing columns added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add missing columns:', error);
  }
}

addMissingColumns();
