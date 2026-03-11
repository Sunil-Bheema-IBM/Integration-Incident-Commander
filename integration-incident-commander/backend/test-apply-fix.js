/**
 * Test script to verify the apply-fix endpoint
 * Run this to test if the backend endpoint is working correctly
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testApplyFix() {
  console.log('🧪 Testing Apply Fix Endpoint...\n');
  
  try {
    console.log(`📡 Sending POST request to: ${API_BASE_URL}/integration/apply-fix`);
    
    const response = await axios.post(`${API_BASE_URL}/integration/apply-fix`);
    
    console.log('\n✅ SUCCESS! Response received:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Validate response structure
    if (response.data.success && response.data.runId) {
      console.log('\n✅ Response structure is valid');
      console.log(`   - success: ${response.data.success}`);
      console.log(`   - runId: ${response.data.runId}`);
      console.log(`   - message: ${response.data.message}`);
      console.log(`   - fixApplied: ${response.data.fixApplied}`);
      
      // Test getting the status
      console.log('\n📡 Testing status endpoint...');
      const statusResponse = await axios.get(`${API_BASE_URL}/integration/status/${response.data.runId}`);
      console.log('✅ Status retrieved:');
      console.log(JSON.stringify(statusResponse.data, null, 2));
      
      console.log('\n🎉 All tests passed! The endpoint is working correctly.');
    } else {
      console.log('\n❌ Response structure is invalid');
      console.log('   Expected: { success: true, runId: "...", ... }');
      console.log('   Received:', response.data);
    }
    
  } catch (error) {
    console.log('\n❌ ERROR occurred:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   Connection refused - Backend server is not running!');
      console.log('\n   To fix:');
      console.log('   1. Open a terminal');
      console.log('   2. cd integration-incident-commander/backend');
      console.log('   3. npm start');
      console.log('   4. Wait for "Server running on port 3001"');
      console.log('   5. Run this test again');
    } else if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`);
      console.log('   Response:', error.response.data);
    } else {
      console.log('   Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the test
console.log('═══════════════════════════════════════════════════════');
console.log('  Integration Incident Commander - Endpoint Test');
console.log('═══════════════════════════════════════════════════════\n');

testApplyFix();

// Made with Bob
