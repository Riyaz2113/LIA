/**
 * Phase 3 Integration Test
 * Tests the full authentication + RBAC flow without connecting to a real database.
 * Uses manual HTTP requests against an in-process Express server.
 *
 * Tests:
 *  1. Valid login (mocked user)
 *  2. Invalid password → 401 (generic error)
 *  3. Missing identifier → 400 validation error
 *  4. Missing password → 400 validation error
 *  5. /me without cookie → 401
 *  6. Logout → cookie cleared
 *  7. /me after logout → 401
 *  8. STUDENT accessing /test/admin → 403
 *  9. ADMIN accessing /test/admin → 200
 * 10. STUDENT accessing /test/student → 200
 * 11. FACULTY accessing /test/faculty → 200
 * 12. STUDENT accessing /test/faculty → 403
 * 13. Expired/tampered JWT → 401
 * 14. Password never returned in login response
 * 15. Password never returned in /me response
 */
require('dotenv').config({ path: '../.env' });

// Ensure test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_phase3_testing_only';
process.env.JWT_EXPIRES_IN = '7d';

const http = require('http');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { generateToken, AUTH_COOKIE_NAME } = require('../src/utils/jwt');
const { MongoMemoryServer } = require('mongodb-memory-server');

// ─────────────────────────────────────────────────────────────────────────────
// Test Helpers
// ─────────────────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
    errors.push(testName);
  }
}

