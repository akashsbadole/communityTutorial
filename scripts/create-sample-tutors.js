require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createSampleTutors() {
  try {
    console.log('🚀 Creating sample tutors in database...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Sample tutors data (matching the mock data from the frontend)
    const tutors = [
      {
        id: 'tutor_001',
        clerkId: 'clerk_tutor_001',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        phone: '+1234567890',
        whatsapp: '+1987654321',
        role: 'tutor'
      },
      {
        id: 'tutor_002',
        clerkId: 'clerk_tutor_002',
        email: 'jane.smith@example.com',
        fullName: 'Jane Smith',
        phone: '+1234567891',
        whatsapp: '+1987654322',
        role: 'tutor'
      },
      {
        id: 'tutor_003',
        clerkId: 'clerk_tutor_003',
        email: 'mike.johnson@example.com',
        fullName: 'Mike Johnson',
        phone: '+1234567892',
        whatsapp: '+1987654323',
        role: 'tutor'
      },
      {
        id: 'tutor_004',
        clerkId: 'clerk_tutor_004',
        email: 'sarah.wilson@example.com',
        fullName: 'Sarah Wilson',
        phone: '+1234567893',
        whatsapp: '+1987654324',
        role: 'tutor'
      },
      {
        id: 'tutor_005',
        clerkId: 'clerk_tutor_005',
        email: 'david.brown@example.com',
        fullName: 'David Brown',
        phone: '+1234567894',
        whatsapp: '+1987654325',
        role: 'tutor'
      }
    ];
    
    console.log('📝 Creating tutor users...');
    
    for (const tutor of tutors) {
      try {
        // Check if tutor already exists
        const existing = await sql`
          SELECT id FROM users WHERE id = ${tutor.id}
        `;
        
        if (existing.length > 0) {
          console.log(`   ✅ Tutor ${tutor.id} (${tutor.fullName}) already exists`);
          continue;
        }
        
        // Insert tutor user
        await sql`
          INSERT INTO users (id, clerk_id, email, full_name, phone, whatsapp, role)
          VALUES (${tutor.id}, ${tutor.clerkId}, ${tutor.email}, ${tutor.fullName}, ${tutor.phone}, ${tutor.whatsapp}, ${tutor.role})
        `;
        
        console.log(`   ✅ Created tutor ${tutor.id} (${tutor.fullName})`);
        
        // Create tutor profile
        const profileId = 'profile_' + tutor.id;
        await sql`
          INSERT INTO tutor_profiles (id, user_id, bio, experience, specializations, languages)
          VALUES (
            ${profileId}, 
            ${tutor.id}, 
            'Experienced tutor with expertise in multiple technologies',
            '5+ years of teaching experience',
            '["Web Development", "Programming", "Design"]',
            '["English", "Spanish"]'
          )
        `;
        
        console.log(`   ✅ Created profile for ${tutor.id}`);
        
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`   ✅ Tutor ${tutor.id} already exists (duplicate key)`);
        } else {
          console.error(`   ❌ Error creating tutor ${tutor.id}:`, error.message);
        }
      }
    }
    
    // Verify tutors were created
    console.log('🔍 Verifying created tutors...');
    const allTutors = await sql`
      SELECT u.id, u.full_name, u.email, u.role 
      FROM users u 
      WHERE u.role = 'tutor' 
      ORDER BY u.id
    `;
    
    console.log('✅ Tutors in database:');
    allTutors.forEach(tutor => {
      console.log(`  - ${tutor.id}: ${tutor.full_name} (${tutor.email})`);
    });
    
    console.log('🎉 Sample tutors created successfully!');
    console.log(`📊 Total tutors: ${allTutors.length}`);
    
  } catch (error) {
    console.error('❌ Failed to create sample tutors:', error);
  }
}

createSampleTutors();
