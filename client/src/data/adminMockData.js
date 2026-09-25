/**
 * adminMockData.js
 * Comprehensive mock data store for all Admin Portal modules.
 * Structured cleanly as JavaScript objects so future MongoDB API integration is seamless.
 */

export const ADMIN_DASHBOARD_DATA = {
  stats: [
    { label: 'Students', value: '3,245', change: '+3.4%', isPositive: true, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Faculty', value: '286', change: '+1.1%', isPositive: true, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Programs', value: '48', change: '0%', isPositive: true, color: '#9333ea', bg: '#faf5ff' },
    { label: 'Departments', value: '12', change: '+1 new', isPositive: true, color: '#ea580c', bg: '#fff7ed' },
  ],
  recentActivities: [
    { id: 1, title: 'New student registration - B.Tech CSE', time: '10 mins ago', type: 'student' },
    { id: 2, title: 'Faculty profile updated - Dr. R. Mehta', time: '1 hour ago', type: 'faculty' },
    { id: 3, title: 'Placement drive request - TCS', time: '2 hours ago', type: 'placement' },
    { id: 4, title: 'New notice published - Exam Schedule', time: '3 hours ago', type: 'notice' },
  ],
  pendingApprovals: [
    { id: 1, label: 'Leave Requests', count: '18', path: '/admin/faculty' },
    { id: 2, label: 'Placement Approvals', count: '06', path: '/admin/placements' },
    { id: 3, label: 'Event Proposals', count: '12', path: '/admin/events' },
    { id: 4, label: 'Content Reviews', count: '08', path: '/admin/materials' },
  ],
};

export const ADMIN_USERS_DATA = [
  { id: 1, name: 'Admin', email: 'admin@vignanlara.ac.in', role: 'Super Admin', department: '-', status: 'Active', lastLogin: 'Today, 09:30 AM' },
  { id: 2, name: 'Dr. R. Mehta', email: 'rmehta@vignanlara.ac.in', role: 'Faculty', department: 'CSE', status: 'Active', lastLogin: 'Today, 08:45 AM' },
  { id: 3, name: 'Prof. S. Kumar', email: 'skumar@vignanlara.ac.in', role: 'Faculty', department: 'AIML', status: 'Active', lastLogin: 'Yesterday' },
  { id: 4, name: 'Mr. P. Reddy', email: 'preddy@vignanlara.ac.in', role: 'Staff', department: 'Administration', status: 'Active', lastLogin: 'Sep 18, 2026' },
  { id: 5, name: 'Ms. K. Sharma', email: 'ksharma@vignanlara.ac.in', role: 'Staff', department: 'Placements', status: 'Inactive', lastLogin: 'Sep 10, 2026' },
  { id: 6, name: 'Dr. V. Rao', email: 'vrao@vignanlara.ac.in', role: 'Faculty', department: 'ECE', status: 'Active', lastLogin: 'Sep 19, 2026' },
  { id: 7, name: 'Rahul Kumar', email: 'rahulkumar21bcs101@vignan.ac.in', role: 'Student', department: 'CSE', status: 'Active', lastLogin: 'Today, 09:00 AM' },
];

export const ADMIN_STUDENTS_APPLICATIONS = [
  { id: 1, appNo: 'VL/2026001', name: 'Rahul Verma', program: 'B.Tech CSE', appliedOn: '10 Sep 2026', email: 'rahul.v@gmail.com', status: 'Submitted' },
  { id: 2, appNo: 'VL/2026002', name: 'Sneha Reddy', program: 'B.Tech AIML', appliedOn: '09 Sep 2026', email: 'sneha.r@gmail.com', status: 'Under Review' },
  { id: 3, appNo: 'VL/2026003', name: 'Aditya Kumar', program: 'B.Tech ECE', appliedOn: '09 Sep 2026', email: 'aditya.k@gmail.com', status: 'Submitted' },
  { id: 4, appNo: 'VL/2026004', name: 'Priya Sharma', program: 'B.Tech IT', appliedOn: '08 Sep 2026', email: 'priya.s@gmail.com', status: 'Rejected' },
  { id: 5, appNo: 'VL/2026005', name: 'Mohd. Ayaan', program: 'B.Tech EEE', appliedOn: '08 Sep 2026', email: 'ayaan.m@gmail.com', status: 'Submitted' },
  { id: 6, appNo: 'VL/2026006', name: 'Kavya Sri', program: 'B.Tech CSE', appliedOn: '07 Sep 2026', email: 'kavya.s@gmail.com', status: 'Submitted' },
];

