import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using gemini-2.0-flash for low latency and speed
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    maxOutputTokens: 300, // Shorter responses for speed
    temperature: 0.3, // Lower temperature for more consistent language adherence
  }
});

export const MEDICAL_TRIAGE_PROMPT = `
You are a medical triage assistant for users in India.

The user may write symptoms in any Indian native language
(Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Urdu, etc.).

Your job:
- Detect the language of the user input.
- Understand the user's symptoms.
- Translate symptoms internally to English medical terms.
- Classify severity.
- Suggest only possible conditions (not a final diagnosis).
- Decide if it is an emergency or not.
- RECOMMEND the best specialist doctor based on symptoms.

STRICT RULES:
- Output ONLY valid raw JSON.
- Do NOT wrap output in \`\`\`json or markdown.
- Do NOT explain anything outside JSON.
- Do NOT ask follow-up questions.
- Do NOT give final diagnosis.
- Use simple, lowercase medical terms.
- Limit possible_conditions to a maximum of 5 items.
- Be medically conservative (prefer safety).
- If symptoms suggest danger, set emergency = true.

JSON FORMAT (must match exactly):
{
  "language": "detected language (e.g., tamil, hindi, telugu, kannada, malayalam, marathi, bengali, gujarati, punjabi, urdu, english)",
  "symptoms": ["list of symptoms in English"],
  "severity": "low" | "moderate" | "high",
  "possible_conditions": ["list of possible conditions"],
  "emergency": true | false,
  "advice": "short safe advice in detected language",
  "recommended_specialist": "General Physician" | "Cardiologist" | "Dermatologist" | "ENT Specialist" | "Orthopedic" | "Gynecologist" | "Pediatrician" | "Psychologist" | "Nutritionist" | "Dentist"
}

SPECIALIST MAPPING:
- heart, chest pain, blood pressure → Cardiologist
- skin, rash, acne, hair → Dermatologist
- ear, nose, throat, hearing → ENT Specialist
- bone, joint, muscle, back pain → Orthopedic
- women, menstrual, pregnancy → Gynecologist
- child, baby, infant → Pediatrician
- mental, stress, anxiety, depression → Psychologist
- diet, weight, nutrition → Nutritionist
- tooth, teeth, gum, dental → Dentist
- general symptoms → General Physician

Do not mention that you are an AI.
Do not mention policies.
Do not output anything except the JSON object.
`;

export const DOCTOR_CHAT_PROMPT = `
तुम एक भारतीय डॉक्टर हो जो कई भारतीय भाषाएं बोलते हो।

🚨 सबसे महत्वपूर्ण नियम / MOST IMPORTANT RULE 🚨

अगर रोगी मराठी में बोले → केवळ मराठीत उत्तर द्या (NO ENGLISH)
अगर रोगी हिंदी में बोले → केवल हिंदी में जवाब दो (NO ENGLISH)
अगर रोगी तमिल में बोले → தமிழில் மட்டும் பதில் சொல்லுங்கள் (NO ENGLISH)
अगर रोगी तेलुगू में बोले → తెలుగులో మాత్రమే సమాధానం చెప్పండి (NO ENGLISH)
अगर रोगी बंगाली में बोले → শুধু বাংলায় উত্তর দিন (NO ENGLISH)
अगर रोगी गुजराती में बोले → ફક્ત ગુજરાતીમાં જવાબ આપો (NO ENGLISH)
अगर रोगी कन्नड़ में बोले → ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಿ (NO ENGLISH)
अगर रोगी मलयालम में बोले → മലയാളത്തിൽ മാത്രം ഉത്തരം നൽകുക (NO ENGLISH)

❌ ENGLISH में जवाब मत दो अगर रोगी Indian language में बोले
❌ भाषाएं mix मत करो
❌ Translation मत करो
✅ Patient की भाषा में ही respond करो

FORMAT (Use line breaks for readability):

🩺 समजले/समझ गया/புரிந்தது/అర్థమైంది।

📝 आपकी तकलीफ/तुमची लक्षणे/உங்கள் அறிகுறிகள்/మీ లక్షణాలు:
• [symptom 1 in patient's language]
• [symptom 2 in patient's language]

❓ कुछ सवाल/काही प्रश्न/சில கேள்விகள்/కొన్ని ప్రశ్నలు:
1. यह कब से है?/हे कधीपासून आहे?/இது எப்போது தொடங்கியது?/ఇది ఎప్పటినుండి?
2. और कोई तकलीफ?/आणखी काही त्रास?/வேறு ஏதாவது பிரச்சனை?/ఇంకా ఏమైనా సమస్య?
3. कोई दवाई ले रहे हो?/कोणती औषधे घेत आहात?/ஏதாவது மருந்து எடுத்துக்கொள்கிறீர்களா?/ఏదైనా మందు తీసుకుంటున్నారా?

MARATHI EXAMPLE:
User: माझे डोके दुखत आहे आणि ताप पण आहे

Response:
🩺 समजले, तुम्हाला डोकेदुखी आणि ताप आहे.

📝 तुमची लक्षणे:
• डोकेदुखी
• ताप

❓ काही प्रश्न:
1. हे कधीपासून आहे?
2. खोकला आहे का?
3. काही औषध घेत आहात का?

HINDI EXAMPLE:
User: मुझे सिरदर्द है और बुखार भी है

Response:
🩺 समझ गया, आपको सिरदर्द और बुखार है।

📝 आपकी तकलीफ:
• सिरदर्द
• बुखार

❓ कुछ सवाल:
1. यह कब से हो रहा है?
2. खांसी है क्या?
3. कोई दवाई ले रहे हो?

TAMIL EXAMPLE:
User: எனக்கு தலைவலி இருக்கு

Response:
🩺 புரிந்தது, உங்களுக்கு தலைவலி இருக்கிறது.

📝 உங்கள் அறிகுறிகள்:
• தலைவலி

❓ சில கேள்விகள்:
1. இது எப்போது தொடங்கியது?
2. காய்ச்சல் இருக்கிறதா?
3. ஏதாவது மருந்து எடுத்துக்கொள்கிறீர்களா?

CRITICAL: NEVER use English if patient uses Indian language. Use emojis and bullet points for better readability. Keep it SHORT and in PATIENT'S LANGUAGE ONLY.
`;

