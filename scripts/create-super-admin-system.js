require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createSuperAdminSystem() {
  try {
    console.log('🚀 Creating Super Admin System...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Add admin role to users table
    console.log('📝 Adding admin role support...');
    try {
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;
      `;
      console.log('   ✅ Added is_super_admin column');
    } catch (error) {
      console.log('   ⚠️ is_super_admin column may already exist');
    }
    
    // Create admin_activities table for audit logs
    console.log('📝 Creating admin_activities table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_activities (
          id TEXT PRIMARY KEY,
          admin_id TEXT NOT NULL,
          action TEXT NOT NULL,
          target_type TEXT NOT NULL,
          target_id TEXT,
          details JSONB,
          ip_address TEXT,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `;
      console.log('   ✅ admin_activities table created');
    } catch (error) {
      console.error('   ❌ Error creating admin_activities table:', error.message);
    }
    
    // Create chat_rooms table
    console.log('📝 Creating chat_rooms table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS chat_rooms (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL,
          tutor_id TEXT NOT NULL,
          course_id INTEGER,
          is_active BOOLEAN DEFAULT TRUE,
          privacy_consent_student BOOLEAN DEFAULT FALSE,
          privacy_consent_tutor BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL,
          UNIQUE(student_id, tutor_id, course_id)
        );
      `;
      console.log('   ✅ chat_rooms table created');
    } catch (error) {
      console.error('   ❌ Error creating chat_rooms table:', error.message);
    }
    
    // Create chat_messages table
    console.log('📝 Creating chat_messages table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          room_id TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          message TEXT NOT NULL,
          message_type TEXT DEFAULT 'text',
          file_url TEXT,
          file_name TEXT,
          file_size INTEGER,
          is_read BOOLEAN DEFAULT FALSE,
          is_deleted BOOLEAN DEFAULT FALSE,
          reply_to_id TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (room_id) REFERENCES chat_rooms (id) ON DELETE CASCADE,
          FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (reply_to_id) REFERENCES chat_messages (id) ON DELETE SET NULL
        );
      `;
      console.log('   ✅ chat_messages table created');
    } catch (error) {
      console.error('   ❌ Error creating chat_messages table:', error.message);
    }
    
    // Create sms_notifications table
    console.log('📝 Creating sms_notifications table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS sms_notifications (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          message TEXT NOT NULL,
          sms_type TEXT NOT NULL,
          session_id TEXT,
          course_id INTEGER,
          status TEXT DEFAULT 'pending',
          twilio_sid TEXT,
          sent_at TIMESTAMP,
          delivered_at TIMESTAMP,
          error_message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (session_id) REFERENCES live_sessions (id) ON DELETE SET NULL,
          FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL
        );
      `;
      console.log('   ✅ sms_notifications table created');
    } catch (error) {
      console.error('   ❌ Error creating sms_notifications table:', error.message);
    }
    
    // Create system_settings table
    console.log('📝 Creating system_settings table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS system_settings (
          id TEXT PRIMARY KEY,
          setting_key TEXT UNIQUE NOT NULL,
          setting_value TEXT NOT NULL,
          setting_type TEXT DEFAULT 'string',
          description TEXT,
          is_public BOOLEAN DEFAULT FALSE,
          updated_by TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
        );
      `;
      console.log('   ✅ system_settings table created');
    } catch (error) {
      console.error('   ❌ Error creating system_settings table:', error.message);
    }
    
    // Add indexes for performance
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_activities_admin ON admin_activities (admin_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_rooms_student ON chat_rooms (student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_rooms_tutor ON chat_rooms (tutor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages (room_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages (sender_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sms_notifications_user ON sms_notifications (user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sms_notifications_status ON sms_notifications (status);`;
    
    // Create super admin user
    console.log('📝 Creating super admin user...');
    try {
      await sql`
        INSERT INTO users (id, clerk_id, email, full_name, role, is_super_admin, created_at)
        VALUES ('super_admin_001', 'super_admin_clerk_001', 'admin@traininghub.com', 'Super Admin', 'admin', true, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          is_super_admin = true,
          role = 'admin';
      `;
      console.log('   ✅ Super admin user created/updated');
    } catch (error) {
      console.log('   ⚠️ Super admin user may already exist');
    }
    
    // Insert default system settings
    console.log('📝 Inserting default system settings...');
    const defaultSettings = [
      {
        id: 'setting_001',
        key: 'twilio_account_sid',
        value: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
        type: 'string',
        description: 'Twilio Account SID for SMS notifications',
        public: false
      },
      {
        id: 'setting_002',
        key: 'twilio_auth_token',
        value: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
        type: 'string',
        description: 'Twilio Auth Token for SMS notifications',
        public: false
      },
      {
        id: 'setting_003',
        key: 'twilio_phone_number',
        value: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        type: 'string',
        description: 'Twilio Phone Number for sending SMS',
        public: false
      },
      {
        id: 'setting_004',
        key: 'platform_name',
        value: 'TrainingHub',
        type: 'string',
        description: 'Platform name for branding',
        public: true
      },
      {
        id: 'setting_005',
        key: 'sms_notifications_enabled',
        value: 'true',
        type: 'boolean',
        description: 'Enable SMS notifications for enrolled students',
        public: false
      }
    ];
    
    for (const setting of defaultSettings) {
      try {
        await sql`
          INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_public)
          VALUES (${setting.id}, ${setting.key}, ${setting.value}, ${setting.type}, ${setting.description}, ${setting.public})
          ON CONFLICT (setting_key) DO NOTHING;
        `;
        console.log(`   ✅ Created setting: ${setting.key}`);
      } catch (error) {
        console.log(`   ⚠️ Setting ${setting.key} may already exist`);
      }
    }
    
    // Insert sample data for testing
    console.log('📝 Inserting sample data...');
    
    // Sample chat room
    try {
      await sql`
        INSERT INTO chat_rooms (id, student_id, tutor_id, course_id, privacy_consent_student, privacy_consent_tutor)
        VALUES ('chat_room_001', 'student_001', 'tutor_001', 1, true, true)
        ON CONFLICT DO NOTHING;
      `;
      console.log('   ✅ Sample chat room created');
    } catch (error) {
      console.log('   ⚠️ Sample chat room may already exist');
    }
    
    // Sample chat messages
    const sampleMessages = [
      {
        id: 'msg_001',
        room_id: 'chat_room_001',
        sender_id: 'student_001',
        message: 'Hi John, I have a question about the WordPress assignment.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg_002',
        room_id: 'chat_room_001',
        sender_id: 'tutor_001',
        message: 'Hello! I\'d be happy to help. What specific part are you having trouble with?',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    for (const msg of sampleMessages) {
      try {
        await sql`
          INSERT INTO chat_messages (id, room_id, sender_id, message, created_at)
          VALUES (${msg.id}, ${msg.room_id}, ${msg.sender_id}, ${msg.message}, ${msg.created_at})
          ON CONFLICT DO NOTHING;
        `;
        console.log(`   ✅ Sample message created: ${msg.id}`);
      } catch (error) {
        console.log(`   ⚠️ Sample message ${msg.id} may already exist`);
      }
    }
    
    console.log('🎉 Super Admin System created successfully!');
    console.log('📧 Super Admin Email: admin@traininghub.com');
    console.log('🔑 Super Admin ID: super_admin_001');
    
  } catch (error) {
    console.error('❌ Failed to create Super Admin System:', error);
  }
}

createSuperAdminSystem();