export const ADMIN_FACULTY_DATA = [
  { id: 1, facultyId: 'VLIT/CSE/1046', name: 'Dr. R. Mehta', department: 'Computer Science', designation: 'Assistant Professor', email: 'rmehta@vignanlara.ac.in', subjects: 'CS301, CS306', status: 'Active' },
  { id: 2, facultyId: 'VLIT/AIML/1022', name: 'Prof. S. Kumar', department: 'AI & ML', designation: 'Associate Professor', email: 'skumar@vignanlara.ac.in', subjects: 'AI401, ML402', status: 'Active' },
  { id: 3, facultyId: 'VLIT/ECE/1015', name: 'Dr. V. Rao', department: 'Electronics', designation: 'Professor & HOD', email: 'vrao@vignanlara.ac.in', subjects: 'EC302, VLSI305', status: 'Active' },
  { id: 4, facultyId: 'VLIT/EEE/1031', name: 'Dr. M. Lakshmi', department: 'Electrical', designation: 'Associate Professor', email: 'mlakshmi@vignanlara.ac.in', subjects: 'EE201, PS304', status: 'Active' },
  { id: 5, facultyId: 'VLIT/ME/1008', name: 'Prof. K. Ramesh', department: 'Mechanical', designation: 'Assistant Professor', email: 'kramesh@vignanlara.ac.in', subjects: 'ME301, TD303', status: 'Active' },
];

export const ADMIN_DEPARTMENTS_DATA = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. K. Srinivas', facultyCount: 42, studentCount: 780, status: 'Active' },
  { id: 2, code: 'AIML', name: 'Artificial Intelligence & Machine Learning', hod: 'Dr. P. Anusha', facultyCount: 18, studentCount: 240, status: 'Active' },
  { id: 3, code: 'ECE', name: 'Electronics & Communication Engineering', hod: 'Dr. V. Rao', facultyCount: 36, studentCount: 520, status: 'Active' },
  { id: 4, code: 'EEE', name: 'Electrical & Electronics Engineering', hod: 'Dr. M. Lakshmi', facultyCount: 24, studentCount: 380, status: 'Active' },
  { id: 5, code: 'ME', name: 'Mechanical Engineering', hod: 'Dr. G. Prasad', facultyCount: 22, studentCount: 290, status: 'Active' },
  { id: 6, code: 'IT', name: 'Information Technology', hod: 'Dr. S. Naidu', facultyCount: 28, studentCount: 410, status: 'Active' },
  { id: 7, code: 'MBA', name: 'Management Studies', hod: 'Dr. T. Radhika', facultyCount: 16, studentCount: 180, status: 'Active' },
];

export const ADMIN_PROGRAMS_DATA = [
  { id: 1, name: 'B.Tech - CSE', department: 'Computer Science', duration: '4 Years', students: 620, status: 'Active' },
  { id: 2, name: 'B.Tech - AIML', department: 'AI & ML', duration: '4 Years', students: 180, status: 'Active' },
  { id: 3, name: 'B.Tech - ECE', department: 'Electronics', duration: '4 Years', students: 420, status: 'Active' },
  { id: 4, name: 'B.Tech - EEE', department: 'Electrical', duration: '4 Years', students: 380, status: 'Active' },
  { id: 5, name: 'B.Tech - ME', department: 'Mechanical', duration: '4 Years', students: 210, status: 'Active' },
  { id: 6, name: 'M.Tech - CSE', department: 'Computer Science', duration: '2 Years', students: 65, status: 'Active' },
  { id: 7, name: 'MBA', department: 'Management', duration: '2 Years', students: 120, status: 'Active' },
];

