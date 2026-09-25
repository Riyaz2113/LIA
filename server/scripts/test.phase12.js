/**
 * test.phase12.js
 * Comprehensive automated verification test suite for Phase 12:
 * LIA Backend + Multi-Turn Chat Persistence against active MongoDB Atlas database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const ChatConversation = require('../src/models/ChatConversation');
const ChatMessage = require('../src/models/ChatMessage');
const { generateToken } = require('../src/utils/jwt');

const BASE_URL = 'http://localhost:5000/api';

let passed = 0;
let failed = 0;

const assertTest = (description, condition) => {
  if (condition) {
    console.log(`✅ [PASS] ${description}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${description}`);
    failed++;
  }
};

const request = async (endpoint, options = {}, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Cookie'] = `lia_token=${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data };
  } catch (err) {
    return { status: 500, error: err.message };
  }
};

const runTests = async () => {
  console.log('\n====================================================');
  console.log('PHASE 12 — LIA BACKEND + MULTI-TURN CHAT TEST SUITE');
  console.log('Testing against active MongoDB Atlas Database');
  console.log('====================================================\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Fetch test users for auth tokens
    const studentUser = await User.findOne({ role: 'STUDENT', isActive: true });
    const facultyUser = await User.findOne({ role: 'FACULTY', isActive: true });
    const adminUser = await User.findOne({ role: 'ADMIN', isActive: true });

    if (!studentUser || !facultyUser || !adminUser) {
      console.error('Missing seed users in Atlas. Please ensure database is seeded.');
      process.exit(1);
    }

    const studentToken = generateToken(studentUser._id.toString(), 'STUDENT');
    const facultyToken = generateToken(facultyUser._id.toString(), 'FACULTY');
    const adminToken = generateToken(adminUser._id.toString(), 'ADMIN');

    assertTest('0. Setup: Authenticated tokens generated against Atlas accounts', Boolean(studentToken && facultyToken && adminToken));

    // ─── TEST 1: Unauthenticated Chat Rejected ────────────────────────────────
    const unauthRes = await request('/chat/conversations');
    assertTest('1. Unauthenticated chat access is rejected (401 Unauthorized)', unauthRes.status === 401);

    // ─── TEST 2: Create Conversation ──────────────────────────────────────────
    const createConvoRes = await request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Academic Inquiries Session',
        initialMessage: 'What are the library timings and facilities at Vignan Lara?',
      }),
    }, studentToken);

    assertTest(
      '2. Authenticated user can create conversation in Atlas',
      createConvoRes.status === 201 && Boolean(createConvoRes.data?.data?.conversation?._id)
    );

    const convoId = createConvoRes.data?.data?.conversation?._id;
    const initialMessages = createConvoRes.data?.data?.messages || [];

    // ─── TEST 3: User Message Persisted in Atlas ──────────────────────────────
    assertTest(
      '3. Initial user message persisted in Atlas',
      initialMessages.length >= 2 && initialMessages[0].senderType === 'USER'
    );

    // ─── TEST 4: Assistant Message Persisted in Atlas ──────────────────────────
    assertTest(
      '4. Initial assistant message persisted in Atlas',
      initialMessages.length >= 2 && initialMessages[1].senderType === 'ASSISTANT' && initialMessages[1].message.length > 0
    );

    // ─── TEST 5: List Own Conversations ───────────────────────────────────────
    const listConvoRes = await request('/chat/conversations', {}, studentToken);
    assertTest(
      '5. Authenticated user can list their own conversations',
      listConvoRes.status === 200 && Array.isArray(listConvoRes.data?.data) && listConvoRes.data.data.some((c) => c._id === convoId)
    );

    // ─── TEST 6: Retrieve Own Conversation Details ────────────────────────────
    const getConvoRes = await request(`/chat/conversations/${convoId}`, {}, studentToken);
    assertTest(
      '6. Authenticated user can retrieve own conversation with messages',
      getConvoRes.status === 200 && getConvoRes.data?.data?.conversation?._id === convoId && Array.isArray(getConvoRes.data?.data?.messages)
    );

    // ─── TEST 7: Multi-Turn Conversation Message ──────────────────────────────
    const sendMsgRes = await request(`/chat/conversations/${convoId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: 'How many books can I borrow at a time?',
      }),
    }, studentToken);

    assertTest(
      '7. User can send follow-up message in conversation thread',
      sendMsgRes.status === 201 && sendMsgRes.data?.data?.userMessage?.senderType === 'USER'
    );

    // ─── TEST 8: Assistant Multi-Turn Response ────────────────────────────────
    assertTest(
      '8. Assistant responds to multi-turn message and updates conversation',
      sendMsgRes.status === 201 && sendMsgRes.data?.data?.assistantMessage?.senderType === 'ASSISTANT' && sendMsgRes.data?.data?.assistantMessage?.message.length > 0
    );

    // ─── TEST 9: User Isolation (User B cannot access User A's conversation) ──
    const unauthorizedAccessRes = await request(`/chat/conversations/${convoId}`, {}, facultyToken);
    assertTest(
      '9. User isolation: Another user cannot access private conversation (403 Forbidden)',
      unauthorizedAccessRes.status === 403
    );

    // ─── TEST 10: User Isolation (User B cannot post to User A's conversation) ─
    const unauthorizedPostRes = await request(`/chat/conversations/${convoId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: 'Unauthorized injection message',
      }),
    }, facultyToken);
    assertTest(
      '10. User isolation: Another user cannot post to private conversation (403 Forbidden)',
      unauthorizedPostRes.status === 403
    );

    // ─── TEST 11: User Isolation (User B cannot delete User A's conversation) ─
    const unauthorizedDeleteRes = await request(`/chat/conversations/${convoId}`, {
      method: 'DELETE',
    }, facultyToken);
    assertTest(
      '11. User isolation: Another user cannot delete private conversation (403 Forbidden)',
      unauthorizedDeleteRes.status === 403
    );

    // ─── TEST 12: Empty Message Rejected (400 Bad Request) ────────────────────
    const emptyMsgRes = await request(`/chat/conversations/${convoId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: '   ',
      }),
    }, studentToken);
    assertTest(
      '12. Empty message content is rejected (400 Bad Request)',
      emptyMsgRes.status === 400
    );

    // ─── TEST 13: Oversized Message Rejected (400 Bad Request) ────────────────
    const oversizedMsgRes = await request(`/chat/conversations/${convoId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: 'A'.repeat(5000),
      }),
    }, studentToken);
    assertTest(
      '13. Oversized message (>4000 chars) is rejected (400 Bad Request)',
      oversizedMsgRes.status === 400
    );

    // ─── TEST 14: Standard API Envelope Adherence ─────────────────────────────
    assertTest(
      '14. API response strictly adheres to { success: true, data: ... } format',
      getConvoRes.data?.success === true && Boolean(getConvoRes.data?.data)
    );

    // ─── TEST 15: Delete Conversation & Associated Messages in Atlas ──────────
    const deleteConvoRes = await request(`/chat/conversations/${convoId}`, {
      method: 'DELETE',
    }, studentToken);

    const remainingMessages = await ChatMessage.countDocuments({ conversation: convoId });
    const remainingConvo = await ChatConversation.findById(convoId);

    assertTest(
      '15. Authenticated owner can safely delete conversation & its messages in Atlas',
      deleteConvoRes.status === 200 && remainingMessages === 0 && remainingConvo === null
    );

    await mongoose.disconnect();

    console.log('\n====================================================');
    console.log(`PHASE 12 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Phase 12 test execution error:', err);
    process.exit(1);
  }
};

runTests();
