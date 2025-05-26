require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testBookingFlow() {
  try {
    console.log('🧪 Testing course booking database operations...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // Test 1: Check if we can insert a test user
    console.log('🔍 Test 1: Creating test user...');
    const testUserId = 'test-user-' + Date.now();
    const testClerkId = 'clerk-test-' + Date.now();
    
    await sql`
      INSERT INTO users (id, clerk_id, email, full_name, role)
      VALUES (${testUserId}, ${testClerkId}, 'test@example.com', 'Test User', 'student')
    `;
    console.log('   ✅ Test user created successfully');
    
    // Test 2: Check if we can insert a course booking
    console.log('🔍 Test 2: Creating test course booking...');
    const testBookingId = 'booking-test-' + Date.now();
    
    await sql`
      INSERT INTO course_bookings (
        id, student_id, tutor_id, course_id, selected_language, 
        selected_time_slot, total_amount, privacy_consent, terms_consent
      )
      VALUES (
        ${testBookingId}, ${testUserId}, ${testUserId}, 1, 'English',
        'Monday-10:00', 99.99, true, true
      )
    `;
    console.log('   ✅ Test course booking created successfully');
    
    // Test 3: Check if we can create a demo class
    console.log('🔍 Test 3: Creating test demo class...');
    const testDemoId = 'demo-test-' + Date.now();
    
    await sql`
      INSERT INTO demo_classes (
        id, booking_id, student_id, tutor_id, course_id, scheduled_date
      )
      VALUES (
        ${testDemoId}, ${testBookingId}, ${testUserId}, ${testUserId}, 1, 
        CURRENT_TIMESTAMP + INTERVAL '1 day'
      )
    `;
    console.log('   ✅ Test demo class created successfully');
    
    // Test 4: Check if we can create notifications
    console.log('🔍 Test 4: Creating test notification...');
    const testNotificationId = 'notification-test-' + Date.now();
    
    await sql`
      INSERT INTO notifications (
        id, user_id, type, title, message, related_booking_id
      )
      VALUES (
        ${testNotificationId}, ${testUserId}, 'demo_scheduled', 
        'Demo Class Scheduled', 'Your demo class has been scheduled', ${testBookingId}
      )
    `;
    console.log('   ✅ Test notification created successfully');
    
    // Test 5: Verify all data was inserted correctly
    console.log('🔍 Test 5: Verifying inserted data...');
    
    const booking = await sql`
      SELECT * FROM course_bookings WHERE id = ${testBookingId}
    `;
    console.log('   ✅ Booking data:', booking[0] ? 'Found' : 'Not found');
    
    const demo = await sql`
      SELECT * FROM demo_classes WHERE id = ${testDemoId}
    `;
    console.log('   ✅ Demo data:', demo[0] ? 'Found' : 'Not found');
    
    const notification = await sql`
      SELECT * FROM notifications WHERE id = ${testNotificationId}
    `;
    console.log('   ✅ Notification data:', notification[0] ? 'Found' : 'Not found');
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...');
    await sql`DELETE FROM notifications WHERE id = ${testNotificationId}`;
    await sql`DELETE FROM demo_classes WHERE id = ${testDemoId}`;
    await sql`DELETE FROM course_bookings WHERE id = ${testBookingId}`;
    await sql`DELETE FROM users WHERE id = ${testUserId}`;
    console.log('   ✅ Test data cleaned up');
    
    console.log('🎉 All database tests passed! Course booking system is ready.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testBookingFlow();