export const ADMIN_SUBJECTS_DATA = [
  { id: 1, code: 'CS301', name: 'Data Structures', department: 'CSE', semester: 'Semester III', credits: 4, faculty: 'Dr. R. Mehta', status: 'Active' },
  { id: 2, code: 'CS304', name: 'Operating Systems', department: 'CSE', semester: 'Semester III', credits: 3, faculty: 'Dr. R. Mehta', status: 'Active' },
  { id: 3, code: 'CS306', name: 'Artificial Intelligence', department: 'CSE', semester: 'Semester IV', credits: 4, faculty: 'Dr. R. Mehta', status: 'Active' },
  { id: 4, code: 'CS308', name: 'Machine Learning', department: 'CSE', semester: 'Semester IV', credits: 3, faculty: 'Prof. S. Kumar', status: 'Active' },
  { id: 5, code: 'EC302', name: 'Digital Signal Processing', department: 'ECE', semester: 'Semester III', credits: 4, faculty: 'Dr. V. Rao', status: 'Active' },
  { id: 6, code: 'EE201', name: 'Control Systems', department: 'EEE', semester: 'Semester II', credits: 3, faculty: 'Dr. M. Lakshmi', status: 'Active' },
];

export const ADMIN_TIMETABLE_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '01:30 - 02:30',
  '02:30 - 03:30',
  '03:30 - 04:30',
];

export const ADMIN_TIMETABLE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ADMIN_TIMETABLE_DATA = {
  '09:00 - 10:00': { Monday: { code: 'CS301', subject: 'Data Structures', room: 'Room 204', faculty: 'Dr. R. Mehta' }, Wednesday: { code: 'CS306', subject: 'AI', room: 'Room 208', faculty: 'Dr. R. Mehta' }, Friday: { code: 'CS301', subject: 'Data Structures', room: 'Room 204', faculty: 'Dr. R. Mehta' } },
  '10:00 - 11:00': { Tuesday: { code: 'CS304', subject: 'Operating Systems', room: 'Room 310', faculty: 'Dr. R. Mehta' }, Thursday: { code: 'CS308', subject: 'Machine Learning', room: 'Room 304', faculty: 'Prof. S. Kumar' } },
  '11:15 - 12:15': { Monday: { code: 'CS306', subject: 'AI', room: 'Room 208', faculty: 'Dr. R. Mehta' }, Wednesday: { code: 'CS301', subject: 'Data Structures', room: 'Room 204', faculty: 'Dr. R. Mehta' }, Friday: { code: 'CS304', subject: 'Operating Systems', room: 'Room 310', faculty: 'Dr. R. Mehta' } },
  '01:30 - 02:30': { Tuesday: { code: 'CS308', subject: 'Machine Learning', room: 'Room 304', faculty: 'Prof. S. Kumar' }, Friday: { code: 'CS306', subject: 'AI', room: 'Room 208', faculty: 'Dr. R. Mehta' } },
  '02:30 - 03:30': {},
  '03:30 - 04:30': { Tuesday: { code: 'MEET', subject: 'Faculty Meeting', room: 'Conf Hall', faculty: 'All Faculty' } },
};

