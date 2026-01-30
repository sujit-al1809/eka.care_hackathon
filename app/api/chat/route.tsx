import { NextRequest, NextResponse } from "next/server";
import { chatWithDoctor, generateFallbackResponse } from "@/shared/GeminiModel";
import { medicalAgentSystem, PatientContext, AgentResponse } from "@/lib/agents/AgentSystem";
import { medicalSpamFilter } from "@/lib/filters/SpamFilter";
import { detectLanguage } from "@/lib/utils/LanguageDetector";

// Enhanced Hindi response generator - CONVERSATIONAL STYLE
function generateHindiMedicalResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // EMERGENCY DETECTION - Keep this immediate
  if (lowerMessage.includes('छाती') && lowerMessage.includes('दर्द')) {
    return `🚨 छाती में दर्द बहुत गंभीर हो सकता है।

क्या आपको:
• सांस लेने में तकलीफ है?
• बाएं हाथ में दर्द है?
• पसीना आ रहा है?

अगर हाँ, तो तुरंत 108 पर कॉल करें या नजदीकी अस्पताल जाएं। यह heart attack हो सकता है।`;
  }

  // CONVERSATIONAL RESPONSES - Short and interactive
  if (lowerMessage.includes('सिर') && lowerMessage.includes('दर्द')) {
    return `समझ गया, आपको सिरदर्द है।

कुछ सवाल:
• यह कब से हो रहा है?
• दर्द कैसा है - तेज़ धड़कता हुआ या हल्का?
• क्या आपको उल्टी या चक्कर भी आ रहे हैं?`;
  }

  if (lowerMessage.includes('बुखार')) {
    return `ठीक है, बुखार है।

बताइए:
• बुखार कितना है? (अगर नापा हो तो)
• कब से है?
• क्या ठंड लगकर बुखार आता है?
• और कोई तकलीफ है - खांसी, दर्द, उल्टी?`;
  }

  if (lowerMessage.includes('पेट') && lowerMessage.includes('दर्द')) {
    return `पेट में दर्द हो रहा है।

मुझे बताएं:
• पेट के किस हिस्से में दर्द है?
• खाना खाने के बाद बढ़ता है क्या?
• दस्त या उल्टी हो रही है?`;
  }

  if (lowerMessage.includes('खांसी')) {
    return `खांसी की समस्या है।

कुछ जानकारी चाहिए:
• सूखी खांसी है या कफ आता है?
• कब से है?
• बुखार भी है क्या?`;
  }

  if (lowerMessage.includes('दस्त') || lowerMessage.includes('loose')) {
    return `दस्त हो रहे हैं।

जरूरी सवाल:
• कितनी बार हुए आज?
• पानी जैसे हैं या खून आ रहा है?
• पेट में दर्द है?

फिलहाल: ORS (Electral) पीना शुरू करें - थोड़ा-थोड़ा हर 15 मिनट में।`;
  }

  // REMOVED IMMEDIATE TREATMENT LOGIC to ensure follow-up questions first
  /* 
  if (lowerMessage.includes('दिन') || lowerMessage.includes('घंटे') || lowerMessage.match(/\d+/)) {
     // ...
  }
  */

  // Default - Ask for more details
  return `नमस्ते! मैं आपकी मदद करूंगा।

कृपया विस्तार से बताएं:
• क्या तकलीफ है?
• कब से है?
• कोई और लक्षण?`;
}

