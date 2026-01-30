import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    console.log(`🔍 SIMPLE HINDI API: Received message: "${message}"`);
    
    // Check if message contains Hindi (Devanagari script)
    const hasHindi = /[\u0900-\u097F]/.test(message);
    
    if (hasHindi) {
      console.log('🚨 HINDI DETECTED - Returning pure Hindi response');
      
      const hindiResponse = `🩺 समझ गया, आपकी समस्या के बारे में।

📝 आपकी तकलीफ:
• ${message.includes('दर्द') ? 'दर्द' : 'तकलीफ'}
• ${message.includes('बुखार') ? 'बुखार' : ''}
• ${message.includes('सिर') ? 'सिरदर्द' : ''}

❓ कुछ सवाल:
1. यह कब से हो रहा है?
2. और कोई परेशानी है?
3. कोई दवाई ले रहे हो?

💊 सुझाव:
• आराम करें
• पानी ज्यादा पिएं
• अगर तेज़ हो तो डॉक्टर से मिलें

🏥 जरूरी हो तो: 108 पर कॉल करें या नजदीकी अस्पताल जाएं`;

      return NextResponse.json({
        content: hindiResponse,
        detectedLanguage: 'hindi',
        hasEnglish: false,
        method: 'simple_template'
      });
    } else {
      return NextResponse.json({
        content: `I understand you said: "${message}". This is an English response.`,
        detectedLanguage: 'english',
        hasEnglish: true,
        method: 'english_fallback'
      });
    }
    
  } catch (error) {
    console.error("Error in simple Hindi API:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}