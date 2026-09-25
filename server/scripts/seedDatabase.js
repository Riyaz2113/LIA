require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Faculty = require('../src/models/Faculty');
const Student = require('../src/models/Student');
const Subject = require('../src/models/Subject');
const ClassSection = require('../src/models/ClassSection');
const Timetable = require('../src/models/Timetable');
const Notice = require('../src/models/Notice');
const Event = require('../src/models/Event');
const Company = require('../src/models/Company');
const PlacementDrive = require('../src/models/PlacementDrive');
const StudyMaterial = require('../src/models/StudyMaterial');
const Media = require('../src/models/Media');
const Notification = require('../src/models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set in environment variables.');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // ── 1. Create Admin User ──────────────────────────────────────────────────
    let admin = await User.findOne({ email: 'admin@vlits.edu.in' });
    const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
    if (!admin) {
      admin = await User.create({
        name: 'LIA Administrator',
        email: 'admin@vlits.edu.in',
        password: adminPasswordHash,
        role: 'ADMIN',
        phone: '+91 863 2381200',
        isActive: true,
      });
      console.log('👑 Admin user created (admin@vlits.edu.in / Admin@123)');
    } else {
      admin.password = adminPasswordHash;
      await admin.save();
    }

    // ── 2. Create Departments ────────────────────────────────────────────────
    const departmentsData = [
      { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science & Engineering' },
      { name: 'Artificial Intelligence & Machine Learning', code: 'AIML', description: 'Department of AI & Machine Learning' },
      { name: 'Electronics & Communication Engineering', code: 'ECE', description: 'Department of Electronics & Communication' },
      { name: 'Electrical & Electronics Engineering', code: 'EEE', description: 'Department of Electrical & Electronics' },
      { name: 'Mechanical Engineering', code: 'ME', description: 'Department of Mechanical Engineering' },
      { name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' },
      { name: 'Management Studies', code: 'MBA', description: 'Department of Management Studies' },
    ];

    const depts = {};
    for (const d of departmentsData) {
      let dept = await Department.findOne({ code: d.code });
      if (!dept) {
        dept = await Department.create(d);
      }
      depts[d.code] = dept;
    }
    console.log('🏛️ Departments seeded.');

    // ── 3. Create Faculty Users & Profiles ────────────────────────────────────
    const facultyData = [
      { name: 'Dr. R. Mehta', email: 'rmehta@vignanlara.ac.in', empId: 'VLIT/CSE/1046', dept: 'CSE', designation: 'Assistant Professor' },
      { name: 'Prof. S. Kumar', email: 'skumar@vignanlara.ac.in', empId: 'VLIT/AIML/1022', dept: 'AIML', designation: 'Associate Professor' },
      { name: 'Dr. V. Rao', email: 'vrao@vignanlara.ac.in', empId: 'VLIT/ECE/1015', dept: 'ECE', designation: 'Professor & HOD' },
    ];

    const facultyDocs = {};
    const facultyPasswordHash = await bcrypt.hash('Faculty@123', 12);
    for (const f of facultyData) {
      let user = await User.findOne({ email: f.email });
      if (!user) {
        user = await User.create({
          name: f.name,
          email: f.email,
          password: facultyPasswordHash,
          role: 'FACULTY',
          phone: '+91 98765 43210',
          isActive: true,
        });
      } else {
        user.password = facultyPasswordHash;
        await user.save();
      }

      let fac = await Faculty.findOne({ employeeId: f.empId });
      if (!fac) {
        fac = await Faculty.create({
          user: user._id,
          employeeId: f.empId,
          department: depts[f.dept]._id,
          designation: f.designation,
          qualification: 'Ph.D. / M.Tech',
        });
      }
      facultyDocs[f.empId] = fac;
    }
    console.log('👨‍🏫 Faculty seeded (e.g. rmehta@vignanlara.ac.in / Faculty@123).');

    // ── 4. Create Students ────────────────────────────────────────────────────
    const studentsData = [
      { name: 'Rahul Kumar', email: 'rahulkumar21bcs101@vignan.ac.in', roll: '21BCS101', dept: 'CSE', year: 3, sem: 1, sec: 'A' },
      { name: 'Sneha Reddy', email: 'sneha.reddy@vignanlara.ac.in', roll: '21BCS102', dept: 'CSE', year: 3, sem: 1, sec: 'A' },
      { name: 'Aditya Kumar', email: 'aditya.kumar@vignanlara.ac.in', roll: '21BCS103', dept: 'CSE', year: 3, sem: 1, sec: 'B' },
    ];

    const studentPasswordHash = await bcrypt.hash('Student@123', 12);
    for (const s of studentsData) {
      let user = await User.findOne({ email: s.email });
      if (!user) {
        user = await User.create({
          name: s.name,
          email: s.email,
          password: studentPasswordHash,
          role: 'STUDENT',
          phone: '+91 98765 43211',
          isActive: true,
        });
      } else {
        user.password = studentPasswordHash;
        await user.save();
      }

      let st = await Student.findOne({ rollNumber: s.roll });
      if (!st) {
        st = await Student.create({
          user: user._id,
          rollNumber: s.roll,
          registrationNumber: `REG-${s.roll}`,
          department: depts[s.dept]._id,
          year: s.year,
          semester: s.sem,
          section: s.sec,
          admissionYear: 2023,
          batch: '2023-27',
        });
      }
    }
    console.log('🎓 Students seeded (e.g. rahulkumar21bcs101@vignan.ac.in / Student@123).');

    // ── 5. Create Subjects ────────────────────────────────────────────────────
    const subjectsData = [
      { name: 'Data Structures', code: 'CS301', dept: 'CSE', semester: 3, credits: 4, type: 'THEORY' },
      { name: 'Operating Systems', code: 'CS304', dept: 'CSE', semester: 3, credits: 3, type: 'THEORY' },
      { name: 'Artificial Intelligence', code: 'CS306', dept: 'CSE', semester: 4, credits: 4, type: 'THEORY' },
      { name: 'Machine Learning', code: 'CS308', dept: 'CSE', semester: 4, credits: 3, type: 'THEORY' },
      { name: 'Digital Signal Processing', code: 'EC302', dept: 'ECE', semester: 3, credits: 4, type: 'THEORY' },
      { name: 'Control Systems', code: 'EE201', dept: 'EEE', semester: 2, credits: 3, type: 'THEORY' },
    ];

    const subjects = {};
    for (const sb of subjectsData) {
      let subj = await Subject.findOne({ code: sb.code });
      if (!subj) {
        subj = await Subject.create({
          name: sb.name,
          code: sb.code,
          department: depts[sb.dept]._id,
          semester: sb.semester,
          year: 2,
          credits: sb.credits,
          type: sb.type,
        });
      }
      subjects[sb.code] = subj;
    }
    console.log('📚 Subjects seeded.');

    // ── 6. Create ClassSection & Timetable ─────────────────────────────────────
    let classSection = await ClassSection.findOne({ section: 'A', year: 3 });
    if (!classSection) {
      classSection = await ClassSection.create({
        department: depts['CSE']._id,
        course: depts['CSE']._id,
        year: 3,
        semester: 1,
        section: 'A',
        academicYear: '2026-27',
      });
    }

    const timetableSlots = [
      { day: 'MONDAY', start: '09:00', end: '10:00', code: 'CS301', room: 'Room 204' },
      { day: 'MONDAY', start: '11:15', end: '12:15', code: 'CS306', room: 'Room 208' },
      { day: 'TUESDAY', start: '10:00', end: '11:00', code: 'CS304', room: 'Room 310' },
      { day: 'TUESDAY', start: '13:30', end: '14:30', code: 'CS308', room: 'Room 304' },
      { day: 'WEDNESDAY', start: '09:00', end: '10:00', code: 'CS306', room: 'Room 208' },
      { day: 'WEDNESDAY', start: '11:15', end: '12:15', code: 'CS301', room: 'Room 204' },
      { day: 'THURSDAY', start: '10:00', end: '11:00', code: 'CS308', room: 'Room 304' },
      { day: 'FRIDAY', start: '09:00', end: '10:00', code: 'CS301', room: 'Room 204' },
      { day: 'FRIDAY', start: '11:15', end: '12:15', code: 'CS304', room: 'Room 310' },
    ];

    for (const slot of timetableSlots) {
      const existing = await Timetable.findOne({
        classSection: classSection._id,
        dayOfWeek: slot.day,
        startTime: slot.start,
      });

      if (!existing && subjects[slot.code]) {
        await Timetable.create({
          classSection: classSection._id,
          subject: subjects[slot.code]._id,
          faculty: facultyDocs['VLIT/CSE/1046']?._id,
          dayOfWeek: slot.day,
          startTime: slot.start,
          endTime: slot.end,
          room: slot.room,
          academicYear: '2026-27',
          semester: 1,
        });
      }
    }
    console.log('🗓️ Timetable schedule seeded.');

    // ── 7. Create Notices & Events ────────────────────────────────────────────
    const noticesData = [
      { title: 'Internal Assessment Schedule Released', description: 'The official schedule for Mid-Term Assessment 2026 has been published.', category: 'ACADEMIC', isPublished: true },
      { title: 'Tech Talk on GenAI and Large Language Models', description: 'Industry expert session in Main Auditorium on Friday 3 PM.', category: 'EVENT', isPublished: true },
      { title: 'Infosys Campus Placement Drive 2026', description: 'Registration open for final year B.Tech students.', category: 'PLACEMENT', isPublished: true },
    ];

    for (const n of noticesData) {
      const exists = await Notice.findOne({ title: n.title });
      if (!exists) {
        await Notice.create({ ...n, createdBy: admin._id });
      }
    }

    const eventsData = [
      { title: 'Tech Fest 2026', category: 'TECHNICAL', date: new Date(Date.now() + 14 * 86400000), startTime: '09:00', endTime: '17:00', venue: 'Main Auditorium', status: 'UPCOMING', isPublished: true },
      { title: 'Alumni Meet 2026', category: 'ALUMNI', date: new Date(Date.now() + 25 * 86400000), startTime: '10:00', endTime: '16:00', venue: 'Campus Lawn', status: 'UPCOMING', isPublished: true },
      { title: 'Hackathon 2026', category: 'TECHNICAL', date: new Date(Date.now() + 35 * 86400000), startTime: '08:30', endTime: '20:30', venue: 'CSE Block', status: 'UPCOMING', isPublished: true },
    ];

    for (const ev of eventsData) {
      const exists = await Event.findOne({ title: ev.title });
      if (!exists) {
        await Event.create(ev);
      }
    }
    console.log('📢 Notices and Events seeded.');

    // ── 8. Create Companies & Placement Drives ────────────────────────────────
    const companiesData = [
      { name: 'TCS', industry: 'Information Technology' },
      { name: 'Infosys', industry: 'Software Consulting' },
      { name: 'Accenture', industry: 'Technology Services' },
      { name: 'Wipro', industry: 'IT & Digital Solutions' },
      { name: 'Cognizant', industry: 'Digital & Cloud' },
    ];

    for (const cmp of companiesData) {
      let c = await Company.findOne({ name: cmp.name });
      if (!c) {
        c = await Company.create(cmp);
      }

      const existingDrive = await PlacementDrive.findOne({ company: c._id });
      if (!existingDrive) {
        await PlacementDrive.create({
          company: c._id,
          jobTitle: 'Software Engineer',
          eligibility: 'B.Tech (CSE / ECE / AIML)',
          package: '7.5 LPA',
          location: 'Hyderabad / Bengaluru',
          status: 'OPEN',
          driveDate: new Date(Date.now() + 20 * 86400000),
          createdBy: admin._id,
        });
      }
    }
    console.log('💼 Placement drives seeded.');

    console.log('\n🎉 Master database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
