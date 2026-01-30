import { NextRequest, NextResponse } from "next/server";
import { detectLanguage } from "@/lib/utils/LanguageDetector";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const languageDetection = detectLanguage(text);
    
    return NextResponse.json({
      input: text,
      detectedLanguage: languageDetection.detectedLanguage,
      confidence: languageDetection.confidence,
      isIndianLanguage: languageDetection.isIndianLanguage,
      languageMetadata: languageDetection.languageMetadata
    });
    
  } catch (error) {
    console.error("Error in language test:", error);
    return NextResponse.json({ error: "Failed to test language" }, { status: 500 });
  }
}