require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Student = require('../src/models/Student');
const Faculty = require('../src/models/Faculty');
const ChatConversation = require('../src/models/ChatConversation');
const ChatMessage = require('../src/models/ChatMessage');

const BASE_URL = 'http://localhost:5000/api';

const results = {
  login: false,
  me: false,
  httpOnlyCookie: false,
  studentChat: false,
  facultyChat: false,
  adminChat: false,
  ragResponse: false,
  mongoDbPersistence: false,
};

const runVerification = async () => {
  console.log('====================================================');
  console.log('🧪 VERIFYING CHAT AUTHENTICATION & SESSION PROPAGATION');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGODB_URI);

  // Ensure accounts are active
  await User.updateMany(
    { email: { $in: ['rahulkumar21bcs101@vignan.ac.in', 'admin@vlits.edu.in', 'vrao@vignanlara.ac.in', 'rmehta@vignanlara.ac.in'] } },
    { isActive: true }
  );

  // Helper to test login flow & extract cookie
  const loginAndGetCookie = async (identifier, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const setCookie = res.headers.get('set-cookie');
    const data = await res.json();
    return { status: res.status, data, setCookie };
  };

  // ── 1. Student Login Test ───────────────────────────────────────────────────
  console.log('1. Testing Student Login & Cookie Generation...');
  const studentLogin = await loginAndGetCookie('21BCS101', 'Student@123');
  console.log('  Login status:', studentLogin.status);
  console.log('  User role:', studentLogin.data?.user?.role);
  console.log('  Set-Cookie header received:', Boolean(studentLogin.setCookie));

  if (studentLogin.status === 200 && studentLogin.data?.success && studentLogin.setCookie) {
    results.login = true;
    results.httpOnlyCookie = studentLogin.setCookie.includes('HttpOnly') && studentLogin.setCookie.includes('lia_token=');
  }

  // Extract cookie string for subsequent requests
  const extractCookie = (setCookieHeader) => {
    if (!setCookieHeader) return '';
    return setCookieHeader.split(';')[0];
  };

  const studentCookie = extractCookie(studentLogin.setCookie);

  // ── 2. Test /api/auth/me ───────────────────────────────────────────────────
  console.log('\n2. Testing /api/auth/me with Cookie...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Cookie: studentCookie },
  });
  const meData = await meRes.json();
  console.log('  /me status:', meRes.status);
  console.log('  /me user name:', meData.user?.name);
  console.log('  /me profile rollNumber:', meData.profile?.rollNumber);

  if (meRes.status === 200 && meData.user?.role === 'STUDENT' && meData.profile?.rollNumber === '21BCS101') {
    results.me = true;
  }

  // ── 3. Test Student Chat Creation & Message with RAG ─────────────────────────
  console.log('\n3. Testing Student Chat RAG Request (/api/chat/conversations)...');
  const chatPrompt = 'Tell me about Academic Information, timings and syllabus.';
  const convoRes = await fetch(`${BASE_URL}/chat/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      title: 'Student Academic Inquiry',
      initialMessage: chatPrompt,
    }),
  });

  const convoData = await convoRes.json();
  console.log('  Chat conversation creation status:', convoRes.status);
  const conversation = convoData.data?.conversation;
  const messages = convoData.data?.messages || [];
  const assistantMsg = messages.find((m) => m.senderType === 'ASSISTANT');

  console.log('  Assistant response text length:', assistantMsg?.message?.length || 0);
  console.log('  Assistant response excerpt:', assistantMsg?.message ? assistantMsg.message.slice(0, 120) + '...' : 'NONE');

  if (convoRes.status === 201 && conversation?._id && assistantMsg?.message && !assistantMsg.message.includes('Authentication required')) {
    results.studentChat = true;
    results.ragResponse = true;

    // Verify MongoDB persistence
    const persistedMsg = await ChatMessage.findOne({ conversation: conversation._id, senderType: 'ASSISTANT' });
    if (persistedMsg) {
      results.mongoDbPersistence = true;
      console.log('  ✅ ChatMessage verified in MongoDB Atlas (ID:', persistedMsg._id, ')');
    }
  }

  // ── 4. Test Faculty Chat Flow ──────────────────────────────────────────────
  console.log('\n4. Testing Faculty Login & Chat...');
  const facultyLogin = await loginAndGetCookie('vrao@vignanlara.ac.in', 'Faculty@123');
  const facultyCookie = extractCookie(facultyLogin.setCookie);

  if (facultyLogin.status === 200) {
    const facultyConvo = await fetch(`${BASE_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: facultyCookie,
      },
      body: JSON.stringify({
        title: 'Faculty Inquiry',
        initialMessage: 'What are the examination guidelines and evaluation policies?',
      }),
    });
    const facData = await facultyConvo.json();
    if (facultyConvo.status === 201 && facData.data?.conversation?._id) {
      results.facultyChat = true;
      console.log('  ✅ Faculty chat successful');
    }
  }

  // ── 5. Test Admin Chat Flow ────────────────────────────────────────────────
  console.log('\n5. Testing Admin Login & Chat...');
  const adminLogin = await loginAndGetCookie('admin@vlits.edu.in', 'Admin@123');
  const adminCookie = extractCookie(adminLogin.setCookie);

  if (adminLogin.status === 200) {
    const adminConvo = await fetch(`${BASE_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        title: 'Admin Session',
        initialMessage: 'Summarize institutional rules for condonation fees.',
      }),
    });
    const admData = await adminConvo.json();
    if (adminConvo.status === 201 && admData.data?.conversation?._id) {
      results.adminChat = true;
      console.log('  ✅ Admin chat successful');
    }
  }

  console.log('\n====================================================');
  console.log('VERIFICATION SUMMARY:');
  console.log(JSON.stringify(results, null, 2));
  console.log('====================================================');

  const allPassed = Object.values(results).every(Boolean);
  if (allPassed) {
    console.log('\n🎉 ALL AUTHENTICATION & CHAT FLOWS PASSED!');
    process.exit(0);
  } else {
    console.error('\n❌ Some authentication checks failed.');
    process.exit(1);
  }
};

runVerification().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
