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
    ...(options.headers || {}),
  };
  if (token) {
    headers['Cookie'] = `lia_token=${token}`;
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, data };
};

const runTests = async () => {
  console.log('====================================================');
  console.log('PHASE 11 — ADMIN CMS + COMPLETE CRUD TEST SUITE');
  console.log('Testing against active MongoDB Atlas Database');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assertTest = (name, condition, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminUser = await User.findOne({ role: 'ADMIN', isActive: true });
    const facultyUser = await User.findOne({ role: 'FACULTY', isActive: true });
    const studentUser = await User.findOne({ role: 'STUDENT', isActive: true });

    if (!adminUser || !facultyUser || !studentUser) {
      console.error('Could not find required users in MongoDB Atlas.');
      process.exit(1);
    }

    const adminToken = generateToken(adminUser._id.toString(), 'ADMIN');
    const facultyToken = generateToken(facultyUser._id.toString(), 'FACULTY');
    const studentToken = generateToken(studentUser._id.toString(), 'STUDENT');

    assertTest('0. Setup: Admin, Faculty, and Student Authentication against Atlas', Boolean(adminToken && facultyToken && studentToken));

    // ─── TEST 1: Admin Create Student ─────────────────────────────────────────
    const testRoll = `STU${Date.now()}`;
    const studentCreateRes = await request('/students', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Student CRUD',
        email: `test.${testRoll.toLowerCase()}@vignanlara.ac.in`,
        password: 'Student@123',
        rollNumber: testRoll,
        department: 'CSE',
        year: 2,
        semester: 1,
        section: 'B',
        phone: '9876543210',
      }),
    }, adminToken);
    assertTest('1. Admin can create student', studentCreateRes.status === 201 && studentCreateRes.data?.data?.rollNumber === testRoll);
    const createdStudentId = studentCreateRes.data?.data?._id;

    // ─── TEST 2: Admin Update Student ─────────────────────────────────────────
    let studentUpdateRes = null;
    if (createdStudentId) {
      studentUpdateRes = await request(`/students/${createdStudentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          section: 'C',
          phone: '9998887770',
        }),
      }, adminToken);
    }
    assertTest('2. Admin can update student', studentUpdateRes && studentUpdateRes.status === 200 && studentUpdateRes.data?.data?.section === 'C');

    // ─── TEST 3: Admin Deactivate/Delete Student ──────────────────────────────
    let studentDeleteRes = null;
    if (createdStudentId) {
      studentDeleteRes = await request(`/students/${createdStudentId}`, {
        method: 'DELETE',
      }, adminToken);
    }
    assertTest('3. Admin can safely delete/deactivate student', studentDeleteRes && studentDeleteRes.status === 200);

    // ─── TEST 4: Admin Create Faculty ─────────────────────────────────────────
    const testEmpId = `EMP${Date.now()}`;
    const facultyCreateRes = await request('/faculty', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Dr. Test Professor',
        email: `prof.${testEmpId.toLowerCase()}@vignanlara.ac.in`,
        employeeId: testEmpId,
        department: 'CSE',
        designation: 'Associate Professor',
        specialization: 'Cloud Computing & Networks',
      }),
    }, adminToken);
    assertTest('4. Admin can create faculty', facultyCreateRes.status === 201 && facultyCreateRes.data?.data?.employeeId === testEmpId);
    const createdFacultyId = facultyCreateRes.data?.data?._id;

    // ─── TEST 5: Admin Update Faculty ─────────────────────────────────────────
    let facultyUpdateRes = null;
    if (createdFacultyId) {
      facultyUpdateRes = await request(`/faculty/${createdFacultyId}`, {
        method: 'PUT',
        body: JSON.stringify({
          designation: 'Professor',
        }),
      }, adminToken);
    }
    assertTest('5. Admin can update faculty', facultyUpdateRes && facultyUpdateRes.status === 200 && facultyUpdateRes.data?.data?.designation === 'Professor');

    // ─── TEST 6: Admin Create Subject ─────────────────────────────────────────
    const testSubjCode = `CS${Date.now().toString().slice(-3)}`;
    const subjectCreateRes = await request('/subjects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Advanced Systems Programming',
        code: testSubjCode,
        department: 'CSE',
        semester: 4,
        year: 2,
        credits: 4,
        type: 'THEORY',
      }),
    }, adminToken);
    assertTest('6. Admin can create subject', subjectCreateRes.status === 201 && subjectCreateRes.data?.data?.code === testSubjCode);
    const createdSubjectId = subjectCreateRes.data?.data?._id;

    // ─── TEST 7: Admin Update Subject ─────────────────────────────────────────
    let subjectUpdateRes = null;
    if (createdSubjectId) {
      subjectUpdateRes = await request(`/subjects/${createdSubjectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          credits: 3,
        }),
      }, adminToken);
    }
    assertTest('7. Admin can update subject', subjectUpdateRes && subjectUpdateRes.status === 200 && subjectUpdateRes.data?.data?.credits === 3);

    // ─── TEST 8: Admin Create Timetable ───────────────────────────────────────
    const timetableCreateRes = await request('/timetable', {
      method: 'POST',
      body: JSON.stringify({
        subject: testSubjCode,
        dayOfWeek: 'THURSDAY',
        startTime: '11:00',
        endTime: '12:00',
        room: 'Room 305',
        department: 'CSE',
        semester: 4,
        section: 'A',
        academicYear: '2026-27',
      }),
    }, adminToken);
    assertTest('8. Admin can create timetable slot in Atlas', timetableCreateRes.status === 201 && timetableCreateRes.data?.data?.room === 'Room 305');
    const createdSlotId = timetableCreateRes.data?.data?._id;

    // ─── TEST 9: Admin Update Timetable ───────────────────────────────────────
    let timetableUpdateRes = null;
    if (createdSlotId) {
      timetableUpdateRes = await request(`/timetable/${createdSlotId}`, {
        method: 'PUT',
        body: JSON.stringify({
          room: 'Lab 4',
        }),
      }, adminToken);
    }
    assertTest('9. Admin can update timetable slot', timetableUpdateRes && timetableUpdateRes.status === 200 && timetableUpdateRes.data?.data?.room === 'Lab 4');

    // ─── TEST 10: Admin Delete Timetable ──────────────────────────────────────
    let timetableDeleteRes = null;
    if (createdSlotId) {
      timetableDeleteRes = await request(`/timetable/${createdSlotId}`, {
        method: 'DELETE',
      }, adminToken);
    }
    assertTest('10. Admin can delete timetable slot', timetableDeleteRes && timetableDeleteRes.status === 200);

    // ─── TEST 11: Admin Create Notice ─────────────────────────────────────────
    const noticeCreateRes = await request('/notices', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Important Campus circular test',
        description: 'Administrative notification details for all students.',
        category: 'ACADEMIC',
        priority: 'HIGH',
        isPublished: true,
      }),
    }, adminToken);
    assertTest('11. Admin can create notice', noticeCreateRes.status === 201 && noticeCreateRes.data?.data?.title === 'Important Campus circular test');
    const createdNoticeId = noticeCreateRes.data?.data?._id;

    // ─── TEST 12: Admin Update Notice ─────────────────────────────────────────
    let noticeUpdateRes = null;
    if (createdNoticeId) {
      noticeUpdateRes = await request(`/notices/${createdNoticeId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated Campus Circular Notice',
        }),
      }, adminToken);
    }
    assertTest('12. Admin can update notice', noticeUpdateRes && noticeUpdateRes.status === 200 && noticeUpdateRes.data?.data?.title === 'Updated Campus Circular Notice');

    // ─── TEST 13: Admin Create Event ──────────────────────────────────────────
    const eventCreateRes = await request('/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Annual Tech Hackathon 2026',
        description: 'Campus-wide software hackathon.',
        category: 'TECHNICAL',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        venue: 'Main Auditorium',
        status: 'UPCOMING',
      }),
    }, adminToken);
    assertTest('13. Admin can create event', eventCreateRes.status === 201 && eventCreateRes.data?.data?.title === 'Annual Tech Hackathon 2026');
    const createdEventId = eventCreateRes.data?.data?._id;

    // ─── TEST 14: Admin Update Event ──────────────────────────────────────────
    let eventUpdateRes = null;
    if (createdEventId) {
      eventUpdateRes = await request(`/events/${createdEventId}`, {
        method: 'PUT',
        body: JSON.stringify({
          venue: 'Seminar Hall 1',
        }),
      }, adminToken);
    }
    assertTest('14. Admin can update event', eventUpdateRes && eventUpdateRes.status === 200 && eventUpdateRes.data?.data?.venue === 'Seminar Hall 1');

    // ─── TEST 15: Admin Create Placement Drive ────────────────────────────────
    const driveCreateRes = await request('/placements/drives', {
      method: 'POST',
      body: JSON.stringify({
        company: 'Microsoft India',
        jobTitle: 'Software Development Engineer',
        description: 'Cloud Infrastructure & AI Engineering',
        eligibility: 'B.Tech CSE, AIML, ECE (70%+)',
        package: '24.0 LPA',
        status: 'UPCOMING',
      }),
    }, adminToken);
    assertTest('15. Admin can create placement drive', driveCreateRes.status === 201 && driveCreateRes.data?.data?.jobTitle === 'Software Development Engineer');
    const createdDriveId = driveCreateRes.data?.data?._id;

    // ─── TEST 16: Admin Update Placement Drive ────────────────────────────────
    let driveUpdateRes = null;
    if (createdDriveId) {
      driveUpdateRes = await request(`/placements/drives/${createdDriveId}`, {
        method: 'PUT',
        body: JSON.stringify({
          package: '26.0 LPA',
        }),
      }, adminToken);
    }
    assertTest('16. Admin can update placement drive', driveUpdateRes && driveUpdateRes.status === 200 && driveUpdateRes.data?.data?.package === '26.0 LPA');

    // ─── TEST 17: Admin Manage Library Record ─────────────────────────────────
    const bookCreateRes = await request('/library', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Distributed Systems & Cloud Architecture',
        author: 'Tanenbaum, Steen',
        category: 'Computer Science',
        isbn: '978-0132392273',
        total: 15,
        shelfLocation: 'Rack DS-01',
      }),
    }, adminToken);
    assertTest('17. Admin can manage library record (create book in Atlas)', bookCreateRes.status === 201 && bookCreateRes.data?.data?.title === 'Distributed Systems & Cloud Architecture');
    const createdBookId = bookCreateRes.data?.data?._id;

    // ─── TEST 18: Admin Manage Study Material ─────────────────────────────────
    const materialCreateRes = await request('/materials', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Unit 4 — Distributed Hash Tables & Raft',
        subject: testSubjCode,
        category: 'NOTES',
        fileUrl: 'https://cdn.vignanlara.edu.in/handouts/raft.pdf',
        fileType: 'PDF',
      }),
    }, adminToken);
    assertTest('18. Admin can manage study material (upload resource)', materialCreateRes.status === 201 && materialCreateRes.data?.data?.title === 'Unit 4 — Distributed Hash Tables & Raft');
    const createdMaterialId = materialCreateRes.data?.data?._id;

    // ─── TEST 19: Admin Manage Media ──────────────────────────────────────────
    const mediaCreateRes = await request('/media', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New VLITS Innovation Centre Lab',
        category: 'LAB',
        url: 'https://cdn.vignanlara.edu.in/gallery/lab.jpg',
        isPublished: true,
      }),
    }, adminToken);
    assertTest('19. Admin can manage media (add gallery asset)', mediaCreateRes.status === 201 && mediaCreateRes.data?.data?.title === 'New VLITS Innovation Centre Lab');
    const createdMediaId = mediaCreateRes.data?.data?._id;

    // ─── TEST 20: Admin Broadcast Notification ────────────────────────────────
    const notifCreateRes = await request('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Institutional Advisory',
        message: 'Classes will proceed as per the schedule on Thursday.',
        audience: 'ALL',
        type: 'INFO',
      }),
    }, adminToken);
    assertTest('20. Admin can broadcast notification', notifCreateRes.status === 201 && notifCreateRes.data?.data?.count > 0);

    // ─── TEST 21: Student Cannot Perform Admin Mutations (RBAC 403) ───────────
    const studentForbiddenRes = await request('/students', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Hacked Student',
        email: 'hacked@student.com',
        rollNumber: '99HACK99',
        department: 'CSE',
      }),
    }, studentToken);
    assertTest('21. Student cannot perform Admin mutations (403 Forbidden)', studentForbiddenRes.status === 403);

    // ─── TEST 22: Faculty Cannot Perform Admin-Only Mutations (RBAC 403) ───────
    const facultyForbiddenRes = await request('/departments', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Unauthorized Dept',
        code: 'UNAUTH',
      }),
    }, facultyToken);
    assertTest('22. Faculty cannot perform Admin-only mutations (403 Forbidden)', facultyForbiddenRes.status === 403);

    // ─── TEST 23: Invalid Data Is Rejected (400 Bad Request) ──────────────────
    const invalidRes = await request('/subjects', {
      method: 'POST',
      body: JSON.stringify({
        semester: 2,
      }),
    }, adminToken);
    assertTest('23. Invalid data is rejected (400 Bad Request)', invalidRes.status === 400);

    // ─── TEST 24: Duplicate Records Are Handled (409 Conflict) ────────────────
    const duplicateRes = await request('/subjects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate Code Subject',
        code: testSubjCode,
        department: 'CSE',
        semester: 1,
        credits: 3,
      }),
    }, adminToken);
    assertTest('24. Duplicate records are rejected (409 Conflict)', duplicateRes.status === 409);

    // ─── TEST 25: Audit Logging Records Admin Mutations ───────────────────────
    const auditRes = await request('/audit-logs', {}, adminToken);
    const hasAuditEntries = auditRes.status === 200 && Array.isArray(auditRes.data?.data) && auditRes.data.data.length > 0;
    assertTest('25. Audit logging captures administrative mutations', hasAuditEntries);

    // ─── CLEANUP (Safe removal of created test artifacts) ─────────────────────
    if (createdNoticeId) await request(`/notices/${createdNoticeId}`, { method: 'DELETE' }, adminToken);
    if (createdEventId) await request(`/events/${createdEventId}`, { method: 'DELETE' }, adminToken);
    if (createdDriveId) await request(`/placements/drives/${createdDriveId}`, { method: 'DELETE' }, adminToken);
    if (createdBookId) await request(`/library/${createdBookId}`, { method: 'DELETE' }, adminToken);
    if (createdMaterialId) await request(`/materials/${createdMaterialId}`, { method: 'DELETE' }, adminToken);
    if (createdMediaId) await request(`/media/${createdMediaId}`, { method: 'DELETE' }, adminToken);
    if (createdSubjectId) await request(`/subjects/${createdSubjectId}`, { method: 'DELETE' }, adminToken);
    if (createdFacultyId) await request(`/faculty/${createdFacultyId}`, { method: 'DELETE' }, adminToken);

    await mongoose.disconnect();

    console.log('\n====================================================');
    console.log(`PHASE 11 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTests();
