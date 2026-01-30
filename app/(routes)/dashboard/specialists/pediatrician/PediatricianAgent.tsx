"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Baby, Heart, Thermometer, Clock, Phone, PhoneOff, FileText, Mic, MicOff, Calendar } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChildInfo {
  age: string
  weight: string
  height: string
  gender: string
}

export default function PediatricianAgent() {
  const { user } = useUser()
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [report, setReport] = useState(null)
  const [childInfo, setChildInfo] = useState<ChildInfo>({
    age: '',
    weight: '',
    height: '',
    gender: ''
  })
  const [showChildInfo, setShowChildInfo] = useState(false)

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
    setShowChildInfo(true)
    setMessages([{
      role: 'assistant',
      content: 'नमस्ते! मैं आपका AI बाल रोग विशेषज्ञ हूँ। कृपया पहले अपने बच्चे की जानकारी दें फिर समस्या के बारे में बताएं। | Hello! I am your AI Pediatrician. Please first provide your child\'s information, then tell me about the concern.',
      timestamp: new Date()
    }])
  }

  const endConsultation = () => {
    setIsCallActive(false)
    setIsListening(false)
    setShowChildInfo(false)
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
        childInfo,
        doctorPrompt: `You are an expert AI Pediatrician specializing in children's health from newborn to 18 years.

CHILD INFORMATION:
- Age: ${childInfo.age}
- Weight: ${childInfo.weight}
- Height: ${childInfo.height}  
- Gender: ${childInfo.gender}

SPECIALTY FOCUS:
- Growth and development milestones
- Common childhood illnesses (fever, cough, rashes)
- Vaccination schedules and concerns
- Feeding problems and nutrition
- Behavioral and developmental issues
- School health problems
- Adolescent health concerns

CHILD-FRIENDLY APPROACH:
- Use age-appropriate language explanations
- Consider child's developmental stage
- Focus on comfort and reassurance
- Involve parents in care decisions
- Provide child-specific dosing recommendations
- Address parental concerns with empathy

COMMUNICATION STYLE:
- Ask about duration of symptoms
- Inquire about child's behavior changes
- Check feeding, sleeping, activity levels
- Ask about fever, appetite, hydration
- Consider age-specific normal ranges
- Include both Hindi/regional language and English responses

SAFETY PROTOCOLS:
- Always recommend immediate medical attention for:
  * High fever in infants under 3 months
  * Difficulty breathing or severe cough
  * Signs of dehydration
  * Persistent vomiting or diarrhea
  * Unusual behavior or lethargy
  * Any emergency symptoms

APPROACH:
- Consider child's age and developmental stage
- Ask about family history of conditions
- Inquire about recent exposures, travel
- Provide step-by-step care instructions
- Suggest comfort measures for child
- Guide parents on when to seek urgent care`
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
        specialistType: 'Pediatrician',
        childInfo
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

  const getAgeGroup = (age: string) => {
    const ageNum = parseInt(age)
    if (ageNum < 1) return 'Infant'
    if (ageNum < 3) return 'Toddler'
    if (ageNum < 6) return 'Preschooler'
    if (ageNum < 12) return 'School Age'
    return 'Adolescent'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Baby className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pediatrician AI</h1>
              <p className="text-gray-600">बाल रोग विशेषज्ञ | Child Health Expert</p>
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
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
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

              {/* Child Information Form */}
              {showChildInfo && (
                <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                    <Baby className="w-5 h-5" />
                    Child Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age (years/months)</Label>
                      <Input
                        id="age"
                        value={childInfo.age}
                        onChange={(e) => setChildInfo(prev => ({...prev, age: e.target.value}))}
                        placeholder="e.g., 5 years, 18 months"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={childInfo.gender}
                        onChange={(e) => setChildInfo(prev => ({...prev, gender: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        value={childInfo.weight}
                        onChange={(e) => setChildInfo(prev => ({...prev, weight: e.target.value}))}
                        placeholder="e.g., 20 kg"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        value={childInfo.height}
                        onChange={(e) => setChildInfo(prev => ({...prev, height: e.target.value}))}
                        placeholder="e.g., 110 cm"
                        className="bg-white"
                      />
                    </div>
                  </div>
                  {childInfo.age && (
                    <div className="mt-3 p-2 bg-blue-100 rounded text-sm">
                      <strong>Age Group:</strong> {getAgeGroup(childInfo.age)}
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
                    placeholder="Describe your child's symptoms... | बच्चे के लक्षणों के बारे में बताएं..."
                    className="min-h-20"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={sendMessage}
                      disabled={!currentSymptom.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
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
            {/* Age-Specific Info */}
            {childInfo.age && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {getAgeGroup(childInfo.age)} Care
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Key Focus Areas:</strong>
                    {getAgeGroup(childInfo.age) === 'Infant' && (
                      <ul className="mt-1 space-y-1">
                        <li>• Feeding & weight gain</li>
                        <li>• Sleep patterns</li>
                        <li>• Growth milestones</li>
                        <li>• Vaccinations</li>
                      </ul>
                    )}
                    {getAgeGroup(childInfo.age) === 'Toddler' && (
                      <ul className="mt-1 space-y-1">
                        <li>• Walking & motor skills</li>
                        <li>• Speech development</li>
                        <li>• Behavioral issues</li>
                        <li>• Safety concerns</li>
                      </ul>
                    )}
                    {getAgeGroup(childInfo.age) === 'School Age' && (
                      <ul className="mt-1 space-y-1">
                        <li>• Academic performance</li>
                        <li>• Social skills</li>
                        <li>• Common infections</li>
                        <li>• Nutrition needs</li>
                      </ul>
                    )}
                    {getAgeGroup(childInfo.age) === 'Adolescent' && (
                      <ul className="mt-1 space-y-1">
                        <li>• Puberty changes</li>
                        <li>• Mental health</li>
                        <li>• Body image issues</li>
                        <li>• Risk behaviors</li>
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Emergency Signs */}
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-semibold mb-3 text-red-800">Emergency Signs</h3>
              <div className="text-sm text-red-700 space-y-2">
                <div className="flex items-start gap-2">
                  <Thermometer className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">High Fever</p>
                    <p>Above 100.4°F in infants &lt;3 months</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Breathing Issues</p>
                    <p>Fast, difficult, or noisy breathing</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Baby className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Unusual Behavior</p>
                    <p>Extreme fussiness, lethargy, no eye contact</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Development Milestones */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Tips</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <p><strong>Fever Management:</strong> Use paracetamol/ibuprofen as per age. Cool cloths, plenty of fluids.</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p><strong>Hydration:</strong> Watch for wet diapers, tears when crying, moist mouth.</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p><strong>Sleep:</strong> Newborns: 14-17h, Toddlers: 11-14h, School age: 9-11h</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Report Display */}
        {report && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-bold mb-4">Pediatric Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Child Assessment</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {report.summary?.english || report.summary_english}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Care Instructions</h3>
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