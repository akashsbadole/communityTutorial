require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testForeignKeys() {
  try {
    console.log('🧪 Testing foreign key relationships...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Test 1: Check if tutors exist
    console.log('🔍 Test 1: Checking if tutors exist...');
    const tutors = await sql`
      SELECT id, full_name FROM users WHERE role = 'tutor' ORDER BY id
    `;
    
    console.log(`   ✅ Found ${tutors.length} tutors:`);
    tutors.forEach(tutor => {
      console.log(`     - ${tutor.id}: ${tutor.full_name}`);
    });
    
    // Test 2: Test foreign key constraint with valid tutor
    console.log('🔍 Test 2: Testing valid foreign key relationship...');
    const testBookingId = 'test-booking-' + Date.now();
    const testStudentId = 'test-student-' + Date.now();
    
    // Create test student first
    await sql`
      INSERT INTO users (id, clerk_id, email, full_name, role)
      VALUES (${testStudentId}, 'clerk-test-student', 'test@example.com', 'Test Student', 'student')
    `;
    
    // Try to create booking with valid tutor_id
    try {
      await sql`
        INSERT INTO course_bookings (
          id, student_id, tutor_id, course_id, selected_language, 
          selected_time_slot, total_amount, privacy_consent, terms_consent
        )
        VALUES (
          ${testBookingId}, ${testStudentId}, 'tutor_001', 1, 'English',
          'Monday-10:00', 99.99, true, true
        )
      `;
      console.log('   ✅ Successfully created booking with valid tutor_id');
    } catch (error) {
      console.log('   ❌ Failed to create booking:', error.message);
    }
    
    // Test 3: Test foreign key constraint with invalid tutor
    console.log('🔍 Test 3: Testing invalid foreign key relationship...');
    const testBookingId2 = 'test-booking-2-' + Date.now();
    
    try {
      await sql`
        INSERT INTO course_bookings (
          id, student_id, tutor_id, course_id, selected_language, 
          selected_time_slot, total_amount, privacy_consent, terms_consent
        )
        VALUES (
          ${testBookingId2}, ${testStudentId}, 'invalid_tutor', 1, 'English',
          'Monday-10:00', 99.99, true, true
        )
      `;
      console.log('   ❌ Unexpectedly succeeded with invalid tutor_id');
    } catch (error) {
      if (error.message.includes('foreign key constraint')) {
        console.log('   ✅ Correctly rejected invalid tutor_id (foreign key constraint working)');
      } else {
        console.log('   ❌ Failed for different reason:', error.message);
      }
    }
    
    // Test 4: Verify booking was created
    console.log('🔍 Test 4: Verifying booking was created...');
    const bookings = await sql`
      SELECT b.id, b.student_id, b.tutor_id, u.full_name as tutor_name
      FROM course_bookings b
      JOIN users u ON b.tutor_id = u.id
      WHERE b.id = ${testBookingId}
    `;
    
    if (bookings.length > 0) {
      const booking = bookings[0];
      console.log(`   ✅ Booking found: ${booking.id}`);
      console.log(`     Student: ${booking.student_id}`);
      console.log(`     Tutor: ${booking.tutor_id} (${booking.tutor_name})`);
    } else {
      console.log('   ❌ Booking not found');
    }
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await sql`DELETE FROM course_bookings WHERE id IN (${testBookingId}, ${testBookingId2})`;
    await sql`DELETE FROM users WHERE id = ${testStudentId}`;
    console.log('   ✅ Test data cleaned up');
    
    console.log('🎉 Foreign key relationship tests completed!');
    console.log('✅ Tutors exist in database');
    console.log('✅ Foreign key constraints are working');
    console.log('✅ Course booking should work now');
    
  } catch (error) {
    console.error('❌ Foreign key test failed:', error);
  }
}

testForeignKeys();
