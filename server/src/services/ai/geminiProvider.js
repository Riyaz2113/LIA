/**
 * geminiProvider.js
 * Google Gemini LLM provider implementation with multi-turn conversation support
 * and intelligent institutional fallback.
 */

const { LIA_SYSTEM_PROMPT } = require('./systemPrompt');

/**
 * generateGeminiFallback
 * Provides deterministic, high-quality institutional responses when
 * external API key is absent or when remote provider is unavailable.
 */
const generateGeminiFallback = ({ messages, user }) => {
  const lastUserMsg = [...messages].reverse().find((m) => m.senderType === 'USER' || m.role === 'user');
  const query = (lastUserMsg ? lastUserMsg.content || lastUserMsg.message || '' : '').toLowerCase();

  const userName = user?.name ? ` ${user.name}` : '';

  if (query.includes('attendance')) {
    return `Hello${userName}! To check your official live attendance records at Vignan's Lara Institute of Technology & Science:\n\n• Please navigate to the **Attendance** tab in your Student Portal.\n• The portal displays your subject-wise attendance percentage, total classes conducted, and present count updated daily.\n• A minimum of **75% attendance** is mandated by university regulations for semester end examination eligibility.\n\nLet me know if you need assistance navigating your student portal!`;
  }

  if (query.includes('placement') || query.includes('job') || query.includes('package') || query.includes('company')) {
    return `The Training & Placement Cell at Vignan's Lara (VLITS) actively connects students with leading global recruiters:\n\n• **Recruitment Partners**: TCS, Infosys, Cognizant, Wipro, Microsoft, Accenture, and core engineering giants.\n• **Campus Recruitment Training (CRT)**: Quantitative aptitude, logical reasoning, competitive coding bootcamps, and mock interviews.\n• **Portal Access**: You can view active drives, eligibility criteria, and application status under the **Placements** section.\n\nWould you like guidance on specific upcoming drives or preparation materials?`;
  }

  if (query.includes('exam') || query.includes('result') || query.includes('mark') || query.includes('grade')) {
    return `For Examination and Academic Evaluation queries at Vignan's Lara:\n\n• **Mid-Term & End-Sem Schedules**: Official timetables are published by the Examination Cell and posted to the **Academics** section.\n• **Results & Marks**: You can review your verified internal assessment marks and GPA in your portal.\n• **Hall Tickets**: Issued 1–2 weeks prior to semester examinations through the examination office.\n\nPlease consult your departmental coordinator for specific hall ticket inquiries.`;
  }

  if (query.includes('timetable') || query.includes('schedule') || query.includes('class')) {
    return `Your weekly class and lab schedules are structured according to the departmental curriculum:\n\n• Check your dedicated **Timetable** tab on the portal for your section's day-wise period timings, subject codes, and room/lab allocations.\n• Standard academic hours are **09:00 AM to 04:30 PM**, Monday through Saturday.\n\nNeed info regarding a specific subject or lab slot?`;
  }

  if (query.includes('hostel') || query.includes('mess') || query.includes('dining') || query.includes('room')) {
    return `Vignan's Lara provides well-maintained, secure residential hostels for both boys and girls:\n\n• **Amenities**: 24/7 high-speed Wi-Fi, continuous power backup, and dedicated reading rooms.\n• **Dining**: Hygienic mess serving nutritious South Indian meals and snacks.\n• **Security**: Resident faculty wardens, biometric access, and round-the-clock medical assistance.\n\nHostel applications and room allotments are managed through the Administrative Office.`;
  }

  if (query.includes('library') || query.includes('book') || query.includes('journal')) {
    return `The VLITS Central Library offers extensive physical and digital learning collections:\n\n• **Catalog**: 40,000+ volumes, standard textbooks, and IEEE/ACM digital journal subscriptions.\n• **Digital Library**: Computer terminals with high-speed internet access for research papers and NPTEL course videos.\n• **Borrowing**: Students can borrow up to 3 books simultaneously for a 14-day renewal cycle.\n\nCheck the **Library** portal tab to search book availability and shelf locations.`;
  }

  if (query.includes('event') || query.includes('club') || query.includes('fest') || query.includes('utsav')) {
    return `Campus Life & Student Activities at Vignan's Lara:\n\n• **LARA UTSAV**: Our flagship annual national-level technical and cultural festival.\n• **Clubs**: Code Crafters Club, Robotics & IoT Innovators, AI League, Music & Dramatics, and NSS Social Outreach.\n• **Upcoming Events**: Check the **Events** feed in your portal for workshops, hackathons, and sports meets.`;
  }

  // General Institutional Assistant Response
  return `Thank you for reaching out to **LIA (Lara Intelligent Assistant)**, the official virtual assistant for **Vignan's Lara Institute of Technology & Science**.\n\nI am here to assist you with:\n• Academic calendars, subjects & course materials\n• Exam notifications, timetables & result guidance\n• Training, campus placements & recruitment drives\n• Campus facilities, library catalog, and student life\n\nHow can I help you with your query today?`;
};

/**
 * generateGeminiResponse
 * Calls Google Gemini REST API or falls back intelligently.
 */
const generateGeminiResponse = async ({ messages = [], systemPrompt = LIA_SYSTEM_PROMPT, user = null }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return {
      text: generateGeminiFallback({ messages, user }),
      provider: 'gemini-fallback',
      model: 'lia-institutional-v1',
    };
  }

  try {
    // Format messages for Google Gemini API:
    // Filter down to recent turns (max 10) for manageable context window
    const recentMessages = messages.slice(-10);

    const contents = recentMessages.map((m) => {
      const role = (m.senderType === 'USER' || m.role === 'user') ? 'user' : 'model';
      const text = m.content || m.message || '';
      return {
        role,
        parts: [{ text }],
      };
    });

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      console.warn(`Gemini API returned status ${response.status}:`, errBody?.error?.message || 'Unknown provider error');
      return {
        text: generateGeminiFallback({ messages, user }),
        provider: 'gemini-fallback',
        model: 'lia-institutional-v1',
        error: errBody?.error?.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || candidateText.trim() === '') {
      return {
        text: generateGeminiFallback({ messages, user }),
        provider: 'gemini-fallback',
        model: 'lia-institutional-v1',
      };
    }

    return {
      text: candidateText.trim(),
      provider: 'google-gemini',
      model: modelName,
    };
  } catch (err) {
    console.warn('Gemini invocation error, applying fallback:', err.message);
    return {
      text: generateGeminiFallback({ messages, user }),
      provider: 'gemini-fallback',
      model: 'lia-institutional-v1',
      error: err.message,
    };
  }
};

module.exports = {
  generateGeminiResponse,
  generateGeminiFallback,
};
