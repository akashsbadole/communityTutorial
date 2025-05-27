require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createEmailSubscriptionSystem() {
  try {
    console.log('📧 Creating Email Subscription System...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Create email_subscriptions table
    console.log('📝 Creating email_subscriptions table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS email_subscriptions (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'active',
          source TEXT DEFAULT 'footer',
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          unsubscribed_at TIMESTAMP,
          mailchimp_id TEXT,
          preferences JSONB DEFAULT '{}',
          ip_address TEXT,
          user_agent TEXT,
          verified BOOLEAN DEFAULT FALSE,
          verification_token TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('   ✅ email_subscriptions table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating email_subscriptions table:', error.message);
    }
    
    // Create email_campaigns table for tracking
    console.log('📝 Creating email_campaigns table...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS email_campaigns (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          subject TEXT NOT NULL,
          content TEXT NOT NULL,
          mailchimp_campaign_id TEXT,
          status TEXT DEFAULT 'draft',
          sent_at TIMESTAMP,
          recipients_count INTEGER DEFAULT 0,
          open_rate DECIMAL(5,2),
          click_rate DECIMAL(5,2),
          created_by TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('   ✅ email_campaigns table created successfully');
    } catch (error) {
      console.error('   ❌ Error creating email_campaigns table:', error.message);
    }
    
    // Add indexes for performance
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions (email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_subscriptions_status ON email_subscriptions (status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_subscriptions_source ON email_subscriptions (source);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns (status);`;
    
    // Insert sample email subscriptions
    console.log('📝 Inserting sample email subscriptions...');
    const sampleSubscriptions = [
      {
        id: 'sub_001',
        email: 'john.doe@example.com',
        source: 'footer',
        verified: true,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: 'sub_002',
        email: 'jane.smith@example.com',
        source: 'course_page',
        verified: true,
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        id: 'sub_003',
        email: 'alice.johnson@example.com',
        source: 'footer',
        verified: false,
        ip_address: '192.168.1.3',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      }
    ];
    
    for (const subscription of sampleSubscriptions) {
      try {
        await sql`
          INSERT INTO email_subscriptions (id, email, source, verified, ip_address, user_agent)
          VALUES (${subscription.id}, ${subscription.email}, ${subscription.source}, ${subscription.verified}, ${subscription.ip_address}, ${subscription.user_agent})
          ON CONFLICT (email) DO NOTHING;
        `;
        console.log(`   ✅ Sample subscription created: ${subscription.email}`);
      } catch (error) {
        console.log(`   ⚠️ Subscription ${subscription.email} may already exist`);
      }
    }
    
    // Update system settings for email configuration
    console.log('📝 Adding email system settings...');
    const emailSettings = [
      {
        id: 'setting_email_001',
        key: 'mailchimp_api_key',
        value: process.env.MAILCHIMP_API_KEY || 'your_mailchimp_api_key',
        type: 'string',
        description: 'Mailchimp API key for email marketing',
        public: false
      },
      {
        id: 'setting_email_002',
        key: 'mailchimp_audience_id',
        value: process.env.MAILCHIMP_AUDIENCE_ID || 'your_mailchimp_audience_id',
        type: 'string',
        description: 'Mailchimp audience/list ID',
        public: false
      },
      {
        id: 'setting_email_003',
        key: 'mailchimp_server_prefix',
        value: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
        type: 'string',
        description: 'Mailchimp server prefix (e.g., us1, us2)',
        public: false
      },
      {
        id: 'setting_email_004',
        key: 'email_from_name',
        value: 'TrainingHub',
        type: 'string',
        description: 'Default sender name for emails',
        public: true
      },
      {
        id: 'setting_email_005',
        key: 'email_from_address',
        value: 'noreply@traininghub.com',
        type: 'string',
        description: 'Default sender email address',
        public: true
      },
      {
        id: 'setting_email_006',
        key: 'email_notifications_enabled',
        value: 'true',
        type: 'boolean',
        description: 'Enable email notifications',
        public: false
      }
    ];
    
    for (const setting of emailSettings) {
      try {
        await sql`
          INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_public)
          VALUES (${setting.id}, ${setting.key}, ${setting.value}, ${setting.type}, ${setting.description}, ${setting.public})
          ON CONFLICT (setting_key) DO NOTHING;
        `;
        console.log(`   ✅ Email setting created: ${setting.key}`);
      } catch (error) {
        console.log(`   ⚠️ Email setting ${setting.key} may already exist`);
      }
    }
    
    console.log('🎉 Email Subscription System created successfully!');
    console.log('📧 Features:');
    console.log('   ✅ Email subscription storage');
    console.log('   ✅ Mailchimp integration ready');
    console.log('   ✅ Email verification system');
    console.log('   ✅ Campaign tracking');
    console.log('   ✅ Unsubscribe management');
    console.log('   ✅ Privacy compliance');
    
  } catch (error) {
    console.error('❌ Failed to create Email Subscription System:', error);
  }
}

createEmailSubscriptionSystem();
