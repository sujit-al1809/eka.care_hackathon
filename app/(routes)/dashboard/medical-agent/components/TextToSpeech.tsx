"use client"
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface TextToSpeechProps {
  text: string;
  voiceId?: string;
  doctorId?: number;
  language?: string;
  onSpeakingStart: () => void;
  onSpeakingEnd: () => void;
  onError: (error: string) => void;
}

export interface TextToSpeechRef {
  stopSpeaking: () => void;
}

// Auto-detect language from text script
const detectLanguage = (text: string): string => {
  const hindiRegex = /[\u0900-\u097F]/;
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const teluguRegex = /[\u0C00-\u0C7F]/;
  const kannadaRegex = /[\u0C80-\u0CFF]/;
  const malayalamRegex = /[\u0D00-\u0D7F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const punjabiRegex = /[\u0A00-\u0A7F]/;

  if (hindiRegex.test(text)) return "hi-IN";
  if (tamilRegex.test(text)) return "ta-IN";
  if (teluguRegex.test(text)) return "te-IN";
  if (kannadaRegex.test(text)) return "kn-IN";
  if (malayalamRegex.test(text)) return "ml-IN";
  if (bengaliRegex.test(text)) return "bn-IN";
  if (gujaratiRegex.test(text)) return "gu-IN";
  if (punjabiRegex.test(text)) return "pa-IN";
  
  return "en-IN";
};

const TextToSpeech = forwardRef<TextToSpeechRef, TextToSpeechProps>(({
  text,
  language,
  onSpeakingStart,
  onSpeakingEnd,
  onError
}, ref) => {
  const [pendingText, setPendingText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const previousTextRef = useRef<string>("");
  const speechSynthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useImperativeHandle(ref, () => ({
    stopSpeaking: () => {
      stopSpeaking();
    }
  }));

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      setAvailableVoices(voices);
      
      // Log Indian voices for debugging
      const indianVoices = voices.filter(v => v.lang.includes('IN') || v.lang.includes('hi') || v.lang.includes('ta'));
      if (indianVoices.length > 0) {
        console.log("Available Indian TTS voices:", indianVoices.map(v => `${v.name} (${v.lang})`));
      }
    };

    loadVoices();
    
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (text && text.trim() !== '' && text !== previousTextRef.current) {
      previousTextRef.current = text;

      if (isProcessing) {
        setPendingText(text);
      } else {
        processText(text);
      }
    }
  }, [text]);

  useEffect(() => {
    if (!isProcessing && pendingText) {
      const textToProcess = pendingText;
      setPendingText("");
      processText(textToProcess);
    }
  }, [isProcessing, pendingText]);

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (speechSynthesisUtteranceRef.current) {
      speechSynthesisUtteranceRef.current = null;
    }

    setIsProcessing(false);
    setPendingText("");
  };

  const findBestVoice = (langCode: string): SpeechSynthesisVoice | null => {
    // Try exact match
    let voice = availableVoices.find(v => v.lang === langCode);
    
    // Try partial match
    if (!voice) {
      const langPrefix = langCode.split('-')[0];
      voice = availableVoices.find(v => v.lang.startsWith(langPrefix));
    }
    
    // Fallback to any Indian voice
    if (!voice) {
      voice = availableVoices.find(v => v.lang.includes('IN'));
    }
    
    // Fallback to default
    if (!voice && availableVoices.length > 0) {
      voice = availableVoices.find(v => v.default) || availableVoices[0];
    }
    
    return voice || null;
  };

  const processText = async (textToSpeak: string) => {
    if (!textToSpeak || textToSpeak.trim() === '') return;

    stopSpeaking();
    setIsProcessing(true);
    onSpeakingStart();

    await playBrowserTTS(textToSpeak);
  };

  const playBrowserTTS = (textToSpeak: string): Promise<void> => {
    const detectedLang = language || detectLanguage(textToSpeak);
    console.log(`Browser TTS - Language: ${detectedLang}, Text length: ${textToSpeak.length}`);

    return new Promise((resolve) => {
      try {
        if (!('speechSynthesis' in window)) {
          console.warn("SpeechSynthesis not supported");
          onError("Text-to-speech is not supported in this browser");
          setIsProcessing(false);
          onSpeakingEnd();
          resolve();
          return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        speechSynthesisUtteranceRef.current = utterance;

        // Set language
        utterance.lang = detectedLang;
        
        // Find and set voice
        const voice = findBestVoice(detectedLang);
        if (voice) {
          utterance.voice = voice;
          console.log(`Using voice: ${voice.name} (${voice.lang})`);
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          console.log("TTS started speaking");
        };

        utterance.onend = () => {
          console.log("TTS finished speaking");
          setIsProcessing(false);
          onSpeakingEnd();
          resolve();
        };

        utterance.onerror = (event) => {
          // Don't treat 'interrupted' as an error (happens when we cancel)
          if (event.error !== 'interrupted' && event.error !== 'canceled') {
            console.warn("TTS error:", event.error);
          }
          setIsProcessing(false);
          onSpeakingEnd();
          resolve();
        };

        // Small delay for Chrome compatibility
        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.error("Error speaking:", e);
            setIsProcessing(false);
            onSpeakingEnd();
            resolve();
          }
        }, 100);

      } catch (error) {
        console.error("TTS error:", error);
        setIsProcessing(false);
        onSpeakingEnd();
        resolve();
      }
    });
  };

  return null;
});

TextToSpeech.displayName = 'TextToSpeech';

export default TextToSpeech;
