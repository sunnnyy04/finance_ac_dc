const BASE_URL = 'http://localhost:3000/api/v1';

async function runTest() {
  const testResults = [];

  async function apiTest(name, path, method = 'GET', body = null, token = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(`${BASE_URL}${path}`, options);
      const data = res.status !== 204 ? await res.json() : null;
      const success = res.ok;
      testResults.push({ name, status: res.status, success, data });
      console.log(`[${success ? 'PASS' : 'FAIL'}] ${name} (${res.status})`);
      return { success, data, status: res.status };
    } catch (e) {
      testResults.push({ name, success: false, error: e.message });
      console.log(`[ERROR] ${name}: ${e.message}`);
      return { success: false };
    }
  }

  console.log('--- STARTING ALL API TESTS ---');

  // 1. AUTH APIs
  const email = `test_all_${Date.now()}@example.com`;
  await apiTest('Auth: Register', '/auth/register', 'POST', {
    name: "Full Test User",
    email,
    password: "password123",
    role: "ADMIN"
  });

  const login = await apiTest('Auth: Login', '/auth/login', 'POST', {
    email,
    password: "password123"
  });
  const token = login.data?.data?.token;
  const userId = login.data?.data?.user?.id;

  if (!token) {
    console.error('Critical: Failed to get token, stopping tests.');
    return;
  }

  // 2. RECORD APIs
  const createRecord = await apiTest('Record: Create', '/records', 'POST', {
    amount: 5000,
    type: 'INCOME',
    category: 'Bonus',
    date: new Date().toISOString(),
    notes: 'Testing create api'
  }, token);
  const recordId = createRecord.data?.data?.id;

  await apiTest('Record: Find All', '/records', 'GET', null, token);
  await apiTest('Record: Find All (Filter Category)', '/records?category=Bonus', 'GET', null, token);
  await apiTest('Record: Find By Id', `/records/${recordId}`, 'GET', null, token);
  await apiTest('Record: Update', `/records/${recordId}`, 'PATCH', { amount: 6000, notes: 'Updated notes' }, token);
  
  // 3. DASHBOARD APIs
  await apiTest('Dashboard: Summary', '/dashboard/summary', 'GET', null, token);
  await apiTest('Dashboard: Trends', '/dashboard/trends', 'GET', null, token);

  // 4. USER APIs (Admin only)
  await apiTest('User: List All', '/users', 'GET', null, token);
  await apiTest('User: Update Role', `/users/${userId}/role`, 'PATCH', { role: 'ANALYST' }, token);
  // Re-login to get updated role token if needed, but let's just test the API
  await apiTest('User: Update Status', `/users/${userId}/status`, 'PATCH', { status: 'ACTIVE' }, token);

  // 5. DELETE RECORD
  await apiTest('Record: Delete', `/records/${recordId}`, 'DELETE', null, token);
  await apiTest('Record: Verify Delete', `/records/${recordId}`, 'GET', null, token); // Should be 404

  console.log('\n--- FINAL TEST SUMMARY ---');
  const passed = testResults.filter(r => r.success).length;
  console.log(`Passed: ${passed}/${testResults.length}`);
}

runTest();