export const ADMIN_PLACEMENTS_DRIVES = [
  { id: 1, company: 'TCS', role: 'Software Developer', date: '05 Oct 2026', eligibility: 'B.Tech (All)', status: 'Scheduled', package: '7.5 LPA' },
  { id: 2, company: 'Infosys', role: 'Systems Engineer', date: '12 Oct 2026', eligibility: 'B.Tech (CSE/ECE)', status: 'Scheduled', package: '6.8 LPA' },
  { id: 3, company: 'Accenture', role: 'Application Developer', date: '20 Oct 2026', eligibility: 'B.Tech (All)', status: 'Upcoming', package: '8.2 LPA' },
  { id: 4, company: 'Wipro', role: 'Project Engineer', date: '01 Nov 2026', eligibility: 'B.Tech (All)', status: 'Open', package: '6.5 LPA' },
  { id: 5, company: 'Cognizant', role: 'Gen AI Intern', date: '10 Nov 2026', eligibility: 'B.Tech (CSE/AIML)', status: 'Open', package: '9.0 LPA' },
];

export const ADMIN_FACILITIES_DATA = [
  { id: 1, name: 'Central Library', category: 'Academic', description: '50,000+ books, digital journals, and e-resources', status: 'Active' },
  { id: 2, name: 'Sports Complex', category: 'Sports', description: 'Indoor badminton, table tennis & outdoor athletic sports facilities', status: 'Active' },
  { id: 3, name: 'Auditorium', category: 'Events', description: 'Air-conditioned main auditorium with 1000+ seating capacity', status: 'Active' },
  { id: 4, name: 'Cafeteria', category: 'General', description: 'Hygienic food, coffee kiosk, and multi-cuisine meal options', status: 'Active' },
  { id: 5, name: 'Boys Hostel', category: 'Hostel', description: 'Separate residential blocks with modern amenities and Wi-Fi', status: 'Active' },
  { id: 6, name: 'Girls Hostel', category: 'Hostel', description: 'Safe, secure on-campus accommodation with 24/7 security & biometric access', status: 'Active' },
];

export const ADMIN_EVENTS_DATA = [
  { id: 1, title: 'Tech Fest 2026', category: 'Technical', date: 'Oct 05, 2026', venue: 'Main Auditorium', status: 'Published' },
  { id: 2, title: 'Alumni Meet', category: 'Alumni', date: 'Oct 15, 2026', venue: 'Campus Lawn', status: 'Published' },
  { id: 3, title: 'Hackathon 2026', category: 'Technical', date: 'Oct 21, 2026', venue: 'CSE Block', status: 'Draft' },
  { id: 4, title: 'Freshers Day', category: 'Cultural', date: 'Oct 28, 2026', venue: 'Main Auditorium', status: 'Published' },
  { id: 5, title: 'Sports Meet', category: 'Sports', date: 'Nov 02, 2026', venue: 'Sports Complex', status: 'Scheduled' },
];

export const ADMIN_NOTICES_DATA = [
  { id: 1, title: 'Internal Assessment Schedule Released', category: 'Academic', audience: 'All Students', date: '18 Sep 2026', status: 'Published' },
  { id: 2, title: 'Project Review Meeting for Final Years', category: 'General', audience: 'III & IV Year', date: '16 Sep 2026', status: 'Published' },
  { id: 3, title: 'Tech Talk on GenAI and LLMs', category: 'Events', audience: 'All Students', date: '14 Sep 2026', status: 'Published' },
  { id: 4, title: 'Library Timings Extension Notice', category: 'General', audience: 'All Students', date: '12 Sep 2026', status: 'Published' },
  { id: 5, title: 'Infosys Campus Placement Drive 2026', category: 'Placements', audience: 'Final Year', date: '10 Sep 2026', status: 'Published' },
];

