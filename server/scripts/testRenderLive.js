const fetch = globalThis.fetch || require('node-fetch');

async function testRenderLive() {
  console.log('====================================================');
  console.log('🌐 TESTING LIVE DEPLOYED RENDER BACKEND');
  console.log('URL: https://lia-719n.onrender.com/api');
  console.log('====================================================\n');

  console.log('1. Authenticating as admin@vlits.edu.in on Render...');
  const loginRes = await fetch('https://lia-719n.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'admin@vlits.edu.in',
      password: 'Admin@123',
    }),
  });

  const setCookie = loginRes.headers.get('set-cookie');
  const loginData = await loginRes.json();
  console.log(`Login Status: ${loginRes.status}`);
  console.log(`User: ${loginData?.data?.user?.name || 'N/A'} (${loginData?.data?.user?.role || 'N/A'})`);

  if (!setCookie) {
    console.error('Failed to get authentication cookie.');
    return;
  }

  const tokenCookie = setCookie.split(';')[0];

  console.log('\n2. Sending Question to Render backend:');
  const question = 'What is the IV-I AIML timetable?';
  console.log(`Query: "${question}"\n`);

  const startTime = Date.now();
  const chatRes = await fetch('https://lia-719n.onrender.com/api/chat/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: tokenCookie,
    },
    body: JSON.stringify({
      title: 'IV-I AIML Timetable Verification',
      initialMessage: question,
    }),
  });

  const duration = Date.now() - startTime;
  console.log(`Response Status: ${chatRes.status} (took ${duration}ms)`);
  const chatJson = await chatRes.json();

  const assistantMsg = chatJson?.data?.messages?.find(m => m.senderType === 'ASSISTANT');

  console.log('\n====================================================');
  console.log('RENDER BACKEND RESPONSE:');
  console.log('====================================================');
  console.log('Assistant Text:\n', assistantMsg?.message);
  console.log('\nSources Metadata:');
  console.log(JSON.stringify(assistantMsg?.sources, null, 2));

  // Delete test conversation cleanly
  if (chatJson?.data?.conversation?._id) {
    await fetch(`https://lia-719n.onrender.com/api/chat/conversations/${chatJson.data.conversation._id}`, {
      method: 'DELETE',
      headers: { Cookie: tokenCookie },
    });
    console.log('\nCleaned up test conversation from Render database.');
  }

  console.log('====================================================');
}

testRenderLive().catch(console.error);
