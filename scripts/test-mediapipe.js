// Test script to verify MediaPipe installation
console.log('Testing MediaPipe installation...');

async function testMediaPipe() {
  try {
    // Test 1: Try to import MediaPipe
    console.log('1. Testing dynamic import...');
    const { FaceMesh } = await import('@mediapipe/face_mesh');
    console.log('✅ MediaPipe FaceMesh imported successfully');
    
    // Test 2: Try to create instance
    console.log('2. Testing FaceMesh constructor...');
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    console.log('✅ FaceMesh instance created successfully');
    
    // Test 3: Test configuration
    console.log('3. Testing configuration...');
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    console.log('✅ FaceMesh configured successfully');
    
    console.log('🎉 All MediaPipe tests passed!');
    
  } catch (error) {
    console.error('❌ MediaPipe test failed:', error);
    
    // Try alternative loading methods
    console.log('🔄 Trying alternative loading methods...');
    
    try {
      // Test CDN loading
      console.log('Testing CDN loading...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
      
      script.onload = () => {
        console.log('✅ MediaPipe loaded from CDN');
        if (window.FaceMesh) {
          console.log('✅ FaceMesh constructor available globally');
        } else {
          console.log('❌ FaceMesh constructor not found in global scope');
        }
      };
      
      script.onerror = () => {
        console.log('❌ Failed to load MediaPipe from CDN');
      };
      
      document.head.appendChild(script);
      
    } catch (cdnError) {
      console.error('❌ CDN loading also failed:', cdnError);
    }
  }
}

// Run the test
if (typeof window !== 'undefined') {
  testMediaPipe();
} else {
  console.log('❌ This test requires a browser environment');
}
