"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Heart, Phone, PhoneOff, FileText, Mic, MicOff, Clock, User, Smile, Frown, Meh } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MoodAssessment {
  currentMood: string
  stressLevel: number
  sleepQuality: string
  anxietyLevel: number
}

export default function PsychologistAgent() {
  const { user } = useUser()
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [report, setReport] = useState(null)
  const [moodAssessment, setMoodAssessment] = useState<MoodAssessment>({
    currentMood: '',
    stressLevel: 5,
    sleepQuality: '',
    anxietyLevel: 5
  })
  const [showMoodTracker, setShowMoodTracker] = useState(false)

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
    setShowMoodTracker(true)
    setMessages([{
      role: 'assistant',
      content: 'नमस्ते! मैं आपका AI मनोविज्ञान परामर्शदाता हूँ। यह एक सुरक्षित स्थान है जहाँ आप अपनी भावनाओं और चिंताओं के बारे में खुलकर बात कर सकते हैं। | Hello! I am your AI Psychology Counselor. This is a safe space where you can openly share your feelings and concerns. How are you feeling today?',
      timestamp: new Date()
    }])
  }

  const endConsultation = () => {
    setIsCallActive(false)
    setIsListening(false)
    setShowMoodTracker(false)
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
        moodAssessment,
        doctorPrompt: `You are an expert AI Psychology Counselor specializing in mental health and emotional wellbeing.

CURRENT MOOD CONTEXT:
- Current Mood: ${moodAssessment.currentMood}
- Stress Level: ${moodAssessment.stressLevel}/10
- Sleep Quality: ${moodAssessment.sleepQuality}
- Anxiety Level: ${moodAssessment.anxietyLevel}/10

SPECIALTY FOCUS:
- Anxiety and stress management
- Depression and mood disorders
- Relationship counseling and communication
- Work-life balance and burnout
- Trauma and PTSD support
- Self-esteem and confidence building
- Coping strategies and emotional regulation
- Grief and loss counseling

THERAPEUTIC APPROACH:
- Use empathetic, non-judgmental language
- Employ active listening and validation
- Ask open-ended questions to explore feelings
- Provide cognitive behavioral therapy techniques
- Suggest mindfulness and relaxation methods
- Offer practical coping strategies
- Encourage self-reflection and awareness

COMMUNICATION STYLE:
- Create a safe, supportive environment
- Use gentle, understanding tone
- Ask about triggers and patterns
- Explore underlying thoughts and beliefs
- Validate emotions and experiences
- Include both Hindi/regional language and English responses
- Maintain professional boundaries

SAFETY PROTOCOLS:
- Always assess for suicidal ideation
- Recommend immediate help for:
  * Thoughts of self-harm or suicide
  * Severe depression or psychosis
  * Substance abuse issues
  * Domestic violence situations
  * Eating disorders
- Provide crisis hotline numbers when needed

APPROACH:
- Start with current emotional state
- Explore recent stressors and changes
- Identify patterns and triggers
- Teach healthy coping mechanisms
- Build emotional resilience
- Encourage professional help when needed
- Focus on strengths and resources

Remember: You are providing support and guidance, not replacing professional therapy. Always encourage seeking professional help for serious mental health concerns.`
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
        specialistType: 'Psychologist',
        moodAssessment
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

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy':
      case 'good':
      case 'positive':
        return <Smile className="w-5 h-5 text-green-600" />
      case 'sad':
      case 'depressed':
      case 'low':
        return <Frown className="w-5 h-5 text-red-600" />
      default:
        return <Meh className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-600'
    if (level <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Psychology AI</h1>
              <p className="text-gray-600">मनोविज्ञान परामर्शदाता | Mental Health Support</p>
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
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Start Session
                    </Button>
                  ) : (
                    <Button 
                      onClick={endConsultation}
                      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                      <PhoneOff className="w-5 h-5" />
                      End Session
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

              {/* Mood Tracker */}
              {showMoodTracker && (
                <Card className="mb-6 p-4 bg-purple-50 border-purple-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
                    <Heart className="w-5 h-5" />
                    Mood Check-in
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Mood</label>
                      <select
                        value={moodAssessment.currentMood}
                        onChange={(e) => setMoodAssessment(prev => ({...prev, currentMood: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select mood</option>
                        <option value="happy">Happy/Positive</option>
                        <option value="neutral">Neutral/Okay</option>
                        <option value="sad">Sad/Low</option>
                        <option value="anxious">Anxious/Worried</option>
                        <option value="angry">Angry/Frustrated</option>
                        <option value="confused">Confused/Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sleep Quality</label>
                      <select
                        value={moodAssessment.sleepQuality}
                        onChange={(e) => setMoodAssessment(prev => ({...prev, sleepQuality: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select quality</option>
                        <option value="excellent">Excellent (8+ hours, restful)</option>
                        <option value="good">Good (6-8 hours, decent)</option>
                        <option value="fair">Fair (4-6 hours, interrupted)</option>
                        <option value="poor">Poor (&lt;4 hours, restless)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stress Level (1-10)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodAssessment.stressLevel}
                          onChange={(e) => setMoodAssessment(prev => ({...prev, stressLevel: parseInt(e.target.value)}))}
                          className="flex-1"
                        />
                        <span className={`font-bold ${getStressColor(moodAssessment.stressLevel)}`}>
                          {moodAssessment.stressLevel}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Anxiety Level (1-10)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodAssessment.anxietyLevel}
                          onChange={(e) => setMoodAssessment(prev => ({...prev, anxietyLevel: parseInt(e.target.value)}))}
                          className="flex-1"
                        />
                        <span className={`font-bold ${getStressColor(moodAssessment.anxietyLevel)}`}>
                          {moodAssessment.anxietyLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  {moodAssessment.currentMood && (
                    <div className="mt-3 p-2 bg-purple-100 rounded text-sm flex items-center gap-2">
                      {getMoodIcon(moodAssessment.currentMood)}
                      <strong>Current Mood:</strong> {moodAssessment.currentMood.charAt(0).toUpperCase() + moodAssessment.currentMood.slice(1)}
                    </div>
                  )}
                </Card>
              )}

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
                          ? 'bg-purple-600 text-white'
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
                    placeholder="Share your thoughts and feelings... | अपने विचार और भावनाएँ साझा करें..."
                    className="min-h-20"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={sendMessage}
                      disabled={!currentSymptom.trim()}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Share
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
            {/* Mental Health Tips */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quick Wellness Tips
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-purple-50 rounded">
                  <strong>Breathing Exercise:</strong>
                  <p>4-7-8 technique: Inhale 4, hold 7, exhale 8</p>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <strong>Grounding:</strong>
                  <p>5-4-3-2-1: See 5, touch 4, hear 3, smell 2, taste 1</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <strong>Mindfulness:</strong>
                  <p>Focus on present moment, acknowledge feelings</p>
                </div>
              </div>
            </Card>

            {/* Crisis Support */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-semibold mb-3 text-red-800">Crisis Support</h3>
              <div className="text-sm text-red-700 space-y-2">
                <div>
                  <p className="font-medium">Emergency Helplines:</p>
                  <p>• National Suicide Prevention: 988</p>
                  <p>• Crisis Text Line: Text HOME to 741741</p>
                  <p>• SAMHSA: 1-800-662-4357</p>
                </div>
                <div>
                  <p className="font-medium">India Helplines:</p>
                  <p>• KIRAN: 1800-599-0019</p>
                  <p>• Vandrevala: 1860-2662-345</p>
                </div>
              </div>
            </Card>

            {/* Self-Care Checklist */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Daily Self-Care</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>8 hours of sleep</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Physical activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Healthy meals</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Social connection</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Relaxation time</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Report Display */}
        {report && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-bold mb-4">Mental Health Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Emotional Summary</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {report.summary?.english || report.summary_english}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wellness Recommendations</h3>
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