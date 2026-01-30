import { NextRequest, NextResponse } from "next/server";

// Indian language voice mapping for browser TTS
const INDIAN_VOICE_MAPPING: Record<number, string> = {
  1: "hi-IN", // Hindi
  2: "ta-IN", // Tamil
  3: "te-IN", // Telugu
  4: "kn-IN", // Kannada
  5: "ml-IN", // Malayalam
  6: "mr-IN", // Marathi
  7: "bn-IN", // Bengali
  8: "gu-IN", // Gujarati
  9: "en-IN", // English (India)
};

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, doctorId, language } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Determine the language for TTS
    let ttsLanguage = language || "hi-IN"; // Default to Hindi
    
    if (doctorId && INDIAN_VOICE_MAPPING[doctorId]) {
      ttsLanguage = INDIAN_VOICE_MAPPING[doctorId];
    }

    // Auto-detect language from text (basic detection)
    const hindiRegex = /[\u0900-\u097F]/;
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const kannadaRegex = /[\u0C80-\u0CFF]/;
    const malayalamRegex = /[\u0D00-\u0D7F]/;
    const bengaliRegex = /[\u0980-\u09FF]/;
    const gujaratiRegex = /[\u0A80-\u0AFF]/;
    const marathiRegex = /[\u0900-\u097F]/; // Same as Hindi (Devanagari)

    if (hindiRegex.test(text)) ttsLanguage = "hi-IN";
    else if (tamilRegex.test(text)) ttsLanguage = "ta-IN";
    else if (teluguRegex.test(text)) ttsLanguage = "te-IN";
    else if (kannadaRegex.test(text)) ttsLanguage = "kn-IN";
    else if (malayalamRegex.test(text)) ttsLanguage = "ml-IN";
    else if (bengaliRegex.test(text)) ttsLanguage = "bn-IN";
    else if (gujaratiRegex.test(text)) ttsLanguage = "gu-IN";

    // Return response for browser-based TTS (free, supports all Indian languages)
    return NextResponse.json({
      success: true,
      useBrowserTTS: true,
      text: text,
      language: ttsLanguage,
      supportedLanguages: [
        { code: "hi-IN", name: "Hindi" },
        { code: "ta-IN", name: "Tamil" },
        { code: "te-IN", name: "Telugu" },
        { code: "kn-IN", name: "Kannada" },
        { code: "ml-IN", name: "Malayalam" },
        { code: "mr-IN", name: "Marathi" },
        { code: "bn-IN", name: "Bengali" },
        { code: "gu-IN", name: "Gujarati" },
        { code: "pa-IN", name: "Punjabi" },
        { code: "en-IN", name: "English (India)" },
      ],
      message: "Use browser Web Speech API for text-to-speech with Indian language support"
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in TTS API:", errorMessage);
    return NextResponse.json({ error: "Failed to generate speech", details: errorMessage }, { status: 500 });
  }
} 