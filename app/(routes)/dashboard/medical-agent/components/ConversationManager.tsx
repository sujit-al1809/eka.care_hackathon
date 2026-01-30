"use client"
import { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import axios from 'axios';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

interface ConversationManagerProps {
  isCallActive: boolean;
  doctorPrompt: string;
  language?: string;
  sessionId?: string;
  onNewMessage: (message: Message) => void;
  onError: (error: string) => void;
  onLanguageDetected?: (language: string) => void;
}

export interface ConversationManagerRef {
  handleTranscript: (transcript: string, isFinal: boolean) => void;
  setImage: (image: string | null) => void;
}

// Initial greeting in multiple languages
const INITIAL_GREETINGS: Record<string, string> = {
  'hi-IN': "नमस्ते! मैं आपका AI मेडिकल असिस्टेंट हूं। कृपया अपना नाम, उम्र और समस्या बताएं।",
  'ta-IN': "வணக்கம்! நான் உங்கள் AI மருத்துவ உதவியாளர். உங்கள் பெயர், வயது மற்றும் பிரச்சனையைக் கூறுங்கள்.",
  'te-IN': "నమస్కారం! నేను మీ AI మెడికల్ అసిస్టెంట్. దయచేసి మీ పేరు, వయస్సు మరియు సమస్యను చెప్పండి.",
  'kn-IN': "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು, ವಯಸ್ಸು ಮತ್ತು ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ.",
  'ml-IN': "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI മെഡിക്കൽ അസിസ്റ്റന്റാണ്. നിങ്ങളുടെ പേര്, പ്രായം, പ്രശ്നം പറയൂ.",
  'mr-IN': "नमस्कार! मी तुमचा AI वैद्यकीय सहाय्यक आहे. कृपया तुमचे नाव, वय आणि समस्या सांगा.",
  'bn-IN': "নমস্কার! আমি আপনার AI মেডিকেল সহকারী। আপনার নাম, বয়স এবং সমস্যা বলুন।",
  'gu-IN': "નમસ્તે! હું તમારો AI મેડિકલ આસિસ્ટન્ટ છું. કૃપા કરીને તમારું નામ, ઉંમર અને સમસ્યા જણાવો.",
  'pa-IN': "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਮੈਡੀਕਲ ਸਹਾਇਕ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ, ਉਮਰ ਅਤੇ ਸਮੱਸਿਆ ਦੱਸੋ।",
  'en-IN': "Hello! I'm your AI medical assistant. Please tell me your name, age, and what problem you're experiencing."
};

const ConversationManager = forwardRef<ConversationManagerRef, ConversationManagerProps>(
  ({ isCallActive, doctorPrompt, language = 'en-IN', sessionId, onNewMessage, onError, onLanguageDetected }, ref) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const lastTranscriptRef = useRef<string>("");
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const processingTranscriptRef = useRef<boolean>(false);
    const detectedLanguageRef = useRef<string | null>(null);
    const selectedImageRef = useRef<string | null>(null);

    // Get greeting based on selected language
    const getGreeting = useCallback((lang: string) => {
      return INITIAL_GREETINGS[lang] || INITIAL_GREETINGS['en-IN'];
    }, []);

    useEffect(() => {
      if (isCallActive) {
        // Use selected language for greeting
        const initialMessage = {
          role: 'assistant' as const,
          content: getGreeting(language),
          timestamp: Date.now()
        };

        setMessages([initialMessage]);
        onNewMessage(initialMessage);
      } else {
        setMessages([]);
        lastTranscriptRef.current = "";

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }
    }, [isCallActive, onNewMessage]);

    const handleTranscript = (transcript: string, isFinal: boolean) => {
      if (!transcript || transcript.trim() === "" || processingTranscriptRef.current) return;

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      if (isFinal) {
        processTranscript(transcript);
      } else {
        // Increased timeout to prevent interruption while user thinks
        silenceTimeoutRef.current = setTimeout(() => {
          if (transcript && transcript.trim() !== "") {
            console.log("Silence detected, processing transcript:", transcript);
            processTranscript(transcript);
          }
        }, 1000); // Reduced to 1s for faster response

      }
    };

    const processTranscript = async (transcript: string) => {
      if (transcript.trim() === lastTranscriptRef.current.trim() || processingTranscriptRef.current) return;

      processingTranscriptRef.current = true;
      lastTranscriptRef.current = transcript;

      const userMessage: Message = {
        role: 'user',
        content: transcript,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, userMessage]);
      onNewMessage(userMessage);

      // Capture image and clear ref immediately
      const currentImage = selectedImageRef.current;
      selectedImageRef.current = null; // Clear image so it's not sent again

      try {
        const conversationHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        conversationHistory.push({
          role: 'user',
          content: transcript
        });

        // Enhanced prompt for native language response
        const enhancedPrompt = doctorPrompt || `You are a helpful AI medical assistant. 
CRITICAL CHECK: Detect the language of the last user message.
MANDATORY: Respond ONLY in that EXACT same language and script.

RULES for Indian Languages:
1. Hindi: Use ONLY Devanagari script (e.g. "नमस्ते"). NO English characters.
2. Tamil: Use ONLY Tamil script (e.g. "வணக்கம்"). NO English characters.
3. Telugu: Use ONLY Telugu script. NO English characters.
4. Marathi: Use ONLY Marathi (Devanagari). NO English characters.

ABSOLUTELY FORBIDDEN:
- Do NOT use English words like "Okay", "Doctor", "Medicine". Translate them.
- Do NOT use Roman/Latin script for Indian languages (No Hinglish).
- Do NOT add "Translation:" or "English:" notes.

Keep responses conversational, empathetic, and short (2-3 sentences).`;

        const response = await axios.post('/api/chat', {
          messages: conversationHistory,
          doctorPrompt: enhancedPrompt,
          image: currentImage // Send image to backend
        }, { timeout: 20000 }); // 20s timeout to prevent hanging

        if (response.data && response.data.content) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: response.data.content,
            timestamp: Date.now()
          };

          setMessages(prev => [...prev, assistantMessage]);
          onNewMessage(assistantMessage);

          // Handle detected language from AI response
          if (response.data.agentData?.detectedLanguage && !detectedLanguageRef.current) {
            detectedLanguageRef.current = response.data.agentData.detectedLanguage;

            // Notify parent component
            if (onLanguageDetected) {
              onLanguageDetected(response.data.agentData.detectedLanguage);
            }

            // Save detected language to session
            if (sessionId) {
              try {
                await axios.put('/api/session-chat', {
                  sessionId,
                  detectedLanguage: response.data.agentData.detectedLanguage
                });
                console.log(`🌐 Saved detected language: ${response.data.agentData.detectedLanguage}`);
              } catch (err) {
                console.error('Failed to save detected language:', err);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error sending to AI agent:", error);
        onError("Error communicating with AI. Please try again.");

        // Fallback in Hindi
        const fallbackMessage: Message = {
          role: 'assistant',
          content: "क्षमा करें, कृपया दोबारा कहें। (Sorry, please try again.)",
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, fallbackMessage]);
        onNewMessage(fallbackMessage);
      } finally {
        processingTranscriptRef.current = false;
      }
    };

    useImperativeHandle(ref, () => ({
      handleTranscript,
      setImage: (image: string | null) => {
        selectedImageRef.current = image;
      }
    }));

    return null;
  }
);

ConversationManager.displayName = 'ConversationManager';

export default ConversationManager; 