"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Apple, Scale, Target, Phone, PhoneOff, FileText, Mic, MicOff, Clock, Calculator } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface NutritionProfile {
  age: string
  weight: string
  height: string
  gender: string
  activityLevel: string
  dietGoal: string
  medicalConditions: string
  allergies: string
}

export default function NutritionistAgent() {
  const { user } = useUser()
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [report, setReport] = useState(null)
  const [nutritionProfile, setNutritionProfile] = useState<NutritionProfile>({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    dietGoal: '',
    medicalConditions: '',
    allergies: ''
  })
  const [showProfile, setShowProfile] = useState(false)
  const [bmiCalculated, setBmiCalculated] = useState<number | null>(null)

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

  // Calculate BMI when height and weight change
  useEffect(() => {
    if (nutritionProfile.height && nutritionProfile.weight) {
      const heightM = parseFloat(nutritionProfile.height) / 100
      const weightKg = parseFloat(nutritionProfile.weight)
      if (heightM > 0 && weightKg > 0) {
        const bmi = weightKg / (heightM * heightM)
        setBmiCalculated(Math.round(bmi * 10) / 10)
      }
    }
  }, [nutritionProfile.height, nutritionProfile.weight])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startConsultation = () => {
    setIsCallActive(true)
    setCallDuration(0)
    setShowProfile(true)
    setMessages([{
      role: 'assistant',
      content: 'नमस्ते! मैं आपका AI पोषण विशेषज्ञ हूँ। स्वस्थ आहार और पोषण के लिए मैं आपकी सहायता करूंगा। कृपया अपनी बुनियादी जानकारी दें। | Hello! I am your AI Nutritionist. I will help you with healthy diet and nutrition guidance. Please provide your basic information first.',
      timestamp: new Date()
    }])
  }

  const endConsultation = () => {
    setIsCallActive(false)
    setIsListening(false)
    setShowProfile(false)
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
        nutritionProfile,
        bmi: bmiCalculated,
        doctorPrompt: `You are an expert AI Nutritionist specializing in dietary guidance and nutrition counseling.

NUTRITION PROFILE:
- Age: ${nutritionProfile.age}
- Weight: ${nutritionProfile.weight} kg
- Height: ${nutritionProfile.height} cm
- Gender: ${nutritionProfile.gender}
- Activity Level: ${nutritionProfile.activityLevel}
- Diet Goal: ${nutritionProfile.dietGoal}
- Medical Conditions: ${nutritionProfile.medicalConditions}
- Food Allergies: ${nutritionProfile.allergies}
- BMI: ${bmiCalculated || 'Not calculated'}

SPECIALTY FOCUS:
- Personalized meal planning and diet charts
- Weight management (loss, gain, maintenance)
- Disease-specific nutrition (diabetes, hypertension, PCOS)
- Sports nutrition and performance optimization
- Pregnancy and lactation nutrition
- Child and adolescent nutrition
- Elderly nutrition needs
- Vegetarian and vegan diet planning

INDIAN NUTRITION EXPERTISE:
- Traditional Indian foods and their nutritional values
- Regional dietary patterns and local ingredients
- Ayurvedic nutrition principles
- Indian cooking methods and healthy modifications
- Cultural food preferences and restrictions
- Local seasonal produce recommendations

COMMUNICATION STYLE:
- Provide practical, implementable advice
- Suggest specific Indian meals and recipes
- Calculate approximate calories and macros
- Consider budget-friendly options
- Address cultural food preferences
- Include both Hindi/regional language and English responses

ASSESSMENT APPROACH:
- Analyze current dietary patterns
- Identify nutritional gaps and excesses
- Consider lifestyle and activity levels
- Account for medical conditions and medications
- Provide gradual, sustainable changes
- Monitor progress and adjust recommendations

MEAL PLANNING:
- Create balanced meal plans with Indian foods
- Include portion sizes and timing
- Suggest healthy substitutions
- Provide shopping lists with local ingredients
- Consider cooking methods and meal prep tips
- Address hydration and supplement needs

SAFETY GUIDELINES:
- Always consider medical conditions and allergies
- Recommend consulting doctors for serious conditions
- Avoid extreme or fad diets
- Emphasize balanced, sustainable approaches
- Monitor for signs of eating disorders
- Provide culturally appropriate modifications`
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
        specialistType: 'Nutritionist',
        nutritionProfile,
        bmi: bmiCalculated
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

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Normal Weight', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' }
    return { category: 'Obese', color: 'text-red-600' }
  }

  const calculateCalories = () => {
    if (!nutritionProfile.weight || !nutritionProfile.height || !nutritionProfile.age || !nutritionProfile.gender) return null
    
    const weight = parseFloat(nutritionProfile.weight)
    const height = parseFloat(nutritionProfile.height)
    const age = parseFloat(nutritionProfile.age)
    
    // Harris-Benedict Formula
    let bmr
    if (nutritionProfile.gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const multiplier = activityMultipliers[nutritionProfile.activityLevel as keyof typeof activityMultipliers] || 1.2
    return Math.round(bmr * multiplier)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Apple className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nutritionist AI</h1>
              <p className="text-gray-600">पोषण विशेषज्ञ | Nutrition & Diet Expert</p>
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
                    {isGeneratingReport ? 'Generating...' : 'Generate Plan'}
                  </Button>
                )}
              </div>

              {/* Nutrition Profile Form */}
              {showProfile && (
                <Card className="mb-6 p-4 bg-green-50 border-green-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                    <Scale className="w-5 h-5" />
                    Nutrition Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        value={nutritionProfile.age}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, age: e.target.value}))}
                        placeholder="25"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={nutritionProfile.gender}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, gender: e.target.value}))}
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
                        type="number"
                        value={nutritionProfile.weight}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, weight: e.target.value}))}
                        placeholder="65"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={nutritionProfile.height}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, height: e.target.value}))}
                        placeholder="170"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="activity">Activity Level</Label>
                      <select
                        id="activity"
                        value={nutritionProfile.activityLevel}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, activityLevel: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select Activity</option>
                        <option value="sedentary">Sedentary (desk job)</option>
                        <option value="light">Light (light exercise 1-3 days)</option>
                        <option value="moderate">Moderate (exercise 3-5 days)</option>
                        <option value="active">Active (exercise 6-7 days)</option>
                        <option value="very_active">Very Active (intense exercise)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="goal">Diet Goal</Label>
                      <select
                        id="goal"
                        value={nutritionProfile.dietGoal}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, dietGoal: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="">Select Goal</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="weight_gain">Weight Gain</option>
                        <option value="maintenance">Weight Maintenance</option>
                        <option value="muscle_gain">Muscle Building</option>
                        <option value="general_health">General Health</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="conditions">Medical Conditions (optional)</Label>
                      <Input
                        id="conditions"
                        value={nutritionProfile.medicalConditions}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, medicalConditions: e.target.value}))}
                        placeholder="Diabetes, Hypertension, PCOS, etc."
                        className="bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="allergies">Food Allergies/Restrictions</Label>
                      <Input
                        id="allergies"
                        value={nutritionProfile.allergies}
                        onChange={(e) => setNutritionProfile(prev => ({...prev, allergies: e.target.value}))}
                        placeholder="Nuts, Dairy, Gluten, Vegetarian, etc."
                        className="bg-white"
                      />
                    </div>
                  </div>
                  
                  {/* BMI and Calorie Display */}
                  {bmiCalculated && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          <strong>BMI: </strong>
                          <span className={getBmiCategory(bmiCalculated).color}>
                            {bmiCalculated} ({getBmiCategory(bmiCalculated).category})
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <strong>Daily Calories: </strong>
                          <span className="text-green-600">
                            ~{calculateCalories()} kcal
                          </span>
                        </div>
                      </div>
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
                          ? 'bg-green-600 text-white'
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
                    placeholder="Ask about diet, nutrition, meal planning... | आहार और पोषण के बारे में पूछें..."
                    className="min-h-20"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={sendMessage}
                      disabled={!currentSymptom.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700"
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
            {/* Nutrition Facts */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Indian Nutrition Guide
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-green-50 rounded">
                  <strong>Balanced Indian Plate:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 1/2 vegetables & fruits</li>
                    <li>• 1/4 whole grains (rice/roti)</li>
                    <li>• 1/4 proteins (dal/paneer)</li>
                    <li>• Healthy fats (ghee/nuts)</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Macro Guidelines */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Daily Nutrition Goals</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Protein:</span>
                  <span className="font-medium">0.8-1g per kg body weight</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Fiber:</span>
                  <span className="font-medium">25-35g daily</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Water:</span>
                  <span className="font-medium">8-10 glasses</span>
                </div>
              </div>
            </Card>

            {/* Healthy Indian Foods */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Power Foods</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-orange-50 rounded">
                  <strong>Protein Sources:</strong>
                  <p>Dal, rajma, chana, paneer, eggs, fish</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <strong>Superfoods:</strong>
                  <p>Quinoa, millets, turmeric, amla, leafy greens</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <strong>Healthy Fats:</strong>
                  <p>Ghee, coconut oil, nuts, seeds, avocado</p>
                </div>
              </div>
            </Card>

            {/* Portion Guide */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-800">Portion Guide</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Rice/Roti: Size of your fist</p>
                <p>• Dal/Curry: 1 bowl (150ml)</p>
                <p>• Vegetables: 2 fists full</p>
                <p>• Ghee/Oil: 1 teaspoon</p>
                <p>• Nuts: 1 handful (30g)</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Report Display */}
        {report && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-bold mb-4">Personalized Nutrition Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Nutrition Assessment</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {report.summary?.english || report.summary_english}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Diet Recommendations</h3>
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