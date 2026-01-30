"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

import React, { useState, useRef, useEffect } from 'react'
import { IoArrowForward } from "react-icons/io5"
import { Loader2, Mic, MicOff, Volume2, Square, Sparkles } from "lucide-react"
import axios from "axios"
import { Doctor } from "./DoctorsList"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface AddNewSessionProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  preSelectedDoctor?: Doctor | null
}

function AddNewSession({ isOpen, onOpenChange, preSelectedDoctor }: AddNewSessionProps) {
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedDocter, setSuggestedDocter] = useState<Doctor | undefined>(preSelectedDoctor || undefined);
  const [error, setError] = useState<string>();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(preSelectedDoctor || undefined);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string>("")

  // Refs for audio handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)

  const router = useRouter()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Default to Hindi, but will auto-detect

        recognition.onresult = (event: any) => {
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

          if (finalTranscript) {
            const newText = note + ' ' + finalTranscript;
            setNote(newText.trim());
            setTranscript(finalTranscript);

            // Auto-suggest doctor after getting meaningful speech (>10 characters)
            if (newText.trim().length > 10) {
              setTimeout(() => {
                OnClickNext();
              }, 1000); // Small delay to let user see the transcription
            }
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
            setError(`Voice recognition error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Voice recording functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const { transcript } = await response.json();
        const newText = note + ' ' + transcript;
        setNote(newText.trim());

        // Auto-suggest doctor if we have enough content (increased threshold)
        if (newText.trim().length > 15) {
          setTimeout(() => {
            OnClickNext();
          }, 1500); // Increased delay for better UX
        }
      } else {
        setError('Voice transcription failed. Please try typing instead.');
      }
    } catch (error) {
      setError('Transcription failed. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const OnClickNext = async () => {
    if (!note || note.trim().length < 5) {
      setError("⚠️ Please describe your symptoms in more detail (minimum 5 characters)");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/suggest-docters", {
        notes: note.trim()
      });
      const data = response.data;
      setSuggestedDocter(data);
      setSelectedDoctor(data); // Auto-select the recommended doctor

      // Auto-start consultation after brief delay for better UX
      setTimeout(() => {
        handleStartConsultation(data);
      }, 1000);

    } catch (error) {
      console.error("❌ Error fetching doctor suggestion:", error);
      setError("❌ Unable to analyze symptoms. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartConsultation = async (doctorOverride?: Doctor) => {
    setIsLoading(true)
    // Use the override if provided (fixes stale state in async flows), otherwise use state
    const doctorToSend = doctorOverride || selectedDoctor;

    console.log("Starting consultation with doctor:", doctorToSend?.specialist || "Default");

    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: doctorToSend
    })
    console.log(result.data)
    if (result.data.sessionId) {
      console.log("sessionId", result.data.sessionId)
      router.push(`/dashboard/medical-agent/${result.data.sessionId}`)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {!isOpen && (
          <Button variant="outline" className='bg-primary text-white mt-3'>
            + Start a Consultation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{suggestedDocter ? 'Recommended Specialist' : 'Start Consultation'}</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDocter ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold">Describe Your Symptoms</h2>
                <p className="text-sm text-gray-600">Type or speak your symptoms in any language - we'll automatically find the right specialist for you!</p>

                <div className="relative">
                  <Textarea
                    placeholder="Type your symptoms here... Or use voice input buttons →"
                    className="h-[140px] pr-20 text-sm"
                    value={note}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setNote(newValue);
                      // Clear error immediately when user has enough content
                      if (error && newValue.trim().length >= 5) {
                        setError("");
                      }
                    }}
                  />

                  {/* Voice Input Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {/* Live Speech Recognition */}
                    <Button
                      type="button"
                      size="sm"
                      variant={isListening ? "default" : "outline"}
                      onClick={isListening ? stopListening : startListening}
                      className={`p-2 h-10 w-10 ${isListening ? 'bg-green-500 hover:bg-green-600 text-white' : 'hover:bg-green-50'}`}
                      disabled={isTranscribing || isRecording}
                      title="Click and speak directly (real-time)"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    {/* Voice Recording */}
                    <Button
                      type="button"
                      size="sm"
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      className={`p-2 h-10 w-10 ${isRecording ? '' : 'hover:bg-blue-50'}`}
                      disabled={isTranscribing || isListening}
                      title="Record and transcribe"
                    >
                      {isRecording ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Status Indicators */}
                  {(isListening || isRecording || isTranscribing) && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      {isListening && (
                        <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                          <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="font-medium">🎤 Listening... Speak clearly in any language</span>
                        </div>
                      )}
                      {isRecording && (
                        <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                          <div className="relative">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                          <span className="font-medium">🔴 Recording... Click stop when finished</span>
                        </div>
                      )}
                      {isTranscribing && (
                        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="font-medium">⚡ Processing your speech...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Language Support Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Smart Multilingual Voice AI</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">🗣️ Supported Languages:</p>
                      <p className="text-blue-600 dark:text-blue-400">Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, English</p>
                    </div>
                    <div>
                      <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">🎯 AI Features:</p>
                      <p className="text-purple-600 dark:text-purple-400">Auto language detection • Symptom analysis • Specialist matching</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}

                {/* Quick Examples - Only show when textarea is empty */}
                {note.trim().length === 0 && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">💡 Example symptoms to try:</p>
                    <div className="grid grid-cols-1 gap-1 text-xs text-gray-500 dark:text-gray-500">
                      <p>• "सिरदर्द और बुखार है, 3 दिन से" (Hindi - Headache & fever)</p>
                      <p>• "தலைவலி மற்றும் காய்ச்சல் இருக்கு" (Tamil - Headache & fever)</p>
                      <p>• "Chest pain and difficulty breathing since morning" (English)</p>
                      <p>• "पेट दुखी आहे आणि उलटी होत आहे" (Marathi - Stomach pain & vomiting)</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* AI Analysis Results */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-green-700 dark:text-green-300">AI Analysis Complete</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Based on your symptoms, we recommend consulting with a <strong>{suggestedDocter?.specialist}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mt-5">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      🎯 Recommended Specialist
                    </h2>
                    <div
                      className={`border-2 rounded-2xl hover:border-primary/40 p-6 cursor-pointer transition-all ${selectedDoctor ? "border-primary bg-primary/5" : "border-gray-200"
                        } flex flex-col items-center justify-center text-center space-y-3`}
                      onClick={() => setSelectedDoctor(suggestedDocter)}
                    >
                      <div className="relative">
                        <Image
                          src={suggestedDocter.image}
                          alt={suggestedDocter.specialist || "Doctor"}
                          width={80}
                          height={80}
                          className='rounded-full w-[60px] h-[60px] object-cover border-2 border-primary/20'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/medical-assistance.png";
                          }}
                        />
                        {selectedDoctor && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-primary">{suggestedDocter.specialist}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                          {suggestedDocter.description}
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">AI Recommended</span>
                      </div>
                    </div>
                  </div>

                  {/* Your Symptoms Summary */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      📋 Your Symptoms
                    </h2>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {note}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>✅ Language detected and analyzed</p>
                      <p>✅ Symptoms categorized</p>
                      <p>✅ Specialist matched</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-gray-900 text-white mt-2">
              Cancel
            </Button>
          </DialogClose>
          {!suggestedDocter ? (
            <Button
              variant="outline"
              className={`mt-2 flex items-center gap-2 min-w-[140px] transition-all duration-300 ${(!note?.trim() || note.trim().length < 5)
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                : isLoading
                  ? 'bg-blue-500 text-white'
                  : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 hover:shadow-lg transform hover:scale-105'
                }`}
              disabled={!note?.trim() || note.trim().length < 5 || isLoading || isListening || isRecording || isTranscribing}
              onClick={OnClickNext}
              title={(!note?.trim() || note.trim().length < 5) ? "Please describe your symptoms first" : "Click to find the right specialist for you"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  🔍 Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  🔍 Find My Specialist
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white mt-2 flex items-center gap-2 min-w-[160px] transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => handleStartConsultation()}
              title="Start your AI-powered medical consultation"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  🚀 Starting...
                </>
              ) : (
                <>
                  <span>🏥</span>
                  Start Consultation
                  <IoArrowForward className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewSession

