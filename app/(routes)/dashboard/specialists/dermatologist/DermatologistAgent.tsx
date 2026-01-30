"use client"
import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Camera, Upload, Mic, MicOff, Phone, PhoneOff, FileText, History, Image as ImageIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import Image from 'next/image'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ImageAnalysis = {
  skinCondition?: string
  severity?: string
  recommendations?: string[]
  requires_specialist?: boolean
}

export default function DermatologistAgent() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }, [])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageDataURL = canvas.toDataURL('image/jpeg', 0.8)
        setUploadedImages(prev => [...prev, imageDataURL])
        analyzeImage(imageDataURL)
        stopCamera()
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }, [stream])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImages(prev => [...prev, result])
        analyzeImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      // Simulate AI image analysis for skin conditions
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockAnalysis: ImageAnalysis = {
        skinCondition: "Possible dermatitis or eczema",
        severity: "Mild to moderate",
        recommendations: [
          "Keep the area clean and dry",
          "Apply gentle moisturizer twice daily",
          "Avoid harsh soaps and chemicals",
          "Consider over-the-counter hydrocortisone cream"
        ],
        requires_specialist: false
      }
      
      setImageAnalysis(mockAnalysis)
      
      // Add analysis to conversation
      const analysisMessage: Message = {
        role: 'assistant',
        content: `Based on the image analysis:\n\n**Condition**: ${mockAnalysis.skinCondition}\n**Severity**: ${mockAnalysis.severity}\n\n**Recommendations**:\n${mockAnalysis.recommendations?.map(r => `• ${r}`).join('\n')}\n\nPlease describe any symptoms you're experiencing with this condition.`
      }
      setMessages(prev => [...prev, analysisMessage])
      
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const userMessage: Message = { role: 'user', content: userInput }
    setMessages(prev => [...prev, userMessage])
    setUserInput('')

    // Simulate dermatologist AI response
    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage],
        specialistType: 'dermatologist',
        hasImages: uploadedImages.length > 0
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.content || "As a dermatologist AI, I'd be happy to help with your skin concern. Could you describe the symptoms and affected area in more detail?"
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Add speech recognition functionality here
  }

  const toggleCall = () => {
    setIsCallActive(!isCallActive)
    // Add voice call functionality here
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Image src="/doctor3.png" alt="Dermatologist" width={64} height={64} className="rounded-full" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dermatologist AI</h1>
              <p className="text-gray-600 dark:text-gray-300">Advanced skin condition analysis with image recognition</p>
            </div>
          </div>
          
          {/* Specialties */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Acne Treatment</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Eczema & Dermatitis</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Skin Cancer Screening</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Rash Analysis</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Hair & Nail Disorders</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image Capture Section */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Skin Image Analysis
              </h3>
              
              {/* Camera/Upload Controls */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={startCamera}
                    className="flex-1 flex items-center gap-2"
                    disabled={showCamera}
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Camera View */}
                {showCamera && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button onClick={captureImage} size="sm">
                        Capture
                      </Button>
                      <Button onClick={stopCamera} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                {/* Analysis Results */}
                {imageAnalysis && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Analysis Results</h4>
                    <p className="text-sm"><strong>Condition:</strong> {imageAnalysis.skinCondition}</p>
                    <p className="text-sm"><strong>Severity:</strong> {imageAnalysis.severity}</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Analyzing image...</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Consultation Chat</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={toggleListening}
                    size="sm"
                    variant={isListening ? "default" : "outline"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={toggleCall}
                    size="sm"
                    variant={isCallActive ? "destructive" : "outline"}
                  >
                    {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="mb-4">Welcome to Dermatologist AI!</p>
                    <p className="text-sm">Take a photo or upload an image of your skin concern, then describe your symptoms.</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Describe your skin concern, symptoms, duration..."
                    className="flex-1 min-h-[60px]"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="h-[60px]">
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}