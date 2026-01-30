import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    console.log("Transcription API called")

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      console.log("No audio file provided")
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.log("Gemini API key is not configured, use browser speech recognition")
      return NextResponse.json({
        useBrowserSpeechRecognition: true,
        supportedLanguages: [
          'hi-IN', // Hindi
          'ta-IN', // Tamil
          'te-IN', // Telugu
          'kn-IN', // Kannada
          'ml-IN', // Malayalam
          'mr-IN', // Marathi
          'bn-IN', // Bengali
          'gu-IN', // Gujarati
          'pa-IN', // Punjabi
          'ur-IN', // Urdu
          'en-IN', // English (India)
        ],
        message: 'Use browser Web Speech API for real-time transcription with Indian language support'
      })
    }

    // Use Gemini for audio transcription with Indian language support
    try {
      const audioBytes = await audioFile.arrayBuffer()
      const base64Audio = Buffer.from(audioBytes).toString('base64')
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: audioFile.type || 'audio/wav',
            data: base64Audio
          }
        },
        { text: `Transcribe this audio. The speaker may be using any Indian language (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Urdu) or English. Return ONLY the transcribed text, nothing else.` }
      ]);

      const transcript = result.response.text();
      
      // Check if transcript is empty or just whitespace
      if (!transcript || transcript.trim().length === 0) {
        console.log("Empty transcription result, fallback to browser")
        return NextResponse.json({
          useBrowserSpeechRecognition: true,
          error: 'Empty transcription, use browser speech recognition'
        })
      }
      
      console.log("Gemini transcription completed:", transcript)
      
      return NextResponse.json({ transcript: transcript.trim() })
    } catch (geminiError: any) {
      console.error("Gemini transcription error:", geminiError)
      
      // Check if it's a rate limit error (429)
      if (geminiError?.status === 429 || geminiError?.message?.includes('429') || geminiError?.message?.includes('Resource exhausted')) {
        console.log("Rate limit hit, fallback to browser speech recognition")
        return NextResponse.json({
          useBrowserSpeechRecognition: true,
          error: 'Rate limit exceeded. Please wait a moment and try again, or use browser speech recognition.',
          rateLimitError: true
        })
      }
      
      return NextResponse.json({
        useBrowserSpeechRecognition: true,
        error: 'Gemini transcription failed, use browser speech recognition'
      })
    }

  } catch (error) {
    console.error('Error in transcription API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 