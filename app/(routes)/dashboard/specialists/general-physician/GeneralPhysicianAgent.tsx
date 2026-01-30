"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Mic, MicOff, Phone, PhoneOff, FileText, Clock, User, Stethoscope } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function GeneralPhysicianAgent() {
  const { user } = useUser()
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [report, setReport] = useState(null)

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startConsultation = () => {
    setIsCallActive(true)
    setCallDuration(0)
    setMessages([{
      role: 'assistant',
      content: 'नमस्ते! मैं आपका AI जनरल फिजिशियन हूँ। आपकी क्या समस्या है? कृपया अपने लक्षणों के बारे में बताएं। | Hello! I am your AI General Physician. What seems to be the problem? Please tell me about your symptoms.',
      timestamp: new Date()
    }])
  }

  const endConsultation = () => {
    setIsCallActive(false)
    setIsListening(false)
  }

  const sendMessage = async () => {
    if (!currentSymptom.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: currentSymptom,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentSymptom("")

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        })),
        doctorPrompt: `You are a friendly General Physician AI specializing in common health issues and everyday symptoms. 
        
SPECIALTY FOCUS:
- Common cold, fever, headaches
- Digestive issues, stomach problems
- Body aches, fatigue
- Basic wellness and preventive care
- General health assessments

COMMUNICATION STYLE:
- Ask targeted questions about symptoms
- Provide clear, reassuring guidance
- Use simple medical language
- Always recommend specialist referral when needed
- Include both Hindi/regional language and English responses

APPROACH:
- Start with basic symptom assessment
- Ask about duration, severity, triggers
- Provide general wellness advice
- Guide when to seek immediate care
- Be thorough but not overwhelming`
      })

      if (response.data?.content) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const generateReport = async () => {
    if (messages.length === 0) return

    try {
      setIsGeneratingReport(true)
      const response = await axios.post('/api/generate-report', {
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        consultationDuration: callDuration,
        specialistType: 'General Physician'
      })

      if (response.data?.report) {
        setReport(response.data.report)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">General Physician AI</h1>
              <p className="text-gray-600">सामान्य चिकित्सक | Everyday Health Expert</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Consultation Area */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Call Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  {!isCallActive ? (
                    <Button 
                      onClick={startConsultation}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Start Consultation
                    </Button>
                  ) : (
                    <Button 
                      onClick={endConsultation}
                      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                      <PhoneOff className="w-5 h-5" />
                      End Call
                    </Button>
                  )}
                  
                  {isCallActive && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(callDuration)}</span>
                    </div>
                  )}
                </div>

                {isCallActive && messages.length > 1 && (
                  <Button 
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </Button>
                )}
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              {isCallActive && (
                <div className="space-y-3">
                  <Textarea
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    placeholder="Describe your symptoms... | अपने लक्षण बताएं..."
                    className="min-h-20"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={sendMessage}
                      disabled={!currentSymptom.trim()}
                      className="flex-1"
                    >
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      className={`px-4 ${isListening ? 'bg-red-100 text-red-700' : ''}`}
                      onClick={() => setIsListening(!isListening)}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Specialty Info */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Specialty Focus
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded">
                  <strong>Common Issues:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Cold, fever, headaches</li>
                    <li>• Digestive problems</li>
                    <li>• Body aches, fatigue</li>
                    <li>• General wellness</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Quick Assessment */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Health Check</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Symptom Categories</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <span className="p-1 bg-yellow-100 rounded text-center">Respiratory</span>
                    <span className="p-1 bg-green-100 rounded text-center">Digestive</span>
                    <span className="p-1 bg-blue-100 rounded text-center">General Pain</span>
                    <span className="p-1 bg-purple-100 rounded text-center">Wellness</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Guidelines */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-semibold mb-2 text-red-800">Emergency Signs</h3>
              <div className="text-sm text-red-700 space-y-1">
                <p>• High fever (>102°F)</p>
                <p>• Severe chest pain</p>
                <p>• Difficulty breathing</p>
                <p>• Persistent vomiting</p>
                <p className="font-medium mt-2">Call 108 immediately!</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Report Display */}
        {report && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-bold mb-4">Consultation Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Assessment</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {report.summary?.english || report.summary_english}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <div className="text-sm bg-gray-50 p-3 rounded">
                  {report.recommendations?.english?.map((rec, i) => (
                    <p key={i}>• {rec}</p>
                  )) || report.recommendations?.map((rec, i) => (
                    <p key={i}>• {rec}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}