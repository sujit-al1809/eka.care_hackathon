"use client"
import { useEffect, useRef, useState } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

interface AudioProcessorProps {
  isCallActive: boolean;
  isListening: boolean;
  onTranscriptReceived: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  language?: string; // Language code like 'hi-IN', 'ta-IN', 'te-IN', etc.
}

// Supported Indian languages for Web Speech API
const INDIAN_LANGUAGES = {
  'hi-IN': 'Hindi',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'mr-IN': 'Marathi',
  'bn-IN': 'Bengali',
  'gu-IN': 'Gujarati',
  'pa-IN': 'Punjabi',
  'ur-IN': 'Urdu',
  'en-IN': 'English (India)',
};

const AudioProcessor = ({
  isCallActive,
  isListening,
  onTranscriptReceived,
  onError,
  language = 'hi-IN' // Default to Hindi
}: AudioProcessorProps) => {

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRestartTimeRef = useRef<number>(0);

  // Initialize Web Speech API
  useEffect(() => {
    if (isCallActive) {
      initializeSpeechRecognition();
    }

    return () => {
      cleanupSpeechRecognition();
    };
  }, [isCallActive, language]);

  // Handle listening state changes
  useEffect(() => {
    if (isCallActive && recognitionRef.current) {
      if (isListening && !isRecognitionActive) {
        console.log('Starting recognition due to listening state change');
        startRecognition();
      } else if (!isListening && isRecognitionActive) {
        console.log('Stopping recognition due to listening state change');
        stopRecognition();
      }
    }
  }, [isListening, isCallActive, isRecognitionActive]);

  const initializeSpeechRecognition = () => {
    try {
      const windowWithSpeech = window as unknown as WindowWithSpeechRecognition;
      const SpeechRecognitionClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        onError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
        return;
      }

      const recognition = new SpeechRecognitionClass();
      
      // Configure for Indian language support
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language; // Supports all Indian languages

      recognition.onstart = () => {
        console.log(`Speech recognition started with language: ${language} (${INDIAN_LANGUAGES[language as keyof typeof INDIAN_LANGUAGES] || 'Unknown'})`);
        setIsRecognitionActive(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Send final transcript
        if (finalTranscript) {
          onTranscriptReceived(finalTranscript, true);
        }
        
        // Send interim transcript for real-time feedback
        if (interimTranscript) {
          onTranscriptReceived(interimTranscript, false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Don't log "no-speech" as an error since it's normal during silence
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
        
        if (event.error === 'no-speech') {
          // No speech detected, restart recognition quietly
          console.log('No speech detected, restarting recognition...');
          if (isListening && isCallActive) {
            restartRecognition();
          }
        } else if (event.error === 'audio-capture') {
          onError("माइक्रोफोन एक्सेस करने में समस्या हुई। कृपया अनुमति जांचें। (Microphone access error. Please check permissions.)");
        } else if (event.error === 'not-allowed') {
          onError("माइक्रोफोन की अनुमति नहीं दी गई। (Microphone permission denied.)");
        } else if (event.error === 'network') {
          console.log('Network error in speech recognition, restarting...');
          if (isListening && isCallActive) {
            restartRecognition();
          }
        } else if (event.error !== 'aborted') {
          onError(`Speech recognition error: ${event.error}`);
        }
        
        setIsRecognitionActive(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsRecognitionActive(false);
        
        // Auto-restart if still listening and call is active
        if (isListening && isCallActive) {
          console.log('Auto-restarting recognition after end event');
          // Add a small delay to prevent rapid restart attempts
          setTimeout(() => {
            if (isListening && isCallActive && !isRecognitionActive) {
              restartRecognition();
            }
          }, 200);
        }
      };

      recognitionRef.current = recognition;
      console.log('Speech recognition initialized for Indian languages');

    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      onError("Failed to initialize speech recognition.");
    }
  };

  const startRecognition = () => {
    if (recognitionRef.current && !isRecognitionActive) {
      try {
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
      } catch (error: any) {
        console.error('Error starting recognition:', error);
        if (error.message && error.message.includes('already started')) {
          console.log('Recognition already started, updating state');
          setIsRecognitionActive(true);
        } else {
          // For other errors, try to reset and restart
          setTimeout(() => {
            if (isListening && isCallActive && !isRecognitionActive) {
              restartRecognition();
            }
          }, 500);
        }
      }
    } else if (isRecognitionActive) {
      console.log('Recognition already active, skipping start');
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognitionActive) {
      try {
        console.log('Stopping speech recognition...');
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
        // Force state reset even if stop fails
        setIsRecognitionActive(false);
      }
    }
  };

  const restartRecognition = () => {
    // Throttle restart attempts to prevent spam
    const now = Date.now();
    if (now - lastRestartTimeRef.current < 1000) {
      console.log('Restart throttled, too frequent attempts');
      return;
    }
    lastRestartTimeRef.current = now;

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    // First stop any existing recognition
    if (recognitionRef.current && isRecognitionActive) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore stop errors during restart
      }
      setIsRecognitionActive(false);
    }

    restartTimeoutRef.current = setTimeout(() => {
      if (isListening && isCallActive && recognitionRef.current && !isRecognitionActive) {
        try {
          console.log('Restarting speech recognition...');
          recognitionRef.current.start();
        } catch (error: any) {
          if (error.message && error.message.includes('already started')) {
            console.log('Recognition already started during restart, updating state');
            setIsRecognitionActive(true);
          } else {
            console.log('Failed to restart recognition, will retry later');
            // Don't show error to user for restart failures, just log it
          }
        }
      }
    }, 300); // Increased delay to 300ms to prevent rapid restart attempts
  };

  const cleanupSpeechRecognition = () => {
    console.log('Cleaning up speech recognition...');
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        // First try to stop gracefully
        if (isRecognitionActive) {
          recognitionRef.current.stop();
        }
        // Then abort to ensure it's completely stopped
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.abort();
            recognitionRef.current = null;
          }
        }, 100);
      } catch (error) {
        console.error('Error during cleanup:', error);
        recognitionRef.current = null;
      }
    }

    setIsRecognitionActive(false);
  };

  return null;
};

export default AudioProcessor; 