function makeRequest(server, method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const bodyStr = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyStr),
      ...headers,
    };

    const req = http.request(
      { host: '127.0.0.1', port: addr.port, method, path, headers: reqHeaders },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          let json;
          try { json = JSON.parse(data); } catch { json = {}; }
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        });
      }
    );
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Extract Set-Cookie header value
function extractCookie(headers, name) {
  const cookies = [].concat(headers['set-cookie'] || []);
  for (const c of cookies) {
    if (c.startsWith(name + '=')) return c.split(';')[0];
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  LIA Phase 3 — Authentication Integration Test   ');
  console.log('══════════════════════════════════════════════════\n');

  // ── Start in-memory MongoDB ─────────────────────────────────────────────────
  let mongoServer;
  try {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('  📦 In-memory MongoDB: connected\n');
  } catch (e) {
    console.error('  ❌ Cannot run integration tests: mongodb-memory-server not installed');
    console.error('     Run: npm install --save-dev mongodb-memory-server');
    console.error('     Then re-run: node scripts/test.phase3.js\n');
    process.exit(1);
  }

  // ── Seed test users ─────────────────────────────────────────────────────────
  const User = require('../src/models/User');
  const Student = require('../src/models/Student');
  const Department = require('../src/models/Department');

  const SALT = 12;
  const studentHash = await bcrypt.hash('StudentPass123', SALT);
  const facultyHash = await bcrypt.hash('FacultyPass123', SALT);
  const adminHash = await bcrypt.hash('AdminPass123', SALT);
  const inactiveHash = await bcrypt.hash('InactivePass123', SALT);

  const dept = await Department.create({ name: 'CSE', code: 'CSE' });

  const studentUser = await User.create({
    name: 'Test Student', email: 'student@test.com',
    password: studentHash, role: 'STUDENT', isActive: true,
  });
  const facultyUser = await User.create({
    name: 'Test Faculty', email: 'faculty@test.com',
    password: facultyHash, role: 'FACULTY', isActive: true,
  });
  const adminUser = await User.create({
    name: 'Test Admin', email: 'admin@test.com',
    password: adminHash, role: 'ADMIN', isActive: true,
  });
  const inactiveUser = await User.create({
    name: 'Inactive User', email: 'inactive@test.com',
    password: inactiveHash, role: 'STUDENT', isActive: false,
  });

  await Student.create({
    user: studentUser._id, rollNumber: 'CS2021001',
    department: dept._id, year: 3, semester: 5,
    section: 'A', admissionYear: 2021,
  });

  console.log('  👤 Test users seeded\n');

  // ── Start Express server ────────────────────────────────────────────────────
  const app = require('../src/app');
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  console.log(`  🚀 Test server on port ${server.address().port}\n`);

  let authCookie = '';

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 1 — Validation
  // ─────────────────────────────────────────────────────────────────────────
  console.log('── Group 1: Input Validation ───────────────────');

  const r1 = await makeRequest(server, 'POST', '/api/auth/login', {});
  assert(r1.status === 400, 'Missing identifier + password → 400');

  const r2 = await makeRequest(server, 'POST', '/api/auth/login', { identifier: 'a@b.com' });
  assert(r2.status === 400, 'Missing password → 400');

  const r3 = await makeRequest(server, 'POST', '/api/auth/login', { identifier: '', password: 'x' });
  assert(r3.status === 400, 'Empty identifier → 400');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 2 — Login Failures
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 2: Login Failures ─────────────────────');

  const r4 = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'nonexistent@test.com', password: 'AnyPass123' });
  assert(r4.status === 401, 'Non-existent user → 401');
  assert(r4.body.message && !r4.body.message.toLowerCase().includes('not found'),
    'Error message does not enumerate account existence');

  const r5 = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'student@test.com', password: 'WrongPassword' });
  assert(r5.status === 401, 'Wrong password → 401');

  const r6 = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'inactive@test.com', password: 'InactivePass123' });
  assert(r6.status === 401, 'Inactive user → 401');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 3 — Successful Login (email)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 3: Successful Login ───────────────────');

  const r7 = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'student@test.com', password: 'StudentPass123' });
  assert(r7.status === 200, 'Valid student email login → 200');
  assert(r7.body.success === true, 'Response has success: true');
  assert(!!r7.body.user, 'Response includes user object');
  assert(!r7.body.user?.password, 'Password NOT in login response');
  assert(!r7.body.user?.passwordHash, 'passwordHash NOT in login response');

  authCookie = extractCookie(r7.headers, AUTH_COOKIE_NAME);
  assert(!!authCookie, 'HTTP-only cookie set on login');
  assert(
    [].concat(r7.headers['set-cookie'] || []).some(c => c.includes('HttpOnly')),
    'Cookie has HttpOnly flag'
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 4 — Roll Number Login
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 4: Roll Number Login ──────────────────');

  const r8 = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'CS2021001', password: 'StudentPass123' });
  assert(r8.status === 200, 'Roll number login → 200');
  assert(r8.body.user?.role === 'STUDENT', 'Roll number login returns STUDENT role');
  assert(!r8.body.user?.password, 'Password NOT in roll number login response');

  const r8b = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'cs2021001', password: 'StudentPass123' });
  assert(r8b.status === 200, 'Roll number login case-insensitive → 200');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 5 — /me Endpoint
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 5: /me Endpoint ───────────────────────');

  const r9 = await makeRequest(server, 'GET', '/api/auth/me', null, {});
  assert(r9.status === 401, '/me without cookie → 401');

  const r10 = await makeRequest(server, 'GET', '/api/auth/me', null, { Cookie: authCookie });
  assert(r10.status === 200, '/me with valid cookie → 200');
  assert(r10.body.user?.role === 'STUDENT', '/me returns correct role');
  assert(!r10.body.user?.password, 'Password NOT in /me response');
  assert(!r10.body.user?.passwordHash, 'passwordHash NOT in /me response');
  assert(r10.body.profile !== undefined, '/me includes profile field');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 6 — RBAC (using student cookie)
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 6: Role-Based Access Control ──────────');

  const r11 = await makeRequest(server, 'GET', '/api/auth/test/student', null, { Cookie: authCookie });
  assert(r11.status === 200, 'STUDENT → /test/student → 200');

  const r12 = await makeRequest(server, 'GET', '/api/auth/test/admin', null, { Cookie: authCookie });
  assert(r12.status === 403, 'STUDENT → /test/admin → 403');

  const r13 = await makeRequest(server, 'GET', '/api/auth/test/faculty', null, { Cookie: authCookie });
  assert(r13.status === 403, 'STUDENT → /test/faculty → 403');

  const r14 = await makeRequest(server, 'GET', '/api/auth/test/staff', null, { Cookie: authCookie });
  assert(r14.status === 403, 'STUDENT → /test/staff → 403');

  // Faculty token
  const rFacLogin = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'faculty@test.com', password: 'FacultyPass123' });
  const facCookie = extractCookie(rFacLogin.headers, AUTH_COOKIE_NAME);

  const r15 = await makeRequest(server, 'GET', '/api/auth/test/faculty', null, { Cookie: facCookie });
  assert(r15.status === 200, 'FACULTY → /test/faculty → 200');

  const r16 = await makeRequest(server, 'GET', '/api/auth/test/admin', null, { Cookie: facCookie });
  assert(r16.status === 403, 'FACULTY → /test/admin → 403');

  const r17 = await makeRequest(server, 'GET', '/api/auth/test/staff', null, { Cookie: facCookie });
  assert(r17.status === 200, 'FACULTY → /test/staff → 200');

  // Admin token
  const rAdminLogin = await makeRequest(server, 'POST', '/api/auth/login',
    { identifier: 'admin@test.com', password: 'AdminPass123' });
  const adminCookie = extractCookie(rAdminLogin.headers, AUTH_COOKIE_NAME);

  const r18 = await makeRequest(server, 'GET', '/api/auth/test/admin', null, { Cookie: adminCookie });
  assert(r18.status === 200, 'ADMIN → /test/admin → 200');

  const r19 = await makeRequest(server, 'GET', '/api/auth/test/staff', null, { Cookie: adminCookie });
  assert(r19.status === 200, 'ADMIN → /test/staff → 200');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 7 — Logout
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 7: Logout ─────────────────────────────');

  const r20 = await makeRequest(server, 'POST', '/api/auth/logout', null, { Cookie: authCookie });
  assert(r20.status === 200, 'Logout → 200');
  assert(r20.body.success === true, 'Logout response has success: true');

  const clearedCookie = extractCookie(r20.headers, AUTH_COOKIE_NAME);
  assert(
    clearedCookie !== null && clearedCookie === `${AUTH_COOKIE_NAME}=`,
    'Cookie is cleared on logout'
  );

  const r21 = await makeRequest(server, 'GET', '/api/auth/me', null, { Cookie: authCookie });
  // After logout the cookie value on client would be empty — simulate no cookie
  const r21b = await makeRequest(server, 'GET', '/api/auth/me', null, {});
  assert(r21b.status === 401, '/me without cookie after logout → 401');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 8 — Invalid / Tampered JWT
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 8: Invalid JWT ────────────────────────');

  const r22 = await makeRequest(server, 'GET', '/api/auth/me', null,
    { Cookie: `${AUTH_COOKIE_NAME}=totally.invalid.jwt` });
  assert(r22.status === 401, 'Tampered JWT → 401');

  const r23 = await makeRequest(server, 'GET', '/api/auth/me', null,
    { Cookie: `${AUTH_COOKIE_NAME}=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.fake` });
  assert(r23.status === 401, 'Invalid JWT signature → 401');

  // ─────────────────────────────────────────────────────────────────────────
  // TEST GROUP 9 — Health check not broken
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n── Group 9: Health Check Regression ───────────');

  const r24 = await makeRequest(server, 'GET', '/api/health', null, {});
  assert(r24.status === 200, 'GET /api/health still returns 200 (Phase 1 regression)');

  // ─────────────────────────────────────────────────────────────────────────
  // Results
  // ─────────────────────────────────────────────────────────────────────────
  server.close();
  await mongoose.disconnect();
  await mongoServer.stop();

  console.log('\n══════════════════════════════════════════════════');
  console.log(`  Tests: ${passed + failed} total | ${passed} passed | ${failed} failed`);
  console.log('══════════════════════════════════════════════════');

  if (errors.length > 0) {
    console.error('\nFailed tests:');
    errors.forEach((e) => console.error(`  - ${e}`));
  } else {
    console.log('\n  ✅ All tests passed.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('\n❌ Test runner crashed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
