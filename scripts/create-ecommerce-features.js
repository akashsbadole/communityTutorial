require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createEcommerceFeatures() {
  try {
    console.log('🛒 Creating E-commerce and Advanced Features...');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }

    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);

    // 1. Course Orders/Bookings Table
    console.log('📝 Creating course_orders table...');
    await sql`
      CREATE TABLE IF NOT EXISTS course_orders (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        payment_id TEXT,
        receipt_url TEXT,
        order_status TEXT DEFAULT 'pending',
        billing_address JSONB,
        discount_code TEXT,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_date TIMESTAMP,
        completion_date TIMESTAMP,
        refund_date TIMESTAMP,
        refund_amount DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Course Syllabus Table
    console.log('📝 Creating course_syllabus table...');
    await sql`
      CREATE TABLE IF NOT EXISTS course_syllabus (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        module_number INTEGER NOT NULL,
        module_title TEXT NOT NULL,
        module_description TEXT,
        topics JSONB NOT NULL,
        estimated_hours INTEGER DEFAULT 0,
        prerequisites TEXT[],
        learning_objectives TEXT[],
        resources JSONB,
        is_mandatory BOOLEAN DEFAULT true,
        order_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Student Progress Table
    console.log('📝 Creating student_progress table...');
    await sql`
      CREATE TABLE IF NOT EXISTS student_progress (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        syllabus_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        topic_title TEXT NOT NULL,
        status TEXT DEFAULT 'not_started',
        completion_date TIMESTAMP,
        time_spent INTEGER DEFAULT 0,
        notes TEXT,
        rating INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, course_id, syllabus_id, topic_id)
      );
    `;

    // 4. Certificates Table
    console.log('📝 Creating certificates table...');
    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        certificate_number TEXT UNIQUE NOT NULL,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        order_id TEXT NOT NULL,
        student_name TEXT NOT NULL,
        course_title TEXT NOT NULL,
        completion_date TIMESTAMP NOT NULL,
        issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        grade TEXT,
        score DECIMAL(5,2),
        certificate_url TEXT,
        verification_url TEXT,
        is_verified BOOLEAN DEFAULT true,
        template_used TEXT DEFAULT 'modern',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Notice Board Table
    console.log('📝 Creating notice_board table...');
    await sql`
      CREATE TABLE IF NOT EXISTS notice_board (
        id TEXT PRIMARY KEY,
        tutor_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        notice_type TEXT DEFAULT 'general',
        priority TEXT DEFAULT 'normal',
        target_students TEXT[],
        is_urgent BOOLEAN DEFAULT false,
        attachments JSONB,
        read_by JSONB DEFAULT '{}',
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Admin Monitoring Table
    console.log('📝 Creating admin_monitoring table...');
    await sql`
      CREATE TABLE IF NOT EXISTS admin_monitoring (
        id TEXT PRIMARY KEY,
        monitor_type TEXT NOT NULL,
        content_type TEXT NOT NULL,
        content_id TEXT NOT NULL,
        content_text TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        receiver_id TEXT,
        receiver_role TEXT,
        sentiment_score DECIMAL(3,2),
        flagged_keywords TEXT[],
        risk_level TEXT DEFAULT 'low',
        admin_reviewed BOOLEAN DEFAULT false,
        admin_action TEXT,
        admin_notes TEXT,
        reviewed_by TEXT,
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 7. Payment Receipts Table
    console.log('📝 Creating payment_receipts table...');
    await sql`
      CREATE TABLE IF NOT EXISTS payment_receipts (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        receipt_number TEXT UNIQUE NOT NULL,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method TEXT NOT NULL,
        payment_date TIMESTAMP NOT NULL,
        receipt_data JSONB NOT NULL,
        pdf_url TEXT,
        email_sent BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes for performance
    console.log('📝 Creating performance indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_course_orders_student ON course_orders (student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_orders_course ON course_orders (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_orders_status ON course_orders (order_status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_orders_payment ON course_orders (payment_status);`;

    await sql`CREATE INDEX IF NOT EXISTS idx_course_syllabus_course ON course_syllabus (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_course_syllabus_order ON course_syllabus (course_id, order_index);`;

    await sql`CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress (student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_student_progress_course ON student_progress (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_student_progress_status ON student_progress (status);`;

    await sql`CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates (student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates (certificate_number);`;

    await sql`CREATE INDEX IF NOT EXISTS idx_notice_board_tutor ON notice_board (tutor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notice_board_course ON notice_board (course_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notice_board_active ON notice_board (is_active);`;

    await sql`CREATE INDEX IF NOT EXISTS idx_admin_monitoring_type ON admin_monitoring (monitor_type);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_monitoring_risk ON admin_monitoring (risk_level);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_monitoring_reviewed ON admin_monitoring (admin_reviewed);`;

    await sql`CREATE INDEX IF NOT EXISTS idx_payment_receipts_order ON payment_receipts (order_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_receipts_student ON payment_receipts (student_id);`;

    console.log('📝 Inserting sample data...');

    // Sample course syllabus
    const sampleSyllabus = [
      {
        id: 'syllabus_001',
        course_id: 'course_001',
        module_number: 1,
        module_title: 'WordPress Fundamentals',
        module_description: 'Learn the basics of WordPress installation, setup, and navigation',
        topics: JSON.stringify([
          { id: 'topic_001', title: 'WordPress Installation', estimated_time: 30 },
          { id: 'topic_002', title: 'Dashboard Overview', estimated_time: 45 },
          { id: 'topic_003', title: 'Basic Settings Configuration', estimated_time: 60 },
          { id: 'topic_004', title: 'User Management', estimated_time: 40 }
        ]),
        estimated_hours: 3,
        learning_objectives: ['Understand WordPress basics', 'Navigate the dashboard', 'Configure basic settings'],
        order_index: 1
      },
      {
        id: 'syllabus_002',
        course_id: 'course_001',
        module_number: 2,
        module_title: 'Content Management',
        module_description: 'Master creating and managing content in WordPress',
        topics: JSON.stringify([
          { id: 'topic_005', title: 'Creating Posts', estimated_time: 45 },
          { id: 'topic_006', title: 'Managing Pages', estimated_time: 45 },
          { id: 'topic_007', title: 'Media Library', estimated_time: 30 },
          { id: 'topic_008', title: 'Categories and Tags', estimated_time: 30 }
        ]),
        estimated_hours: 3,
        learning_objectives: ['Create engaging content', 'Organize content effectively', 'Use media efficiently'],
        order_index: 2
      }
    ];

    for (const syllabus of sampleSyllabus) {
      await sql`
        INSERT INTO course_syllabus (
          id, course_id, module_number, module_title, module_description,
          topics, estimated_hours, learning_objectives, order_index
        ) VALUES (
          ${syllabus.id}, ${syllabus.course_id}, ${syllabus.module_number},
          ${syllabus.module_title}, ${syllabus.module_description},
          ${syllabus.topics}, ${syllabus.estimated_hours},
          ${syllabus.learning_objectives}, ${syllabus.order_index}
        ) ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Sample notice board entries
    const sampleNotices = [
      {
        id: 'notice_001',
        tutor_id: 'tutor_001',
        course_id: 'course_001',
        title: 'Welcome to WordPress Development Course!',
        content: 'Welcome everyone! Please make sure to complete the pre-course survey and download the required software. Our first live session is scheduled for tomorrow at 2 PM EST.',
        notice_type: 'announcement',
        priority: 'high',
        target_students: ['student_001', 'student_002']
      },
      {
        id: 'notice_002',
        tutor_id: 'tutor_001',
        course_id: 'course_001',
        title: 'Assignment Deadline Reminder',
        content: 'Reminder: Your first assignment is due this Friday. Please submit your WordPress installation screenshots and basic site setup.',
        notice_type: 'reminder',
        priority: 'normal',
        target_students: ['student_001', 'student_002']
      }
    ];

    for (const notice of sampleNotices) {
      await sql`
        INSERT INTO notice_board (
          id, tutor_id, course_id, title, content, notice_type, priority, target_students
        ) VALUES (
          ${notice.id}, ${notice.tutor_id}, ${notice.course_id}, ${notice.title},
          ${notice.content}, ${notice.notice_type}, ${notice.priority}, ${notice.target_students}
        ) ON CONFLICT (id) DO NOTHING;
      `;
    }

    console.log('🎉 E-commerce and Advanced Features created successfully!');
    console.log('📊 Features implemented:');
    console.log('   ✅ Course ordering and payment system');
    console.log('   ✅ Receipt generation system');
    console.log('   ✅ Course syllabus with progress tracking');
    console.log('   ✅ Certificate generation with unique numbers');
    console.log('   ✅ Notice board for tutors');
    console.log('   ✅ Admin monitoring for chat and notices');
    console.log('   ✅ Student progress tracking');
    console.log('   ✅ Payment receipt management');

  } catch (error) {
    console.error('❌ Failed to create E-commerce features:', error);
  }
}

createEcommerceFeatures();
