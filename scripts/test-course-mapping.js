// Test the course ID mapping logic
function testCourseMapping() {
  console.log('🧪 Testing course ID mapping...');
  
  // Map string course IDs to integer IDs (same as in API)
  const courseIdMap = {
    'wordpress-dev': 1,
    'react-basics': 2,
    'python-fundamentals': 3,
    'digital-marketing': 4,
    'ui-ux-design': 5,
    'data-science': 6,
  };

  // Test cases
  const testCases = [
    'wordpress-dev',
    'react-basics',
    'python-fundamentals',
    'invalid-course',
    '',
    null,
    undefined
  ];

  console.log('📋 Test Results:');
  testCases.forEach(courseId => {
    const numericId = courseIdMap[courseId] || 1;
    const status = courseIdMap[courseId] ? '✅' : '⚠️ (default)';
    console.log(`  ${status} "${courseId}" → ${numericId}`);
  });

  // Test parseInt behavior that was causing NaN
  console.log('\n🔍 Testing parseInt behavior:');
  testCases.forEach(courseId => {
    const parsed = parseInt(courseId);
    const isNaN = Number.isNaN(parsed);
    const status = isNaN ? '❌ NaN' : '✅';
    console.log(`  ${status} parseInt("${courseId}") → ${parsed}`);
  });

  console.log('\n🎉 Course mapping test completed!');
  console.log('✅ The mapping approach prevents NaN errors');
  console.log('✅ Invalid course IDs default to course ID 1');
}

testCourseMapping();