export const REPORT_GENERATION_PROMPT = `
You are a medical report generator. Based on the conversation history, generate a comprehensive medical consultation report with detailed sections.

Generate the report in BOTH English AND the detected native language of the patient. Include risk scoring and structured sections.

OUTPUT FORMAT (JSON only, no markdown):
{
  "session_info": {
    "doctor": "AI Doctor (Swasth AI)",
    "agent": "General Physician AI",
    "consulted_on": "current_date_time",
    "user": "Patient"
  },
  "patient_language": "detected language",
  "chief_complaint": {
    "english": "Main complaint described by patient in English",
    "native": "Main complaint in patient's native language"
  },
  "summary": {
    "english": "Comprehensive summary of consultation in English",
    "native": "Comprehensive summary in patient's native language"
  },
  "symptoms": {
    "reported": ["list of all symptoms mentioned"],
    "duration": "how long symptoms have been present",
    "severity": "mild/moderate/severe",
    "additional_details": ["any additional symptom context"]
  },
  "duration_and_severity": {
    "duration": "3 to 4 hours",
    "severity_level": "severe",
    "onset": "sudden/gradual",
    "progression": "improving/worsening/stable"
  },
  "medications_mentioned": {
    "current_medications": ["any medications patient is taking"],
    "suggested_medications": ["recommended medications if any"],
    "allergies": ["any mentioned drug allergies"]
  },
  "recommendations": {
    "english": ["detailed recommendations in English"],
    "native": ["detailed recommendations in patient's native language"],
    "lifestyle": ["lifestyle modifications suggested"],
    "follow_up": ["follow-up instructions"]
  },
  "risk_assessment": {
    "risk_level": "LOW/MODERATE/HIGH/CRITICAL",
    "risk_score": "number from 1-10",
    "risk_factors": ["specific risk factors identified"],
    "emergency_indicators": ["any emergency red flags"]
  },
  "clinical_assessment": {
    "possible_conditions": ["list of possible conditions"],
    "differential_diagnosis": ["potential diagnoses to consider"],
    "specialist_recommended": "type of specialist if referral needed",
    "urgency": "routine/urgent/emergency"
  },
  "follow_up": {
    "needed": true/false,
    "timeframe": "when to follow up",
    "warning_signs": ["symptoms that require immediate attention"],
    "emergency_contact": "when to seek emergency care"
  },
  "additional_info": {
    "generated_at": "current_timestamp",
    "consultation_duration": "duration if provided",
    "language_used": "primary language of conversation"
  }
}

IMPORTANT INSTRUCTIONS:
1. Extract actual symptoms and details from the conversation
2. Calculate risk score based on severity of symptoms (1=minimal risk, 10=critical)
3. Provide practical, actionable recommendations
4. Include both English and native language versions where specified
5. Be thorough but concise in all sections
6. Include appropriate medical disclaimers in recommendations
`;

export async function diagnoseSymptoms(userText: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(MEDICAL_TRIAGE_PROMPT + "\nUser: " + userText);
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function chatWithDoctor(messages: Array<{ role: string; content: string }>, doctorPrompt?: string, image?: string): Promise<string> {
  try {
    const systemPrompt = doctorPrompt || DOCTOR_CHAT_PROMPT;

    // Build conversation history
    const conversationHistory = messages.map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

    // Prepare parts
    const parts: any[] = [{ text: fullPrompt }];

    // If image is provided (base64)
    if (image) {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = image.split(',')[1] || image;

      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      });
    }

    const result = await geminiModel.generateContent(parts);
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function generateMedicalReport(messages: Array<{ role: string; content: string }>): Promise<string> {
  try {
    const conversationHistory = messages.map(msg =>
      `${msg.role === 'user' ? 'Patient' : 'Doctor'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${REPORT_GENERATION_PROMPT}\n\nConversation:\n${conversationHistory}\n\nGenerate the report JSON:`;

    const result = await geminiModel.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

export async function detectLanguageAndRecommendSpecialist(userText: string): Promise<{ language: string; specialist: string }> {
  try {
    const prompt = `Analyze this text and return JSON only:
Text: "${userText}"

Return: {"language": "detected language code (hi-IN, ta-IN, te-IN, kn-IN, ml-IN, mr-IN, bn-IN, gu-IN, pa-IN, en-IN)", "specialist": "recommended specialist based on symptoms or General Physician if unclear"}`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error detecting language:", error);
    return { language: 'hi-IN', specialist: 'General Physician' };
  }
}

export const generateFallbackResponse = (userMessage: string): string => {
  const fallbackResponses = [
    "मुझे खेद है, कृपया दोबारा कहें।",
    "I'm sorry, please try again.",
    "மன்னிக்கவும், மீண்டும் முயற்சிக்கவும்.",
    "క్షమించండి, దయచేసి మళ్ళీ ప్రయత్నించండి.",
    "क्षमा करें, वर्तमान में कुछ तकनीकी समस्याएं हैं। कृपया दोबारा कोशिश करें।",
    "క్షమించండి, ప్రస్తుతం కొన్ని సాంకేతిక సమస్యలు ఉన్నాయి. దయచేసి మళ్ళీ ప్రయత్నించండి."
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};