// Marathi response generator - CONVERSATIONAL STYLE
function generateMarathiMedicalResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // EMERGENCY DETECTION - Keep this immediate
  if (lowerMessage.includes('छाती') && lowerMessage.includes('दुखत')) {
    return `🚨 छातीत दुखणे खूप गंभीर असू शकते।

काय आहे:
• श्वास घेण्यात त्रास?
• डाव्या हाताला दुखते?
• घाम येतो?

हो असेल तर लगेच 108 वर कॉल करा किंवा जवळच्या हॉस्पिटलला जा। हे heart attack असू शकते।`;
  }

  // CONVERSATIONAL RESPONSES - Short and interactive
  if (lowerMessage.includes('डोके') && lowerMessage.includes('दुखत')) {
    return `समजले, डोकेदुखी आहे।

काही प्रश्न:
• हे कधीपासून आहे?
• दुखणे कसे आहे - तीव्र धडधडणारे की हलके?
• उलटी किंवा चक्कर येते का?`;
  }

  if (lowerMessage.includes('ताप')) {
    return `ठीक आहे, ताप आहे।

सांगा:
• ताप किती आहे? (नापले असेल तर)
• कधीपासून आहे?
• थंडी लागून ताप येतो का?
• आणखी काही त्रास - खोकला, दुखणे, उलटी?`;
  }

  if (lowerMessage.includes('पोट') && lowerMessage.includes('दुखत')) {
    return `पोटात दुखते आहे।

मला सांगा:
• पोटाच्या कोणत्या भागात दुखते?
• जेवल्यानंतर वाढते का?
• जुलाब किंवा उलटी होते का?`;
  }

  if (lowerMessage.includes('खोकला')) {
    return `खोकल्याची समस्या आहे।

काही माहिती हवी:
• कोरडा खोकला की कफ येतो?
• कधीपासून आहे?
• ताप पण आहे का?`;
  }

  if (lowerMessage.includes('जुलाब') || lowerMessage.includes('loose')) {
    return `जुलाब होत आहेत।

महत्त्वाचे प्रश्न:
• आज किती वेळा झाले?
• पाण्यासारखे आहेत की रक्त येते?
• पोटात दुखते?

सध्या: ORS (Electral) प्यायला सुरू करा - थोडे-थोडे दर 15 मिनिटांनी।`;
  }

  // REMOVED IMMEDIATE TREATMENT LOGIC to ensure follow-up questions first
  /*
  if (lowerMessage.includes('दिवस') || lowerMessage.includes('तास') || lowerMessage.match(/\d+/)) {
     // ...
  }
  */

  // Default - Ask for more details
  return `नमस्कार! मी तुमची मदत करेन।

कृपया सविस्तर सांगा:
• काय त्रास आहे?
• कधीपासून आहे?
• आणखी काही लक्षणे?`;
}

// Tamil response generator - CONVERSATIONAL STYLE
function generateTamilMedicalResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // EMERGENCY DETECTION - Keep this immediate
  if (lowerMessage.includes('நெஞ்சு') && lowerMessage.includes('வலி')) {
    return `🚨 நெஞ்சு வலி மிகவும் தீவிரமானது.

என்ன இருக்கிறது:
• மூச்சு விட கஷ்டமா?
• இடது கை வலிக்கிறதா?
• வியர்க்கிறதா?

ஆம் என்றால் உடனே 108 அழைக்கவும் அல்லது அருகில் உள்ள மருத்துவமனைக்கு செல்லவும். இது heart attack ஆக இருக்கலாம்.`;
  }

  // CONVERSATIONAL RESPONSES - Short and interactive
  if (lowerMessage.includes('தலை') && lowerMessage.includes('வலி')) {
    return `புரிந்தது, தலைவலி இருக்கிறது.

சில கேள்விகள்:
• இது எப்போது ஆரம்பித்தது?
• வலி எப்படி இருக்கிறது - கடுமையாக துடிக்கிறதா அல்லது லேசாக?
• வாந்தி அல்லது தலைச்சுற்றல் இருக்கிறதா?`;
  }

  if (lowerMessage.includes('காய்ச்சல்')) {
    return `சரி, காய்ச்சல் இருக்கிறது.

சொல்லுங்கள்:
• காய்ச்சல் எவ்வளவு? (அளந்திருந்தால்)
• எப்போதிலிருந்து?
• குளிர் அடித்து காய்ச்சல் வருகிறதா?
• வேறு ஏதாவது பிரச்சனை - இருமல், வலி, வாந்தி?`;
  }

  if (lowerMessage.includes('வயிறு') && lowerMessage.includes('வலி')) {
    return `வயிற்றில் வலி இருக்கிறது.

எனக்கு சொல்லுங்கள்:
• வயிற்றின் எந்த பகுதியில் வலிக்கிறது?
• சாப்பிட்ட பிறகு அதிகமாகிறதா?
• வயிற்றுப்போக்கு அல்லது வாந்தி இருக்கிறதா?`;
  }

  if (lowerMessage.includes('இருமல்')) {
    return `இருமல் பிரச்சனை இருக்கிறது.

சில தகவல் வேண்டும்:
• உலர் இருமலா அல்லது சளி வருகிறதா?
• எப்போதிலிருந்து?
• காய்ச்சலும் இருக்கிறதா?`;
  }

  if (lowerMessage.includes('வயிற்றுப்போக்கு') || lowerMessage.includes('loose')) {
    return `வயிற்றுப்போக்கு இருக்கிறது.

முக்கியமான கேள்விகள்:
• இன்று எத்தனை முறை?
• தண்ணீர் போல இருக்கிறதா அல்லது ரத்தம் வருகிறதா?
• வயிற்றில் வலி இருக்கிறதா?

இப்போது: ORS (Electral) குடிக்க ஆரம்பியுங்கள் - கொஞ்சம் கொஞ்சமாக ஒவ்வொரு 15 நிமிடத்திற்கும்.`;
  }

  // REMOVED IMMEDIATE TREATMENT LOGIC to ensure follow-up questions first
  /*
  if (lowerMessage.includes('நாள்') || lowerMessage.includes('மணி') || lowerMessage.match(/\d+/)) {
    // ...
  }
  */

  // Default - Ask for more details
  return `வணக்கம்! நான் உங்களுக்கு உதவுகிறேன்.

தயவுசெய்து விரிவாக சொல்லுங்கள்:
• என்ன பிரச்சனை?
• எப்போதிலிருந்து?
• வேறு ஏதாவது அறிகுறிகள்?`;
}

