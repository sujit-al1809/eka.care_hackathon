"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Circle, PhoneCall, StopCircle, FileText, Globe, Volume2, Mic, Activity, Clock, AlertCircle, History, Camera, X, Send } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Doctor } from '../../_components/DoctorsList'
import AudioProcessor from '../components/AudioProcessor'
import TextToSpeech, { TextToSpeechRef } from '../components/TextToSpeech'
import ConversationDisplay from '../components/ConversationDisplay'
import ConversationManager, { Message, ConversationManagerRef } from '../components/ConversationManager'
import VoiceRecordButton from '../components/VoiceRecordButton'
import TranscriptionLoading from '../components/TranscriptionLoading'
import { convertAudioToText } from '../services/speechToText'
// import VadAudioProcessor from '../components/VadAudioProcessor' // DISABLE VAD
import { Switch } from '@/components/ui/switch'

// Supported Indian languages with flag emojis
const INDIAN_LANGUAGES = [
  { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

type Report = {
  session_info?: {
    doctor: string;
    agent: string;
    consulted_on: string;
    user: string;
  };
  patient_language?: string;
  chief_complaint?: {
    english: string;
    native: string;
  };
  summary?: {
    english: string;
    native: string;
  };
  symptoms?: {
    reported: string[];
    duration: string;
    severity: string;
    additional_details: string[];
  };
  duration_and_severity?: {
    duration: string;
    severity_level: string;
    onset: string;
    progression: string;
  };
  medications_mentioned?: {
    current_medications: string[];
    suggested_medications: string[];
    allergies: string[];
  };
  recommendations?: {
    english: string[];
    native: string[];
    lifestyle: string[];
    follow_up: string[];
  };
  risk_assessment?: {
    risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    risk_score: number;
    risk_factors: string[];
    emergency_indicators: string[];
  };
  clinical_assessment?: {
    possible_conditions: string[];
    differential_diagnosis: string[];
    specialist_recommended: string;
    urgency: string;
  };
  follow_up?: {
    needed: boolean;
    timeframe: string;
    warning_signs: string[];
    emergency_contact: string;
  };
  additional_info?: {
    generated_at: string;
    consultation_duration: string;
    language_used: string;
  };
  // Backward compatibility
  summary_english?: string;
  summary_native?: string;
  symptoms_reported?: string[];
  severity_assessment?: string;
  risk_level?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  risk_score?: number;
  possible_conditions?: string[];
  recommendations_old?: string[];
  recommendations_native?: string[];
  specialist_recommended?: string;
  follow_up_needed?: boolean;
  emergency_flag?: boolean;
  consultation_duration?: number;
  generated_at?: string;
};

type Session = {
  id: number
  notes: string
  sessionId: string
  report: Report | null
  selectedDocter: Doctor | null
  createdOn: string
  conversation?: Message[]
}

function MedicalVoiceAgent() {
  const { sesstionId } = useParams()


  const [session, setSession] = useState<Session>()
  const [doctorImage, setDoctorImage] = useState<string | null>(null)
  const [doctorSpecialist, setDoctorSpecialist] = useState<string>("")
  const [doctorPrompt, setDoctorPrompt] = useState<string>("")
  const [doctorId, setDoctorId] = useState<number | undefined>(undefined)

  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [userCaption, setUserCaption] = useState<string>("")
  const [assistantCaption, setAssistantCaption] = useState<string>("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentAssistantText, setCurrentAssistantText] = useState<string>("")
  const [textInput, setTextInput] = useState<string>("")

  // Image handling for Dermatologist
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size too large. Please select an image under 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Pass image to ConversationManager when available
  useEffect(() => {
    if (conversationManagerRef.current && selectedImage) {
      conversationManagerRef.current.setImage(selectedImage);
    }
  }, [selectedImage]);

  // New state for language selection and report
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-IN')
  const [showReport, setShowReport] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const [showDebugTools, setShowDebugTools] = useState(false)
  const [consultationHistory, setConsultationHistory] = useState<Report[]>([])
  const [showHistory, setShowHistory] = useState(false)


  // const [isVadEnabled, setIsVadEnabled] = useState(true) // DISABLE VAD

  // Get current language info
  const currentLanguage = useMemo(() =>
    INDIAN_LANGUAGES.find(l => l.code === selectedLanguage) || INDIAN_LANGUAGES[0],
    [selectedLanguage]
  );


  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const conversationManagerRef = useRef<ConversationManagerRef>(null)

  const [isTranscribing, setIsTranscribing] = useState(false)

  const audioElementRef = useRef<HTMLAudioElement | null>(null);


  const textToSpeechRef = useRef<TextToSpeechRef>(null);

  useEffect(() => {
    if (sesstionId) {
      getSessionDetails()
      loadConsultationHistory()
    }

    return () => {
      stopCall()
    }
  }, [sesstionId])

  const loadConsultationHistory = async () => {
    try {
      const savedHistory = localStorage.getItem('consultation_history')
      if (savedHistory) {
        setConsultationHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error('Error loading consultation history:', error)
    }
  }

  const saveToHistory = (newReport: Report) => {
    try {
      const updatedHistory = [newReport, ...consultationHistory].slice(0, 10) // Keep last 10 consultations
      setConsultationHistory(updatedHistory)
      localStorage.setItem('consultation_history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Error saving to history:', error)
    }
  }

  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isCallActive])

  const getSessionDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get(`/api/session-chat?sessionId=${sesstionId}`)
      setSession(response.data)

      if (response.data?.selectedDocter) {
        const doctorData = response.data.selectedDocter
        setDoctorImage(doctorData.image || null)
        setDoctorSpecialist(doctorData.specialist || "AI Medical Agent")
        setDoctorPrompt(doctorData.agentPrompt || "")
        setDoctorId(doctorData.id)

        console.log(`Doctor ID: ${doctorData.id}, Voice ID: ${doctorData.voiceId || 'default'}`)
      }

      setIsLoading(false)
    } catch (error: unknown) {
      console.error("Error fetching session details:", error)
      setError("Failed to load session details. Using default settings.")
      setIsLoading(false)

      setDoctorSpecialist("AI Medical Agent")
      setDoctorImage("/doctor1.png")
      setDoctorId(1)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startCall = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setIsCallActive(true)


      setIsLoading(false)
    } catch (error: unknown) {
      console.error("Error starting call:", error)
      setError("Could not start call. Please try again.")
      setIsLoading(false)
    }
  }


  const stopCall = async () => {
    console.log("Stopping call and generating report...")

    setIsCallActive(false)

    if (textToSpeechRef.current) {
      console.log("Stopping TTS speech...")
      textToSpeechRef.current.stopSpeaking();
    }

    if (audioElementRef.current) {
      console.log("Stopping audio playback...")
      audioElementRef.current.pause()
      audioElementRef.current.src = ''
    }

    if (window.speechSynthesis) {
      console.log("Cancelling speech synthesis...")
      window.speechSynthesis.cancel()
    }

    if (timerRef.current) {
      console.log("Clearing timer...")
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsListening(false)
    setIsSpeaking(false)
    setIsTranscribing(false)
    setUserCaption("")
    setAssistantCaption("")
    setCurrentAssistantText("")

    // Generate report after call ends if there are messages
    if (messages.length > 1) {
      await generateReport()
    }

    console.log("Call stopped and report generated")
  }

  const generateReport = async () => {
    try {
      setIsGeneratingReport(true)

      const response = await axios.post('/api/generate-report', {
        sessionId: sesstionId,
        messages: messages,
        consultationDuration: callDuration
      })

      if (response.data?.report) {
        const reportWithRisk = {
          ...response.data.report,
          consultation_duration: callDuration,
          generated_at: new Date().toISOString()
        }
        setReport(reportWithRisk)
        setShowReport(true)
        saveToHistory(reportWithRisk) // Save to history
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setError("Failed to generate report")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleTranscript = useCallback((transcript: string, isFinal: boolean) => {
    setUserCaption(transcript);

    if (conversationManagerRef.current) {
      conversationManagerRef.current.handleTranscript(transcript, isFinal);
    }
  }, []);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const exists = prev.some(m =>
        m.role === message.role &&
        m.content === message.content &&
        Math.abs(m.timestamp - message.timestamp) < 1000
      );

      if (exists) return prev;
      return [...prev, message];
    });

    if (message.role === 'assistant') {
      setAssistantCaption(message.content);
      setCurrentAssistantText(message.content);

      console.log(`AI response received (${message.content.length} chars). Sending to TTS...`);
    }
  }, []);

  const handleSpeakingStart = useCallback(() => {
    console.log("AI speaking started");
    setIsSpeaking(true);
    setIsListening(false);
  }, []);

  const handleSpeakingEnd = useCallback(() => {
    console.log("AI speaking ended");
    setIsSpeaking(false);

    setTimeout(() => {
      if (isCallActive) {
        setIsListening(true);
      }
    }, 500);
  }, [isCallActive]);


  const handleError = useCallback((errorMessage: string) => {
    console.error(errorMessage);
    setError(errorMessage);
  }, []);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true)
      setError(null)

      console.log("Processing recorded audio...")


      const transcript = await convertAudioToText(audioBlob)

      console.log("Transcription result:", transcript)

      setUserCaption(transcript)

      if (conversationManagerRef.current) {
        conversationManagerRef.current.handleTranscript(transcript, true)
      }
    } catch (error: unknown) {
      console.error("Error processing recording:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Recording error: ${errorMessage}`)
    } finally {
      setIsTranscribing(false)
    }
  }

  /* Voice Record Button Restored */
  {
    isCallActive && (
      <div className="flex flex-col items-center gap-2">
        <VoiceRecordButton
          isCallActive={isCallActive}
          onRecordingComplete={handleRecordingComplete}
          onTranscript={(text, isFinal) => handleTranscript(text, isFinal)}
          language={selectedLanguage}
        />
        <p className='text-xs text-gray-400'>Hold to record your message</p>
      </div>
    )
  }

  return (
    <div className='min-h-[80vh] p-6 border-2 rounded-2xl bg-gradient-to-br from-background via-secondary/30 to-background shadow-xl'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className={`p-2 rounded-full ${isCallActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {isCallActive ? (
              <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className={`font-semibold ${isCallActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              {isCallActive ? 'Connected' : 'Ready to Connect'}
            </p>
            <p className='text-xs text-gray-400'>
              {isCallActive ? 'Voice consultation active' : 'Start a call to begin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* VAD Toggle - DISABLED and HIDDEN since VAD is now mandatory */}

          {/*
           <div className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <Mic className={`w-3.5 h-3.5 ${isVadEnabled ? 'text-primary' : 'text-gray-400'}`} />
              <span className="text-xs font-medium hidden sm:inline-block">Hands-free</span>
            </div>
            <Switch
              checked={isVadEnabled}
              onCheckedChange={setIsVadEnabled}
              className="scale-90"
            />
          </div>
          */}
          {/* Enhanced Language Selector */}
          <div className={`flex items-center gap-2 p-2 px-3 rounded-xl border-2 transition-all ${isCallActive
            ? 'border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 opacity-60'
            : 'border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer'
            }`}>
            <Globe className="w-4 h-4 text-primary" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={`bg-transparent border-none outline-none text-sm font-medium cursor-pointer ${isCallActive ? 'cursor-not-allowed' : ''
                }`}
              disabled={isCallActive}
            >
              {INDIAN_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Timer with enhanced styling */}
          <div className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20'>
            <Clock className='w-4 h-4 text-primary' />
            <span className='text-xl font-mono font-bold text-primary'>{formatTime(callDuration)}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex flex-col items-center gap-6 py-8'>
        {/* Doctor Avatar with Status Ring */}
        <div className='relative'>
          <div className={`absolute inset-0 rounded-full ${isCallActive
            ? isSpeaking
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse'
              : isListening
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse'
                : 'bg-gradient-to-r from-primary to-primary/50'
            : 'bg-gray-300 dark:bg-gray-600'
            } p-1`} style={{ transform: 'scale(1.08)' }}></div>

          <div className='relative z-10 rounded-full bg-background p-1'>
            {doctorImage ? (
              <Image
                src={doctorImage}
                alt={doctorSpecialist || "AI Doctor"}
                width={140}
                height={140}
                className='w-[130px] h-[130px] object-cover rounded-full'
              />
            ) : (
              <div className='w-[130px] h-[130px] bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center'>
                <span className='text-4xl'>👨‍⚕️</span>
              </div>
            )}
          </div>

          {/* Speaking/Listening Indicator */}
          {isCallActive && (
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isSpeaking
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : isListening
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                {isSpeaking ? (
                  <><Volume2 className='w-3 h-3' /> Speaking</>
                ) : isListening ? (
                  <><Mic className='w-3 h-3 animate-pulse' /> Listening</>
                ) : (
                  <><Circle className='w-3 h-3' /> Waiting</>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className='text-center space-y-1'>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            {doctorSpecialist || 'AI Doctor'}
          </h2>
          <p className='text-sm text-gray-500 flex items-center justify-center gap-1'>
            <span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
            AI Medical Agent • {currentLanguage.nativeName}
          </p>
        </div>

        {/* Conversation Display - Enhanced */}
        <div className='w-full max-w-2xl'>
          <ConversationDisplay
            messages={messages}
            userCaption={userCaption}
            assistantCaption={assistantCaption}
            isCallActive={isCallActive}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className='flex items-center gap-2 p-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400'>
            <AlertCircle className='w-4 h-4' />
            <span className='text-sm'>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex gap-3">
            {!isCallActive ? (
              <>
                <Button
                  size="lg"
                  className='flex items-center gap-2 px-8 py-6 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 transition-all hover:scale-105'
                  onClick={startCall}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <PhoneCall className='w-5 h-5' /> Start Consultation
                    </>
                  )}
                </Button>
                {report && (
                  <Button
                    size="lg"
                    variant="outline"
                    className='flex items-center gap-2 px-6 py-6 text-lg rounded-xl border-2 hover:bg-primary/5 transition-all'
                    onClick={() => setShowReport(true)}
                  >
                    <FileText className='w-5 h-5' /> View Report
                  </Button>
                )}
                {consultationHistory.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    className='flex items-center gap-2 px-6 py-6 text-lg rounded-xl border-2 hover:bg-primary/5 transition-all'
                    onClick={() => setShowHistory(true)}
                  >
                    <History className='w-5 h-5' /> History ({consultationHistory.length})
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="lg"
                className='flex items-center gap-2 px-8 py-6 text-lg rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 transition-all hover:scale-105'
                onClick={stopCall}
                disabled={isLoading || isGeneratingReport}
              >
                <StopCircle className='w-5 h-5' />
                {isGeneratingReport ? "Generating Report..." : "End Consultation"}
              </Button>
            )}
          </div>

          {/* Voice Record Button Restored in UI */}
          {isCallActive && (
            <div className="flex flex-col items-center gap-2">
              <VoiceRecordButton
                isCallActive={isCallActive}
                onRecordingComplete={handleRecordingComplete}
                onTranscript={(text, isFinal) => handleTranscript(text, isFinal)}
                language={selectedLanguage}
              />
              <p className='text-xs text-gray-400'>Click to speak ({selectedLanguage.split('-')[0]})</p>
            </div>
          )}

          {/* Dermatologist Image Upload Feature */}
          {isCallActive && doctorSpecialist === 'Dermatologist' && (
            <div className="flex flex-col items-center gap-2 mt-2 w-full max-w-xs">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />

              {!selectedImage ? (
                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed border-2 hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Upload Skin Image</span>
                </Button>
              ) : (
                <div className="relative w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="relative w-full h-32 rounded-md overflow-hidden bg-black/10">
                    <img src={selectedImage} alt="Selected skin condition" className="w-full h-full object-contain" />
                  </div>
                  <button
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-center mt-1 text-green-600 font-medium">Image attached to chat</p>
                </div>
              )}
            </div>
          )}
        </div>

        <TranscriptionLoading isLoading={isTranscribing} />
      </div>

      {/* Enhanced Report Modal */}
      {showReport && report && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-xl'>
                  <FileText className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Consultation Report</h2>
                  <p className='text-xs text-gray-500'>{report.generated_at || new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className='rounded-full h-8 w-8 p-0' onClick={() => setShowReport(false)}>✕</Button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                  <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">📝 Summary (English)</h3>
                  <p className="text-sm text-blue-900/80 dark:text-blue-100/80">{report.summary_english}</p>
                </div>

                {report.summary_native && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                    <h3 className="font-semibold mb-2 text-green-700 dark:text-green-300">🌐 Summary (Native)</h3>
                    <p className="text-sm text-green-900/80 dark:text-green-100/80">{report.summary_native}</p>
                  </div>
                )}
              </div>

              {/* Symptoms */}
              {report.symptoms_reported && report.symptoms_reported.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                  <h3 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">🩺 Symptoms Reported</h3>
                  <div className='flex flex-wrap gap-2'>
                    {report.symptoms_reported.map((s, i) => (
                      <span key={i} className='px-3 py-1 bg-amber-200/50 dark:bg-amber-800/50 rounded-full text-sm'>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Assessment Card */}
              {(report.risk_level || report.risk_score) && (
                <div className={`p-4 rounded-xl border ${report.risk_level === 'CRITICAL'
                  ? 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/40 dark:to-red-800/30 border-red-300 dark:border-red-700'
                  : report.risk_level === 'HIGH'
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/40 dark:to-orange-800/30 border-orange-300 dark:border-orange-700'
                    : report.risk_level === 'MODERATE'
                      ? 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/30 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-700'
                      : 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border-green-300 dark:border-green-700'
                  }`}>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className="font-semibold flex items-center gap-2">
                      {report.risk_level === 'CRITICAL' ? '🔴' :
                        report.risk_level === 'HIGH' ? '🟠' :
                          report.risk_level === 'MODERATE' ? '🟡' : '🟢'} Risk Assessment
                    </h3>
                    <div className='flex items-center gap-2'>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${report.risk_level === 'CRITICAL' ? 'bg-red-500 text-white' :
                        report.risk_level === 'HIGH' ? 'bg-orange-500 text-white' :
                          report.risk_level === 'MODERATE' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                        }`}>
                        {report.risk_level}
                      </span>
                      {report.risk_score && (
                        <span className='text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
                          Score: {report.risk_score}/10
                        </span>
                      )}
                    </div>
                  </div>
                  {report.risk_level === 'CRITICAL' && (
                    <div className="flex items-center gap-2 p-2 bg-red-100 dark:bg-red-900/50 rounded text-red-700 dark:text-red-300">
                      <AlertCircle className='w-4 h-4' />
                      <span className="text-sm font-medium">Immediate medical attention required!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Severity Badge */}
              <div className={`p-4 rounded-xl border ${report.severity_assessment === 'high'
                ? 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border-red-200/50 dark:border-red-800/50'
                : report.severity_assessment === 'moderate'
                  ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-800/50'
                  : 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border-green-200/50 dark:border-green-800/50'
                }`}>
                <div className='flex items-center justify-between'>
                  <h3 className="font-semibold">Severity Assessment</h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${report.severity_assessment === 'high'
                    ? 'bg-red-500 text-white'
                    : report.severity_assessment === 'moderate'
                      ? 'bg-orange-500 text-white'
                      : 'bg-green-500 text-white'
                    }`}>
                    {report.severity_assessment?.toUpperCase()}
                  </span>
                </div>
                {report.emergency_flag && (
                  <p className="text-red-600 font-bold mt-2 flex items-center gap-2">
                    <AlertCircle className='w-4 h-4' /> EMERGENCY - Seek immediate medical attention!
                  </p>
                )}
              </div>

              {/* Possible Conditions */}
              {report.possible_conditions && report.possible_conditions.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                  <h3 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🔍 Possible Conditions</h3>
                  <ul className="space-y-2">
                    {report.possible_conditions.map((c, i) => (
                      <li key={i} className='flex items-center gap-2 text-sm'>
                        <span className='w-2 h-2 bg-purple-500 rounded-full'></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {report.recommendations && report.recommendations.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/30 dark:to-teal-800/20 rounded-xl border border-teal-200/50 dark:border-teal-800/50">
                  <h3 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">💡 Recommendations</h3>
                  <ul className="space-y-2">
                    {report.recommendations.map((r, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm'>
                        <span className='mt-1.5 w-2 h-2 bg-teal-500 rounded-full flex-shrink-0'></span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specialist Card */}
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
                <h3 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300">👨‍⚕️ Recommended Specialist</h3>
                <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">{report.specialist_recommended}</p>
                {report.follow_up_needed && (
                  <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-1 flex items-center gap-1">
                    <Clock className='w-3 h-3' /> Follow-up consultation recommended
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-900/50 flex justify-end">
              <Button onClick={() => setShowReport(false)} className='px-6'>Close Report</Button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* History Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary/10 rounded-xl'>
                  <Clock className='w-6 h-6 text-primary' />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Consultation History</h2>
                  <p className='text-xs text-gray-500'>{consultationHistory.length} previous consultations</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className='rounded-full h-8 w-8 p-0' onClick={() => setShowHistory(false)}>✕</Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              {consultationHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className='w-16 h-16 mx-auto mb-4 opacity-30' />
                  <p>No consultation history available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultationHistory.map((hist, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className='flex items-center gap-3'>
                          <div className={`w-3 h-3 rounded-full ${hist.risk_level === 'CRITICAL' ? 'bg-red-500' :
                            hist.risk_level === 'HIGH' ? 'bg-orange-500' :
                              hist.risk_level === 'MODERATE' ? 'bg-yellow-500' :
                                'bg-green-500'
                            }`}></div>
                          <span className='font-medium'>{hist.specialist_recommended || 'General Consultation'}</span>
                        </div>
                        <div className='text-right text-xs text-gray-500'>
                          <p>{hist.generated_at ? new Date(hist.generated_at).toLocaleDateString() : 'Unknown date'}</p>
                          {hist.consultation_duration && (
                            <p>{Math.floor(hist.consultation_duration / 60)}:{(hist.consultation_duration % 60).toString().padStart(2, '0')} duration</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Summary:</p>
                          <p className="text-gray-800 dark:text-gray-200 line-clamp-2">{hist.summary_english}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Risk Level:</p>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${hist.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            hist.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              hist.risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {hist.risk_level || 'LOW'}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3"
                        onClick={() => { setReport(hist); setShowReport(true); setShowHistory(false) }}
                      >
                        View Full Report
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History Footer */}
            <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
              <p className='text-xs text-gray-500'>Reports are saved locally on your device</p>
              <Button onClick={() => setShowHistory(false)} className='px-6'>Close History</Button>
            </div>
          </div>
        </div>
      )}

      {/* Hands-free interaction disabled - using manual record button */}
      {/*
      {isCallActive && (
        <VadAudioProcessor
          isCallActive={isCallActive}
          onTranscript={(text) => handleTranscript(text, true)}
          onSpeechEnd={() => setIsTranscribing(true)}
          onProcessingStart={() => setIsTranscribing(true)}
          onProcessingEnd={() => setIsTranscribing(false)}
        />
      )}
      */}

      <TextToSpeech
        ref={textToSpeechRef}
        text={currentAssistantText}
        voiceId={session?.selectedDocter?.voiceId}
        doctorId={doctorId}
        onSpeakingStart={handleSpeakingStart}
        onSpeakingEnd={handleSpeakingEnd}
        onError={handleError}
      />

      <ConversationManager
        ref={conversationManagerRef}
        isCallActive={isCallActive}
        doctorPrompt={doctorPrompt}
        language={selectedLanguage}
        sessionId={sesstionId as string}
        onNewMessage={handleNewMessage}
        onError={handleError}
        onLanguageDetected={(lang) => {
          console.log(`🌐 Language detected: ${lang}`);
          // Auto-switch UI language to match detected language
          const langMapping: Record<string, string> = {
            'hindi': 'hi-IN',
            'tamil': 'ta-IN',
            'telugu': 'te-IN',
            'kannada': 'kn-IN',
            'malayalam': 'ml-IN',
            'marathi': 'mr-IN',
            'bengali': 'bn-IN',
            'gujarati': 'gu-IN',
            'english': 'en-IN'
          };
          const uiLang = langMapping[lang.toLowerCase()];
          if (uiLang && uiLang !== selectedLanguage) {
            setSelectedLanguage(uiLang);
          }
        }}
      />
    </div>
  )
}

export default MedicalVoiceAgent 