export const ADMIN_LIBRARY_DATA = [
  { id: 1, title: 'Introduction to Algorithms (4th Ed)', author: 'Cormen, Leiserson, Rivest', category: 'Computer Science', isbn: '978-0262046305', total: 45, available: 32, borrowed: 13 },
  { id: 2, title: 'Database System Concepts (7th Ed)', author: 'Silberschatz, Korth', category: 'Computer Science', isbn: '978-0078022159', total: 30, available: 21, borrowed: 9 },
  { id: 3, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', category: 'AI & ML', isbn: '978-0134610993', total: 25, available: 18, borrowed: 7 },
  { id: 4, title: 'Digital Logic and Computer Design', author: 'M. Morris Mano', category: 'Electronics', isbn: '978-9332542525', total: 40, available: 35, borrowed: 5 },
  { id: 5, title: 'Engineering Thermodynamics', author: 'P.K. Nag', category: 'Mechanical', isbn: '978-9352606405', total: 20, available: 16, borrowed: 4 },
];

export const ADMIN_EXAMS_DATA = [
  { id: 1, exam: 'Mid-Term Exam I', subject: 'CS301 - Data Structures', date: '10 Oct 2026', time: '10:00 AM - 12:00 PM', room: 'Hall A, B', department: 'CSE', semester: 'III Year', status: 'Scheduled' },
  { id: 2, exam: 'Mid-Term Exam I', subject: 'CS304 - Operating Systems', date: '12 Oct 2026', time: '10:00 AM - 12:00 PM', room: 'Hall A, B', department: 'CSE', semester: 'III Year', status: 'Scheduled' },
  { id: 3, exam: 'Mid-Term Exam I', subject: 'CS306 - Artificial Intelligence', date: '14 Oct 2026', time: '02:00 PM - 04:00 PM', room: 'Hall C', department: 'CSE', semester: 'IV Year', status: 'Scheduled' },
  { id: 4, exam: 'Lab Practical Assessment', subject: 'CS305 - Web Tech Lab', date: '16 Oct 2026', time: '09:30 AM - 12:30 PM', room: 'Lab 4', department: 'CSE', semester: 'III Year', status: 'Scheduled' },
];

export const ADMIN_CHATBOT_DATA = [
  { id: 1, category: 'Academic Calendar', question: 'When do the semester exams start?', answer: 'Semester exams for Fall 2026 commence on October 10, 2026.', status: 'Active' },
  { id: 2, category: 'Admissions', question: 'How can I apply for B.Tech admission?', answer: 'Applications can be submitted online through the LIA Admissions portal or in-person at the campus admissions desk.', status: 'Active' },
  { id: 3, category: 'Placements', question: 'What is the highest placement package this year?', answer: 'The highest package for 2026 is 44 LPA offered by Amazon, with an average of 7.2 LPA across CSE and AIML.', status: 'Active' },
  { id: 4, category: 'Facilities', question: 'What are the Central Library timings?', answer: 'The Central Library is open Monday to Saturday from 8:00 AM to 8:00 PM, and Sundays from 9:00 AM to 1:00 PM.', status: 'Active' },
];

export const ADMIN_AUDIT_LOGS = [
  { id: 1, date: '22 Sep 2026, 09:30 AM', user: 'Admin', role: 'Super Admin', action: 'Updated Timetable', module: 'Timetable', desc: 'Modified slot CS301 for Wednesday III Year CSE-A' },
  { id: 2, date: '21 Sep 2026, 04:15 PM', user: 'Dr. R. Mehta', role: 'Faculty', action: 'Published Marks', module: 'Marks', desc: 'Published Internal Assessment 1 results for CS301' },
  { id: 3, date: '21 Sep 2026, 02:00 PM', user: 'Admin', role: 'Super Admin', action: 'Added Placement Drive', module: 'Placements', desc: 'Created new placement drive for Infosys Systems Engineer' },
  { id: 4, date: '20 Sep 2026, 11:20 AM', user: 'Mr. P. Reddy', role: 'Staff', action: 'Published Notice', module: 'Notices', desc: 'Published notice: Internal Assessment Schedule Released' },
  { id: 5, date: '19 Sep 2026, 05:45 PM', user: 'Admin', role: 'Super Admin', action: 'Modified Hero Banner', module: 'Website', desc: 'Updated homepage hero banner copy and background asset' },
];

export const ADMIN_MATERIALS_DATA = [
  { id: 1, title: 'Unit 1: Trees and Graphs Notes', subject: 'Data Structures', department: 'CSE', type: 'PDF Document', uploadedBy: 'Dr. R. Mehta', uploadDate: '15 Sep 2026', status: 'Published' },
  { id: 2, title: 'Unit 2: Process Synchronization Slides', subject: 'Operating Systems', department: 'CSE', type: 'PPT Presentation', uploadedBy: 'Dr. R. Mehta', uploadDate: '12 Sep 2026', status: 'Published' },
  { id: 3, title: 'Unit 1: Heuristic Search Strategies', subject: 'Artificial Intelligence', department: 'CSE', type: 'PDF Document', uploadedBy: 'Dr. R. Mehta', uploadDate: '10 Sep 2026', status: 'Published' },
  { id: 4, title: 'Supervised Learning Algorithms Cheat Sheet', subject: 'Machine Learning', department: 'AIML', type: 'PDF Document', uploadedBy: 'Prof. S. Kumar', uploadDate: '08 Sep 2026', status: 'Published' },
  { id: 5, title: 'DSP Fourier Transform Lab Handout', subject: 'Digital Signal Processing', department: 'ECE', type: 'Lab Manual', uploadedBy: 'Dr. V. Rao', uploadDate: '05 Sep 2026', status: 'Published' },
];

export const ADMIN_ATTENDANCE_DATA = {
  summary: {
    totalStudents: 3245,
    presentToday: 2980,
    absentToday: 265,
    avgAttendance: '91.8%'
  },
  departments: [
    { department: 'Computer Science (CSE)', total: 780, present: 730, absent: 50, rate: '93.5%', status: 'Normal' },
    { department: 'AI & Machine Learning (AIML)', total: 240, present: 228, absent: 12, rate: '95.0%', status: 'High' },
    { department: 'Electronics & Comm (ECE)', total: 520, present: 472, absent: 48, rate: '90.7%', status: 'Normal' },
    { department: 'Electrical & Electronics (EEE)', total: 380, present: 338, absent: 42, rate: '88.9%', status: 'Attention' },
    { department: 'Mechanical Engineering (ME)', total: 290, present: 260, absent: 30, rate: '89.6%', status: 'Normal' },
    { department: 'Information Technology (IT)', total: 410, present: 375, absent: 35, rate: '91.4%', status: 'Normal' },
  ]
};

export const ADMIN_NOTIFICATIONS_DATA = [
  { id: 1, title: 'Campus Wi-Fi Maintenance Tonight', message: 'Campus-wide Wi-Fi networks will be undergoing scheduled maintenance from 11 PM to 3 AM.', audience: 'All Users', category: 'Maintenance', date: '22 Sep 2026', status: 'Sent' },
  { id: 2, title: 'Mid-Term Exam Time-Table Released', message: 'The official schedule for Mid-Term Assessment I has been published to all student and faculty portals.', audience: 'All Students', category: 'Academic', date: '20 Sep 2026', status: 'Sent' },
  { id: 3, title: 'Faculty General Body Meeting', message: 'HODs and teaching faculty are requested to assemble in Conference Hall 1 tomorrow at 3:30 PM.', audience: 'All Faculty', category: 'Meeting', date: '18 Sep 2026', status: 'Sent' },
  { id: 4, title: 'Hostel Curfew Advisory', message: 'All hostel residents are reminded of the updated biometric check-in timing of 9:00 PM.', audience: 'Hostel Students', category: 'Advisory', date: '15 Sep 2026', status: 'Sent' },
];

export const ADMIN_SETTINGS_DATA = {
  instituteName: "Vignan's Lara Institute of Technology & Science",
  shortName: "Vignan's Lara",
  tagline: "Engineering Excellence for a Better Tomorrow",
  address: "Vadlamudi, Guntur, Andhra Pradesh - 522213",
  email: "principal@vignanlara.ac.in",
  phone: "+91 863 2381200",
  website: "https://vignanlara.org",
  logoUrl: "/logo-main.png"
};