// Telugu response generator - CONVERSATIONAL STYLE
function generateTeluguMedicalResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // EMERGENCY DETECTION - Keep this immediate
  if (lowerMessage.includes('ఛాతీ') && lowerMessage.includes('నొప్పి')) {
    return `🚨 ఛాతీ నొప్పి చాలా తీవ్రమైనది.

ఏమి ఉంది:
• ఊపిరి తీసుకోవడం కష్టమా?
• ఎడమ చేయి నొప్పి ఉందా?
• చెమట పడుతుందా?

అవును అయితే వెంటనే 108కి కాల్ చేయండి లేదా సమీపంలోని ఆసుపత్రికి వెళ్లండి. ఇది heart attack కావచ్చు.`;
  }

  // CONVERSATIONAL RESPONSES - Short and interactive
  if (lowerMessage.includes('తల') && lowerMessage.includes('నొప్పి')) {
    return `అర్థమైంది, తలనొప్పి ఉంది.

కొన్ని ప్రశ్నలు:
• ఇది ఎప్పటినుండి ప్రారంభమైంది?
• నొప్పి ఎలా ఉంది - తీవ్రంగా కొట్టుకుంటుందా లేదా తేలికగా?
• వాంతులు లేదా తలతిరగడం ఉందా?`;
  }

  if (lowerMessage.includes('జ్వరం')) {
    return `సరే, జ్వరం ఉంది.

చెప్పండి:
• జ్వరం ఎంత ఉంది? (కొలిచితే)
• ఎప్పటినుండి?
• చలి కొట్టి జ్వరం వస్తుందా?
• ఇంకా ఏదైనా సమస్య - దగ్గు, నొప్పి, వాంతులు?`;
  }

  if (lowerMessage.includes('కడుపు') && lowerMessage.includes('నొప్పి')) {
    return `కడుపులో నొప్పి ఉంది.

నాకు చెప్పండి:
• కడుపులో ఏ భాగంలో నొప్పి ఉంది?
• తిన్న తర్వాత పెరుగుతుందా?
• విరేచనాలు లేదా వాంతులు ఉన్నాయా?`;
  }

  if (lowerMessage.includes('దగ్గు')) {
    return `దగ్గు సమస్య ఉంది.

కొంత సమాచారం కావాలి:
• పొడి దగ్గా లేదా కఫం వస్తుందా?
• ఎప్పటినుండి?
• జ్వరం కూడా ఉందా?`;
  }

  if (lowerMessage.includes('విరేచనాలు') || lowerMessage.includes('loose')) {
    return `విరేచనాలు అవుతున్నాయి.

ముఖ్యమైన ప్రశ్నలు:
• ఈరోజు ఎన్నిసార్లు?
• నీళ్లలా ఉన్నాయా లేదా రక్తం వస్తుందా?
• కడుపులో నొప్పి ఉందా?

ఇప్పుడు: ORS (Electral) తాగడం ప్రారంభించండి - కొంచెం కొంచెం ప్రతి 15 నిమిషాలకు.`;
  }

  // REMOVED IMMEDIATE TREATMENT LOGIC to ensure follow-up questions first
  /*
  if (lowerMessage.includes('రోజు') || lowerMessage.includes('గంట') || lowerMessage.match(/\d+/)) {
    // ...
  }
  */

  // Default - Ask for more details
  return `నమస్కారం! నేను మీకు సహాయం చేస్తాను.

దయచేసి వివరంగా చెప్పండి:
• ఏమి సమస్య?
• ఎప్పటినుండి?
• ఇంకా ఏదైనా లక్షణాలు?`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, doctorPrompt, patientInfo, useAdvancedAI = true, image } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required and must be an array" }, { status: 400 });
    }

    // 🚀 ADVANCED MULTI-AGENT SYSTEM
    if (useAdvancedAI) {
      try {
        const lastUserMessage = messages[messages.length - 1]?.content || "";

        // 🌐 Auto-detect language from user input
        const languageDetection = detectLanguage(lastUserMessage);

        // 🚨 FORCE HINDI DETECTION FOR DEVANAGARI SCRIPT
        let detectedLanguage = languageDetection.isIndianLanguage
          ? languageDetection.detectedLanguage
          : (patientInfo?.language || 'english');

        // Additional Hindi detection check - Only if not already identified as another Devanagari language
        if (/[\u0900-\u097F]/.test(lastUserMessage) && !['marathi', 'nepali', 'sanskrit', 'konkani'].includes(detectedLanguage)) {
          detectedLanguage = 'hindi';
          console.log('🚨 FORCED HINDI DETECTION due to Devanagari script (defaulting to Hindi for unknown Devanagari)');
        }

        console.log(`🌐 Language detected: ${detectedLanguage} (confidence: ${(languageDetection.confidence * 100).toFixed(0)}%)`);
        console.log(`📝 User message: "${lastUserMessage}"`);
        console.log(`🔍 Is Indian language: ${languageDetection.isIndianLanguage}`);
        console.log(`🎯 Will use Hindi bypass: ${detectedLanguage === 'hindi'}`);

        // Debug: Log the exact detection result
        console.log('🔍 Full language detection:', JSON.stringify(languageDetection, null, 2));

        // 🧠 Build patient context
        const patientContext: PatientContext = {
          symptoms: lastUserMessage,
          language: detectedLanguage,
          history: messages.slice(0, -1).map((m: any) => `${m.role}: ${m.content}`).join('\n'),
          age: patientInfo?.age,
          gender: patientInfo?.gender,
          location: patientInfo?.location,
          allergies: patientInfo?.allergies
        };

        // 🎯 Primary Agent - Fast assessment
        console.log('🎯 Primary Agent: Analyzing symptoms...');
        const primaryResponse = await medicalAgentSystem.primaryAgent(patientContext);

        let agentResponse: AgentResponse = primaryResponse;

        // Only run emergency agent for critical cases
        if (primaryResponse.urgencyLevel === 'critical') {
          console.log('🚨 Emergency Agent: Critical symptoms detected!');
          agentResponse = await medicalAgentSystem.emergencyAgent(patientContext);
        }

        // 🚨 ULTRA AGGRESSIVE MULTI-LANGUAGE ENFORCEMENT - BYPASS GEMINI FOR INDIAN LANGUAGES
        // MODIFICATION: We now prefer Gemini for Contextual awareness, but stick to strict filtering.
        // We removed the preemptive template blocks to allow Gemini to handle conversation history.
        let assistantResponse = "";

        // Use standard prompt for English and other languages OR if image is present (Gemini handles images)
        console.log(`🌐 Language: ${detectedLanguage} - using Gemini (Image present: ${!!image})`);
        assistantResponse = await chatWithDoctor(messages, doctorPrompt, image);

        // Remove any English text that might have leaked through for Indian languages
        if (languageDetection.isIndianLanguage) {
          assistantResponse = assistantResponse
            .replace(/Medical Assessment:/gi, '')
            .replace(/General Recommendations:/gi, '')
            .replace(/Important:/gi, '')
            .replace(/Please consult/gi, '')
            .replace(/healthcare professional/gi, '');
        }

        // Final safety check: If Indian language detected but response has English, use fallback
        // SKIP THIS IF IMAGE IS PRESENT - We trust Gemini's vision analysis more than our templates
        if (languageDetection.isIndianLanguage && /[a-zA-Z]{3,}/.test(assistantResponse) && !image) {
          console.log(`🚨 Final fallback: English detected in ${detectedLanguage} response, using pure ${detectedLanguage} fallback`);

          switch (detectedLanguage) {
            case 'hindi':
              assistantResponse = generateHindiMedicalResponse(lastUserMessage);
              break;
            case 'marathi':
              assistantResponse = generateMarathiMedicalResponse(lastUserMessage);
              break;
            case 'tamil':
              assistantResponse = generateTamilMedicalResponse(lastUserMessage);
              break;
            case 'telugu':
              assistantResponse = generateTeluguMedicalResponse(lastUserMessage);
              break;
            default:
              // Keep the response as is for other languages
              break;
          }
        }

        // Apply spam filter with language awareness
        const filteredResponse = medicalSpamFilter.filterMedicalResponse(assistantResponse, detectedLanguage);

        let finalResponse = assistantResponse;
        if (filteredResponse.isSpam && !languageDetection.isIndianLanguage) {
          // Only use cleaned response for English, not for Indian languages
          console.log(`Spam filtered (${(filteredResponse.confidence * 100).toFixed(0)}% spam confidence)`);
          finalResponse = filteredResponse.cleanedResponse;
        }

        console.log(`✅ Final response language check: ${/[a-zA-Z]{3,}/.test(finalResponse) ? 'Contains English' : 'Native language only'}`);

        // For Indian languages, return PURE conversational response without system labels
        // For English, add footer with priority info
        let enhancedResponse = finalResponse;

        if (!languageDetection.isIndianLanguage) {
          // Only add system footer for English responses
          // const languageInfo = languageDetection.languageMetadata?.name || detectedLanguage;
          // enhancedResponse = `${finalResponse}\n\n---\n📊 ${agentResponse.urgencyLevel.toUpperCase()} Priority | 🌐 ${languageInfo}`;
          enhancedResponse = finalResponse; // Keep it clean
        }

        return NextResponse.json({
          content: enhancedResponse,
          agentData: {
            agentType: agentResponse.agentType,
            urgencyLevel: agentResponse.urgencyLevel,
            confidence: agentResponse.confidence,
            reasoning: agentResponse.reasoning,
            recommendations: agentResponse.recommendations,
            indianContext: agentResponse.indianContext,
            detectedLanguage: detectedLanguage,
            spamFiltered: filteredResponse.isSpam,
            spamConfidence: filteredResponse.confidence
          }
        });

      } catch (agentError) {
        console.error("Multi-agent system error:", agentError);
        // Fall through to standard Gemini response
      }
    }

    // Fallback: Standard Gemini response
    try {
      const assistantResponse = await chatWithDoctor(messages, doctorPrompt, image);
      const filteredResponse = medicalSpamFilter.filterMedicalResponse(assistantResponse);

      return NextResponse.json({
        content: filteredResponse.isSpam ? filteredResponse.cleanedResponse : assistantResponse,
        fallback: true,
        spamFiltered: filteredResponse.isSpam
      });

    } catch (geminiError) {
      console.error("Error calling Gemini API:", geminiError);

      const fallbackResponse = generateFallbackResponse("I'm having trouble understanding your request. Please describe your symptoms clearly, and I'll do my best to help.");
      return NextResponse.json({
        content: fallbackResponse,
        fallback: true
      });
    }

  } catch (error) {
    console.error("Error in advanced chat API:", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}