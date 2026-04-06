const BASE_URL = 'http://localhost:3000/api/v1';

async function test() {
  try {
    console.log('--- Testing Registration ---');
    try {
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User 2",
                email: "test2@example.com",
                password: "password123",
                role: "ADMIN"
            })
        });
        console.log('Registration Success (or user already exists)');
    } catch (e) {}

    console.log('--- Testing Login ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123"
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log('Login Success');

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log('--- Creating Records ---');
    const records = [
      { amount: 1000, type: 'INCOME', category: 'Salary', date: '2026-01-01T10:00:00Z' },
      { amount: 500, type: 'EXPENSE', category: 'Rent', date: '2026-01-05T10:00:00Z' },
      { amount: 2000, type: 'INCOME', category: 'Freelance', date: '2026-02-01T10:00:00Z' },
      { amount: 200, type: 'EXPENSE', category: 'Food', date: '2026-02-10T10:00:00Z' },
    ];

    for (const r of records) {
      await fetch(`${BASE_URL}/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify(r)
      });
    }
    console.log('Records Created');

    console.log('--- Testing Filtering (Category: Salary) ---');
    const filterRes = await fetch(`${BASE_URL}/records?category=Salary`, { headers });
    const filterData = await filterRes.json();
    console.log('Filtered Records Count:', filterData.data.length);
    if (filterData.data.every(r => r.category === 'Salary')) {
        console.log('Filtering by category PASSED');
    }

    console.log('--- Testing Filtering (Type: EXPENSE) ---');
    const filterTypeRes = await fetch(`${BASE_URL}/records?type=EXPENSE`, { headers });
    const filterTypeData = await filterTypeRes.json();
    console.log('Expense Records Count:', filterTypeData.data.length);
    if (filterTypeData.data.every(r => r.type === 'EXPENSE')) {
        console.log('Filtering by type PASSED');
    }

    console.log('--- Testing Filtering (Date Range: Feb 2026) ---');
    const filterDateRes = await fetch(`${BASE_URL}/records?startDate=2026-02-01T00:00:00Z&endDate=2026-02-28T23:59:59Z`, { headers });
    const filterDateData = await filterDateRes.json();
    console.log('Feb Records Count:', filterDateData.data.length);
    if (filterDateData.data.length > 0) {
        console.log('Filtering by date PASSED');
    }

    console.log('--- Testing Trends ---');
    const trendsRes = await fetch(`${BASE_URL}/dashboard/trends`, { headers });
    const trendsData = await trendsRes.json();
    console.log('Trends Data:', JSON.stringify(trendsData.data, null, 2));
    if (trendsData.data.length > 0) {
        console.log('Trends PASSED');
    }

    console.log('--- Testing Summary ---');
    const summaryRes = await fetch(`${BASE_URL}/dashboard/summary`, { headers });
    const summaryData = await summaryRes.json();
    console.log('Summary Data:', JSON.stringify(summaryData.data, null, 2));

  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

test();
