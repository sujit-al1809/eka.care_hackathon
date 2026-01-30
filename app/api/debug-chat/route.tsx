import { NextRequest, NextResponse } from "next/server";
import { detectLanguage } from "@/lib/utils/LanguageDetector";

// Simple Hindi response generator
function generateSimpleHindiResponse(userMessage: string): string {
  return `🩺 समझ गया, आपकी समस्या के बारे में।

📝 आपकी तकलीफ:
• ${userMessage.includes('दर्द') ? 'दर्द' : 'तकलीफ'}
• ${userMessage.includes('बुखार') ? 'बुखार' : ''}

❓ कुछ सवाल:
1. यह कब से हो रहा है?
2. और कोई परेशानी है?
3. कोई दवाई ले रहे हो?

💊 सुझाव:
• आराम करें
• पानी पिएं
• डॉक्टर से मिलें

🏥 जरूरी हो तो: 108 पर कॉल करें`;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log(`🔍 DEBUG: Received message: "${message}"`);
    
    // Test language detection
    const languageDetection = detectLanguage(message);
    console.log(`🔍 DEBUG: Language detection result:`, languageDetection);
    
    const detectedLanguage = languageDetection.isIndianLanguage 
      ? languageDetection.detectedLanguage 
      : 'english';
    
    console.log(`🔍 DEBUG: Final detected language: ${detectedLanguage}`);
    
    let response = "";
    
    if (detectedLanguage === 'hindi') {
      console.log(`🚨 DEBUG: Hindi detected - generating Hindi response`);
      response = generateSimpleHindiResponse(message);
      console.log(`🚨 DEBUG: Generated response: "${response.substring(0, 100)}..."`);
    } else {
      console.log(`🔍 DEBUG: Non-Hindi detected - generating English response`);
      response = `I understand you said: "${message}". This would normally be processed in English.`;
    }
    
    // Check if response contains English
    const hasEnglish = /[a-zA-Z]{3,}/.test(response);
    console.log(`🔍 DEBUG: Response contains English: ${hasEnglish}`);
    
    return NextResponse.json({
      originalMessage: message,
      detectedLanguage: detectedLanguage,
      languageDetection: languageDetection,
      response: response,
      hasEnglish: hasEnglish,
      debug: {
        isIndianLanguage: languageDetection.isIndianLanguage,
        confidence: languageDetection.confidence,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error("Error in debug chat API:", error);
    return NextResponse.json({ error: "Failed to process debug request" }, { status: 500 });
  }
}