require('dotenv').config();
const mongoose = require('mongoose');
const { isTimetableQuery, retrieveReranked } = require('../src/services/rag/retrievalService');
const { generateGroundedResponse } = require('../src/services/rag/ragService');

const queries = [
  'aiml 4th year time table',
  'AIML 4th year timetable',
  '4th year AIML timetable',
  'IV year AIML timetable',
  'IV-I AIML timetable',
  'AIML time table',
  'what is the AIML timetable',
  'show me my 4th year timetable',
];

async function testAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Testing 8 Natural Timetable Query Variations:\n');

  for (const q of queries) {
    console.log(`----------------------------------------------------`);
    console.log(`Query: "${q}"`);
    console.log(`isTimetableQuery: ${isTimetableQuery(q)}`);
    const res = await generateGroundedResponse({
      query: q,
      user: { name: 'Student', role: 'STUDENT' }
    });
    const topSource = res.sources?.[0]?.metadata?.source || res.sources?.[0]?.metadata?.title || 'None';
    const topPage = res.sources?.[0]?.metadata?.pageNumber;
    const topScore = res.sources?.[0]?.score;
    const isGroundSuccess = topSource.toLowerCase().includes('time table') || topSource.toLowerCase().includes('timetable') || topSource.toLowerCase().includes('3rd year');
    console.log(`Top Source: ${topSource} (p.${topPage}) [score: ${topScore}]`);
    console.log(`Contains Timetable Info: ${res.text.includes('|') || res.text.toLowerCase().includes('timetable') || res.text.toLowerCase().includes('schedule')}`);
    console.log(`Result: ${isGroundSuccess ? '✅ PASS' : '❌ FAIL'}\n`);
  }

  await mongoose.disconnect();
}

testAll().catch(console.error);
