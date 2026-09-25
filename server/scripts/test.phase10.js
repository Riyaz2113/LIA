const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');
const { generateToken } = require('../src/utils/jwt');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Cookie'] = `lia_token=${token}`;
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, data };
};

const results = [];

const test = async (name, fn) => {
  try {
    const passed = await fn();
    if (passed) {
      console.log(`✅ [PASS] ${name}`);
      results.push({ name, status: 'PASS' });
    } else {
      console.error(`❌ [FAIL] ${name}`);
      results.push({ name, status: 'FAIL' });
    }
  } catch (err) {
    console.error(`💥 [ERROR] ${name}:`, err.message);
    results.push({ name, status: 'ERROR', error: err.message });
  }
};

const runSuite = async () => {
  console.log('====================================================');
  console.log('🔬 PHASE 10: AUTOMATED REST API & RBAC TEST SUITE');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lia');

  const adminUser = await User.findOne({ role: 'ADMIN', isActive: true });
  const facultyUser = await User.findOne({ role: 'FACULTY', isActive: true });
  const studentUser = await User.findOne({ role: 'STUDENT', isActive: true });

  if (!adminUser || !facultyUser || !studentUser) {
    console.error('⚠️ Could not find seeded test users in MongoDB. Run node scripts/seedDatabase.js first.');
    process.exit(1);
  }

  const adminToken = generateToken(adminUser._id.toString(), 'ADMIN');
  const facultyToken = generateToken(facultyUser._id.toString(), 'FACULTY');
  const studentToken = generateToken(studentUser._id.toString(), 'STUDENT');

  // 1. Unauthenticated Request Protection
  await test('Unauthenticated access to protected /api/students is rejected (401)', async () => {
    const res = await request('/students');
    return res.status === 401 && res.data.success === false;
  });

  await test('Unauthenticated access to /api/dashboard/admin is rejected (401)', async () => {
    const res = await request('/dashboard/admin');
    return res.status === 401 && res.data.success === false;
  });

  // 2. RBAC Role Restrictions
  await test('Student role is forbidden from Admin endpoint /api/users (403)', async () => {
    const res = await request('/users', {}, studentToken);
    return res.status === 403 && res.data.success === false;
  });

  await test('Faculty role is forbidden from Admin endpoint /api/users (403)', async () => {
    const res = await request('/users', {}, facultyToken);
    return res.status === 403 && res.data.success === false;
  });

  await test('Student cannot create official notices (403)', async () => {
    const res = await request('/notices', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Illegal Student Notice',
        category: 'GENERAL'
      })
    }, studentToken);
    return res.status === 403 && res.data.success === false;
  });

  // 3. Admin Authorization & CRUD
  await test('Admin can query live metrics from /api/dashboard/admin (200)', async () => {
    const res = await request('/dashboard/admin', {}, adminToken);
    return res.status === 200 && res.data.success === true && typeof res.data.data === 'object';
  });

  await test('Admin can list departments from /api/departments (200)', async () => {
    const res = await request('/departments', {}, adminToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  await test('Admin can list subjects from /api/subjects (200)', async () => {
    const res = await request('/subjects', {}, adminToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  await test('Admin can list placement drives from /api/placements/drives (200)', async () => {
    const res = await request('/placements/drives', {}, adminToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  await test('Admin can list library books from /api/library (200)', async () => {
    const res = await request('/library', {}, adminToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  // 4. Student & Faculty Scoped Data Access
  await test('Student can list published notices from /api/notices (200)', async () => {
    const res = await request('/notices', {}, studentToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  await test('Faculty can list upcoming events from /api/events (200)', async () => {
    const res = await request('/events', {}, facultyToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  await test('Student can query study materials from /api/materials (200)', async () => {
    const res = await request('/materials', {}, studentToken);
    return res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
  });

  // 5. Standard Response Format Verification
  await test('API responses adhere strictly to standard format { success, data }', async () => {
    const res = await request('/notices', {}, adminToken);
    return res.data && res.data.hasOwnProperty('success') && res.data.hasOwnProperty('data');
  });

  console.log('\n----------------------------------------------------');
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  console.log(`TEST SUMMARY: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('----------------------------------------------------');

  await mongoose.disconnect();

  if (passed === total) {
    console.log('🎉 ALL PHASE 10 BACKEND INTEGRATION TESTS PASSED!');
    process.exit(0);
  } else {
    process.exit(1);
  }
};

runSuite();
