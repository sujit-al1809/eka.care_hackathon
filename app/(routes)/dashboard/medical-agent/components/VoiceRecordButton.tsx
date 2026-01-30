import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square, Loader2, Sparkles } from 'lucide-react'

interface VoiceRecordButtonProps {
  isCallActive: boolean
  onRecordingComplete: (audioBlob: Blob) => void
  onTranscript?: (text: string, isFinal: boolean) => void
  language?: string
}

const VoiceRecordButton = ({ isCallActive, onRecordingComplete, onTranscript, language = 'en-IN' }: VoiceRecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isUsingWebSpeech, setIsUsingWebSpeech] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // SpeechRecognition refs
  const recognitionRef = useRef<any>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setRecordingTime(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      console.log(`Starting recording... Language: ${language}`)
      setIsRecording(true)

      // Try Web Speech API first (The "Local One")
      if (typeof window !== 'undefined' && onTranscript) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (SpeechRecognition) {
          console.log("Using Web Speech API (Local)")
          setIsUsingWebSpeech(true)

          const recognition = new SpeechRecognition()
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = language

          recognition.onresult = (event: any) => {
            let interimTranscript = ''
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript
              } else {
                interimTranscript += event.results[i][0].transcript
              }
            }

            // Stream results
            if (finalTranscript) {
              onTranscript(finalTranscript, true)
            } else if (interimTranscript) {
              onTranscript(interimTranscript, false)
            }
          }

          recognition.onend = () => {
            setIsRecording(false)
            setIsUsingWebSpeech(false)
          }

          recognition.onerror = (event: any) => {
            if (event.error === 'aborted') {
              // Ignore aborted error as it happens when stopping manually or re-initializing
              console.log("Speech recognition aborted (normal)");
              return;
            }
            if (event.error === 'no-speech') {
              // Also common, ignore
              return;
            }

            console.error("Speech recognition error", event.error)
            // If network error or not allowed, fallback or just stop
            if (event.error === 'not-allowed' || event.error === 'network') {
              // Could try fallback here, but simplicity first
            }
            stopRecording()
          }

          recognitionRef.current = recognition
          recognition.start()
          return
        }
      }

      // Fallback to MediaRecorder (The "Remote One")
      console.log("Using MediaRecorder (Remote)")
      setIsUsingWebSpeech(false)
      audioChunksRef.current = []

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      const mediaRecorder = new MediaRecorder(streamRef.current)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing audio...")
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        onRecordingComplete(audioBlob)

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }

        setIsRecording(false)
      }

      mediaRecorder.start()

    } catch (error) {
      console.error("Error starting recording:", error)
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (isRecording) {
      console.log("Stopping recording...")

      if (isUsingWebSpeech && recognitionRef.current) {
        recognitionRef.current.stop()
      } else if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }

      setIsRecording(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isCallActive) return null

  return (
    <div className="flex items-center gap-3">
      {isRecording ? (
        <div className={`flex items-center gap-3 p-3 px-5 border-2 rounded-2xl shadow-lg transition-all animate-in fade-in zoom-in-95 duration-300 ${isUsingWebSpeech
          ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 shadow-green-100'
          : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 shadow-red-100'}`}>

          <div className="relative">
            <div className={`absolute inset-0 rounded-full animate-ping ${isUsingWebSpeech ? 'bg-green-500/30' : 'bg-red-500/30'}`}></div>
            <div className={`w-3 h-3 rounded-full relative z-10 ${isUsingWebSpeech ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>

          <span className={`text-sm font-mono font-medium ${isUsingWebSpeech ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatTime(recordingTime)}
          </span>

          <Button
            size="sm"
            onClick={stopRecording}
            className={`flex items-center gap-2 text-white rounded-xl px-4 shadow-md ${isUsingWebSpeech
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'}`}
          >
            <Square className="h-4 w-4" />
            {isUsingWebSpeech ? 'Send' : 'Stop'}
          </Button>

          {isUsingWebSpeech && (
            <span className="text-xs text-green-600 font-medium animate-pulse ml-1 hidden sm:inline-block">Listening...</span>
          )}
        </div>
      ) : (
        <Button
          size="lg"
          variant="outline"
          onClick={startRecording}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
        >
          <Mic className={`h-5 w-5 ${language !== 'en-IN' ? 'text-primary' : ''}`} />
          {language !== 'en-IN' ? 'Speak (Native)' : 'Start Voice'}
        </Button>
      )}
    </div>
  )
}

export default VoiceRecordButton 