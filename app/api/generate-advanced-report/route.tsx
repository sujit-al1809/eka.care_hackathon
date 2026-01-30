/**
 * 🏆 Advanced Multi-Agent Medical Report Generator
 * Implementation of your winning hackathon architecture with:
 * - 5-Agent BioMistral system 
 * - Risk indicators with Indian medical context
 * - MiniLM spam filtering
 * - Dynamic prompt building
 * - 42hr trained Indian medical cases
 */

import { NextRequest, NextResponse } from "next/server";
import { medicalAgentSystem, PatientContext, AgentResponse } from "@/lib/agents/AgentSystem";
import { dynamicPromptBuilder } from "@/lib/prompts/PromptBuilder";
import { medicalSpamFilter } from "@/lib/filters/SpamFilter";
import { PrismaClient } from "@/lib/generated/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

interface AdvancedRiskIndicator {
  id: string;
  category: 'low' | 'medium' | 'high' | 'critical';
  factor: string;
  description: string;
  recommendation: string;
  score: number;
  indianContext: string;
  agentSource: string;
}

interface ComprehensiveMedicalReport {
  patientInfo: any;
  consultationSummary: string;
  agentAnalysis: {
    primaryAgent: AgentResponse;
    diagnosticAgent: AgentResponse;
    treatmentAgent: AgentResponse;
    emergencyAgent: AgentResponse;
    imagingAgent?: AgentResponse;
  };
  symptoms: {
    reported: string[];
    normalized: string[];
    severity: string;
    duration: string;
  };
  riskAssessment: {
    overallRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    riskScore: number;
    indicators: AdvancedRiskIndicator[];
    emergencyFlags: string[];
  };
  indianMedicalContext: {
    seasonalFactors: string[];
    regionalDiseases: string[];
    culturalConsiderations: string[];
    availableTreatments: string[];
    healthcareAccess: string[];
  };
  treatmentPlan: {
    medications: string[];
    homeRemedies: string[];
    ayurvedicOptions: string[];
    dietaryAdvice: string[];
    lifestyleChanges: string[];
  };
  followUp: {
    urgency: string;
    timeline: string;
    nextSteps: string[];
    warningSignsToWatch: string[];
    emergencyContacts: string[];
  };
  qualityMetrics: {
    systemConfidence: number;
    spamFiltered: boolean;
    agentConsensus: number;
    reportReliability: string;
  };
  metadata: {
    generatedAt: string;
    sessionId?: string;
    systemVersion: string;
    trainingData: string;
    processingTime: number;
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { sessionId, messages, patientInfo, useAdvancedAI = true } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // 🧠 Extract patient context from conversation
    const conversationText = messages.map((m: any) => m.content).join(' ');
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    
    const patientContext: PatientContext = {
      symptoms: lastUserMessage,
      language: patientInfo?.language || extractLanguage(conversationText),
      history: patientInfo?.medicalHistory || extractMedicalHistory(messages),
      age: patientInfo?.age || extractAge(conversationText),
      gender: patientInfo?.gender || extractGender(conversationText),
      location: patientInfo?.location || 'India',
      allergies: patientInfo?.allergies || extractAllergies(conversationText)
    };

    console.log('🚀 Initializing 5-Agent BioMistral System...');

    // 🎯 Step 1: Primary Agent - Initial assessment and routing
    const primaryResponse = await medicalAgentSystem.primaryAgent(patientContext);
    console.log(`✅ Primary Agent: ${primaryResponse.urgencyLevel} priority, routing to ${primaryResponse.nextAgent}`);
    
    // 🔍 Step 2: Diagnostic Agent - Symptom structuring  
    const diagnosticResponse = await medicalAgentSystem.diagnosticAgent(patientContext);
    console.log(`✅ Diagnostic Agent: ${diagnosticResponse.confidence * 100}% confidence`);
    
    // 💊 Step 3: Treatment Agent - Indian medical context
    const treatmentResponse = await medicalAgentSystem.treatmentAgent(patientContext);
    console.log(`✅ Treatment Agent: ${treatmentResponse.recommendations.length} recommendations`);
    
    // 🚨 Step 4: Emergency Agent - Red flag detection
    const emergencyResponse = await medicalAgentSystem.emergencyAgent(patientContext);
    console.log(`✅ Emergency Agent: ${emergencyResponse.urgencyLevel} urgency detected`);
    
    // 📸 Step 5: Imaging Agent - Optional X-ray analysis
    const imagingResponse = await medicalAgentSystem.imagingAgent(patientContext);
    console.log(`✅ Imaging Agent: Ready for medical image analysis`);

    // 📊 Step 6: Advanced risk calculation (Your secret sauce!)
    const riskAssessment = await calculateComprehensiveRisk(
      patientContext,
      [primaryResponse, diagnosticResponse, treatmentResponse, emergencyResponse]
    );
    console.log(`📊 Risk Assessment: ${riskAssessment.overallRisk} (Score: ${riskAssessment.riskScore}/10)`);

    // 🇮🇳 Step 7: Indian medical context analysis
    const indianContext = await generateComprehensiveIndianContext(patientContext, riskAssessment);

    // 🎯 Step 8: Generate dynamic prompts for quality validation
    const promptData = dynamicPromptBuilder.buildMedicalPrompt({
      ...patientContext,
      sessionHistory: messages.map((m: any) => m.content),
      consultationType: riskAssessment.overallRisk === 'CRITICAL' ? 'emergency' : 'routine'
    }, 'diagnostic');

    // 🔍 Step 9: Apply MiniLM spam filtering to all responses
    const agentResponses = [primaryResponse, diagnosticResponse, treatmentResponse, emergencyResponse];
    const filteredResponses = agentResponses.map(response => {\n      const filtered = medicalSpamFilter.filterMedicalResponse(response.reasoning);\n      return {\n        ...response,\n        reasoning: filtered.isSpam ? filtered.cleanedResponse : response.reasoning,\n        spamFiltered: filtered.isSpam\n      };\n    });\n\n    // 🏗️ Step 10: Build comprehensive medical report\n    const report: ComprehensiveMedicalReport = {\n      patientInfo: {\n        name: patientInfo?.name || 'Patient',\n        age: patientContext.age || 'Not specified',\n        gender: patientContext.gender || 'Not specified',\n        language: patientContext.language || 'English',\n        location: patientContext.location || 'India',\n        consultationDate: new Date().toLocaleDateString('en-IN'),\n        consultationTime: new Date().toLocaleTimeString('en-IN'),\n        sessionDuration: `${Math.round((Date.now() - startTime) / 1000)}s`\n      },\n\n      consultationSummary: generateAdvancedSummary(messages, patientContext, riskAssessment),\n\n      agentAnalysis: {\n        primaryAgent: filteredResponses[0],\n        diagnosticAgent: filteredResponses[1], \n        treatmentAgent: filteredResponses[2],\n        emergencyAgent: filteredResponses[3],\n        imagingAgent: imagingResponse\n      },\n\n      symptoms: {\n        reported: extractDetailedSymptoms(conversationText),\n        normalized: normalizeIndianSymptoms(conversationText),\n        severity: diagnosticResponse.urgencyLevel,\n        duration: extractSymptomDuration(conversationText)\n      },\n\n      riskAssessment,\n\n      indianMedicalContext: indianContext,\n\n      treatmentPlan: {\n        medications: extractMedications(treatmentResponse.recommendations),\n        homeRemedies: extractHomeRemedies(treatmentResponse.recommendations),\n        ayurvedicOptions: generateAyurvedicOptions(patientContext.symptoms),\n        dietaryAdvice: generateDietaryAdvice(patientContext, indianContext),\n        lifestyleChanges: generateLifestyleRecommendations(riskAssessment)\n      },\n\n      followUp: {\n        urgency: emergencyResponse.urgencyLevel,\n        timeline: calculateFollowUpTimeline(riskAssessment),\n        nextSteps: generateNextSteps(riskAssessment, agentResponses),\n        warningSignsToWatch: generateWarningSignsList(emergencyResponse, riskAssessment),\n        emergencyContacts: ['108 - National Emergency', 'Nearest Government Hospital Emergency', 'Private Hospital Emergency']\n      },\n\n      qualityMetrics: {\n        systemConfidence: calculateSystemConfidence(agentResponses),\n        spamFiltered: filteredResponses.some(r => r.spamFiltered),\n        agentConsensus: calculateAgentConsensus(agentResponses),\n        reportReliability: calculateReportReliability(riskAssessment, agentResponses)\n      },\n\n      metadata: {\n        generatedAt: new Date().toISOString(),\n        sessionId,\n        systemVersion: 'BioMistral-7B v2.0 - 5-Agent System',\n        trainingData: '42hr on Indian medical cases + Regional disease patterns',\n        processingTime: Date.now() - startTime\n      }\n    };\n\n    // 💾 Save to database\n    if (sessionId) {\n      try {\n        await prisma.session.update({\n          where: { sessionId },\n          data: {\n            report: report as any,\n            conversation: messages\n          }\n        });\n        console.log('💾 Report saved to database');\n      } catch (dbError) {\n        console.error('Database save error:', dbError);\n      }\n    }\n\n    console.log(`🏆 Advanced report generated in ${Date.now() - startTime}ms`);\n    console.log(`🧠 System confidence: ${report.qualityMetrics.systemConfidence}%`);\n    console.log(`🇮🇳 Indian context factors: ${Object.keys(indianContext).length}`);\n    console.log(`📊 Risk indicators: ${riskAssessment.indicators.length}`);\n\n    return NextResponse.json({\n      success: true,\n      report,\n      performance: {\n        processingTime: Date.now() - startTime,\n        agentsUsed: 5,\n        riskIndicators: riskAssessment.indicators.length,\n        spamFiltered: report.qualityMetrics.spamFiltered\n      }\n    });\n\n  } catch (error) {\n    console.error('🔥 Advanced report generation failed:', error);\n    \n    // Fallback to basic report\n    return NextResponse.json({\n      success: false,\n      error: 'Advanced AI temporarily unavailable',\n      fallbackReport: {\n        basic: true,\n        message: 'System experienced issues. Please try again or consult a healthcare professional.',\n        processingTime: Date.now() - startTime\n      }\n    }, { status: 200 });\n  }\n}\n\n// 📊 Advanced Risk Calculation (Your hackathon's secret algorithm!)\nasync function calculateComprehensiveRisk(\n  patientContext: PatientContext,\n  agentResponses: AgentResponse[]\n): Promise<any> {\n  const indicators: AdvancedRiskIndicator[] = [];\n  const symptoms = patientContext.symptoms.toLowerCase();\n  let totalScore = 0;\n  const emergencyFlags = [];\n\n  // 🚨 Critical Risk Indicators\n  const criticalPatterns = {\n    'cardiac_emergency': ['chest pain', 'heart attack', 'cardiac arrest'],\n    'respiratory_emergency': ['difficulty breathing', 'shortness of breath', 'cannot breathe'],\n    'neurological_emergency': ['stroke', 'seizure', 'unconscious', 'sudden weakness'],\n    'severe_bleeding': ['heavy bleeding', 'blood loss', 'hemorrhage']\n  };\n\n  for (const [category, patterns] of Object.entries(criticalPatterns)) {\n    for (const pattern of patterns) {\n      if (symptoms.includes(pattern)) {\n        indicators.push({\n          id: `critical_${category}`,\n          category: 'critical',\n          factor: category.replace('_', ' ').toUpperCase(),\n          description: `Critical symptoms detected: ${pattern}`,\n          recommendation: 'IMMEDIATE emergency medical attention required',\n          score: 9,\n          indianContext: 'Call 108 immediately or rush to nearest government hospital emergency',\n          agentSource: 'emergency_agent'\n        });\n        totalScore += 9;\n        emergencyFlags.push(pattern.toUpperCase());\n      }\n    }\n  }\n\n  // 🔴 High Risk Indicators (Indian-specific)\n  if (symptoms.includes('fever') && symptoms.includes('headache')) {\n    const month = new Date().getMonth();\n    if (month >= 6 && month <= 9) { // Monsoon season\n      indicators.push({\n        id: 'monsoon_fever',\n        category: 'high',\n        factor: 'Monsoon Fever Pattern',\n        description: 'Fever with headache during monsoon - potential dengue/malaria',\n        recommendation: 'Blood test for tropical diseases within 24 hours',\n        score: 6,\n        indianContext: 'Government hospitals provide free testing for vector-borne diseases',\n        agentSource: 'diagnostic_agent'\n      });\n      totalScore += 6;\n    }\n  }\n\n  // 🟡 Age-based Risk Assessment\n  if (patientContext.age && parseInt(patientContext.age.toString()) > 60) {\n    indicators.push({\n      id: 'age_risk',\n      category: 'medium',\n      factor: 'Advanced Age Risk',\n      description: 'Age >60 increases complication risk',\n      recommendation: 'Enhanced monitoring and follow-up care',\n      score: 4,\n      indianContext: 'Senior citizen health programs available at government hospitals',\n      agentSource: 'primary_agent'\n    });\n    totalScore += 4;\n  }\n\n  // 🇮🇳 Regional Disease Risk\n  if (patientContext.location) {\n    const location = patientContext.location.toLowerCase();\n    if (location.includes('mumbai') || location.includes('delhi')) {\n      indicators.push({\n        id: 'urban_pollution',\n        category: 'medium',\n        factor: 'Urban Air Quality Risk',\n        description: 'High pollution exposure in metropolitan areas',\n        recommendation: 'Consider air pollution impact on respiratory symptoms',\n        score: 3,\n        indianContext: 'Air quality monitoring and N95 masks recommended',\n        agentSource: 'primary_agent'\n      });\n      totalScore += 3;\n    }\n  }\n\n  // Calculate overall risk\n  let overallRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';\n  if (totalScore >= 15) overallRisk = 'CRITICAL';\n  else if (totalScore >= 10) overallRisk = 'HIGH';\n  else if (totalScore >= 5) overallRisk = 'MODERATE';\n\n  return {\n    overallRisk,\n    riskScore: Math.min(totalScore, 20), // Cap at 20\n    indicators,\n    emergencyFlags\n  };\n}\n\n// 🇮🇳 Generate comprehensive Indian medical context\nasync function generateComprehensiveIndianContext(patientContext: PatientContext, riskAssessment: any): Promise<any> {\n  const month = new Date().getMonth();\n  \n  return {\n    seasonalFactors: getSeasonalFactors(month),\n    regionalDiseases: getRegionalDiseases(patientContext.location, month),\n    culturalConsiderations: [\n      'Family involvement in healthcare decisions is common and beneficial',\n      'Traditional medicine integration with modern treatment is widely accepted',\n      'Language barriers may exist - ensure clear communication',\n      'Economic factors may influence treatment choices'\n    ],\n    availableTreatments: [\n      'Government hospitals: Free/subsidized care',\n      'Private hospitals: Full-service care',\n      'AYUSH practitioners: Traditional medicine',\n      'Primary health centers: Basic care',\n      'Telemedicine: Remote consultations'\n    ],\n    healthcareAccess: [\n      '108 - National emergency number (free)',\n      'Janaushadhi stores: Affordable generic medicines',\n      'PMJAY insurance coverage for eligible families',\n      'District hospitals: Secondary care',\n      'Medical colleges: Tertiary care'\n    ]\n  };\n}\n\n// Helper functions\nfunction getSeasonalFactors(month: number): string[] {\n  if (month >= 6 && month <= 9) {\n    return [\n      'Monsoon season: High humidity, vector breeding',\n      'Dengue, malaria, chikungunya risk peaks',\n      'Water-borne diseases common',\n      'Fungal skin infections increase',\n      'Respiratory infections due to dampness'\n    ];\n  } else if (month >= 3 && month <= 5) {\n    return [\n      'Summer season: Extreme heat, dehydration risk',\n      'Heat stroke and heat exhaustion common',\n      'Food poisoning risks increase',\n      'Skin heat rashes and infections',\n      'Increased cardiovascular stress'\n    ];\n  } else {\n    return [\n      'Winter season: Dry air, temperature drops',\n      'Respiratory infections peak',\n      'Joint pain and arthritis flare-ups',\n      'Cardiovascular events increase',\n      'Vitamin D deficiency concerns'\n    ];\n  }\n}\n\nfunction getRegionalDiseases(location: string | undefined, month: number): string[] {\n  if (!location) return ['Standard Indian disease patterns apply'];\n  \n  const loc = location.toLowerCase();\n  const diseases = [];\n  \n  if (loc.includes('coastal') || loc.includes('mumbai') || loc.includes('chennai')) {\n    diseases.push('Higher humidity-related infections', 'Tropical skin conditions');\n  }\n  \n  if (loc.includes('delhi') || loc.includes('punjab')) {\n    diseases.push('Air pollution-related respiratory issues', 'Dust allergies common');\n  }\n  \n  if (loc.includes('bengal') || loc.includes('bihar')) {\n    diseases.push('Water-borne diseases during floods', 'Arsenic contamination concerns');\n  }\n  \n  if (month >= 6 && month <= 9) {\n    diseases.push('Vector-borne diseases peak during monsoon');\n  }\n  \n  return diseases.length > 0 ? diseases : ['Standard regional health patterns'];\n}\n\n// Additional helper functions for report generation\nfunction extractLanguage(text: string): string {\n  const hindiPattern = /[\\u0900-\\u097F]/;\n  const tamilPattern = /[\\u0B80-\\u0BFF]/;\n  const teluguPattern = /[\\u0C00-\\u0C7F]/;\n  \n  if (hindiPattern.test(text)) return 'hindi';\n  if (tamilPattern.test(text)) return 'tamil';\n  if (teluguPattern.test(text)) return 'telugu';\n  return 'english';\n}\n\nfunction extractMedicalHistory(messages: any[]): string {\n  const historyKeywords = ['history', 'previous', 'before', 'earlier', 'past'];\n  const relevantMessages = messages.filter(m => \n    historyKeywords.some(keyword => m.content.toLowerCase().includes(keyword))\n  );\n  return relevantMessages.map(m => m.content).join(' ');\n}\n\nfunction extractAge(text: string): number | undefined {\n  const ageMatch = text.match(/(\\d+)\\s*(year|age|साल|वर्ष)/i);\n  return ageMatch ? parseInt(ageMatch[1]) : undefined;\n}\n\nfunction extractGender(text: string): string | undefined {\n  if (text.toLowerCase().includes('female') || text.toLowerCase().includes('woman') || text.toLowerCase().includes('महिला')) {\n    return 'female';\n  }\n  if (text.toLowerCase().includes('male') || text.toLowerCase().includes('man') || text.toLowerCase().includes('पुरुष')) {\n    return 'male';\n  }\n  return undefined;\n}\n\nfunction extractAllergies(text: string): string[] | undefined {\n  const allergyPattern = /allerg(ic|y)\\s+to\\s+([\\w\\s,]+)/gi;\n  const matches = text.match(allergyPattern);\n  return matches ? matches.map(m => m.replace(/allerg(ic|y)\\s+to\\s+/gi, '').trim()) : undefined;\n}\n\nfunction generateAdvancedSummary(messages: any[], context: PatientContext, risk: any): string {\n  const duration = messages.length;\n  const userMessages = messages.filter(m => m.role === 'user').length;\n  \n  return `Advanced 5-agent medical consultation completed. Patient consulted in ${context.language} language with ${userMessages} symptom reports over ${duration} message exchanges. Multi-agent system assessed ${risk.overallRisk} risk level with ${risk.indicators.length} risk indicators identified. BioMistral-7B model with 42hr Indian medical training provided culturally-aware assessment.`;\n}\n\nfunction extractDetailedSymptoms(text: string): string[] {\n  const symptoms = ['fever', 'headache', 'cough', 'pain', 'nausea', 'vomiting', 'diarrhea', \n                   'fatigue', 'weakness', 'dizziness', 'chest pain', 'abdominal pain'];\n  return symptoms.filter(symptom => text.toLowerCase().includes(symptom));\n}\n\nfunction normalizeIndianSymptoms(text: string): string[] {\n  const mapping: Record<string, string> = {\n    'बुखार': 'fever', 'सिरदर्द': 'headache', 'खांसी': 'cough', 'दर्द': 'pain',\n    'காய்ச்சல்': 'fever', 'தலைவலி': 'headache', 'இருமல்': 'cough',\n    'జ్వరం': 'fever', 'తలనొప్పి': 'headache', 'దగ్గు': 'cough'\n  };\n  \n  const normalized = [];\n  for (const [indian, english] of Object.entries(mapping)) {\n    if (text.includes(indian)) {\n      normalized.push(english);\n    }\n  }\n  return normalized;\n}\n\nfunction extractSymptomDuration(text: string): string {\n  const durationPattern = /(\\d+)\\s*(day|days|week|weeks|month|months|दिन|हफ्ता|महीना)/i;\n  const match = text.match(durationPattern);\n  return match ? match[0] : 'Recent onset';\n}\n\nfunction extractMedications(recommendations: string[]): string[] {\n  return recommendations.filter(rec => \n    rec.includes('💊') || rec.includes('mg') || rec.includes('tablet')\n  );\n}\n\nfunction extractHomeRemedies(recommendations: string[]): string[] {\n  return recommendations.filter(rec => \n    rec.includes('🫖') || rec.includes('🌿') || rec.includes('honey') || \n    rec.includes('ginger') || rec.includes('turmeric')\n  );\n}\n\nfunction generateAyurvedicOptions(symptoms: string): string[] {\n  const ayurvedicMap: Record<string, string[]> = {\n    'fever': ['Tulsi (Holy basil) decoction', 'Ginger and honey mixture'],\n    'cough': ['Turmeric milk', 'Liquorice root tea'],\n    'headache': ['Peppermint oil application', 'Brahmi for stress relief'],\n    'stomach': ['Ajwain water', 'Triphala for digestion']\n  };\n  \n  const options = [];\n  for (const [condition, remedies] of Object.entries(ayurvedicMap)) {\n    if (symptoms.toLowerCase().includes(condition)) {\n      options.push(...remedies);\n    }\n  }\n  return options.length > 0 ? options : ['Consult Ayurvedic practitioner for personalized herbs'];\n}\n\nfunction generateDietaryAdvice(context: PatientContext, indianContext: any): string[] {\n  const advice = [];\n  const symptoms = context.symptoms.toLowerCase();\n  \n  if (symptoms.includes('fever')) {\n    advice.push('Light meals: Khichdi, dal water, fresh fruits');\n    advice.push('Increase fluid intake: Coconut water, ORS, herbal teas');\n  }\n  \n  if (symptoms.includes('stomach') || symptoms.includes('digestive')) {\n    advice.push('BRAT diet: Banana, rice, apple, toast');\n    advice.push('Avoid: Spicy, oily, and street food');\n  }\n  \n  advice.push('Include: Fresh vegetables, seasonal fruits, adequate water');\n  advice.push('Avoid: Processed foods, excessive sugar, cold beverages');\n  \n  return advice;\n}\n\nfunction generateLifestyleRecommendations(riskAssessment: any): string[] {\n  const recommendations = [];\n  \n  if (riskAssessment.overallRisk === 'HIGH' || riskAssessment.overallRisk === 'CRITICAL') {\n    recommendations.push('Complete rest and avoid physical exertion');\n    recommendations.push('24/7 monitoring by family member');\n  } else {\n    recommendations.push('Adequate sleep: 7-8 hours daily');\n    recommendations.push('Light exercise as tolerated');\n  }\n  \n  recommendations.push('Stress management: Yoga, meditation, deep breathing');\n  recommendations.push('Regular meal times and proper hydration');\n  recommendations.push('Avoid smoking, alcohol, and tobacco products');\n  \n  return recommendations;\n}\n\nfunction calculateFollowUpTimeline(riskAssessment: any): string {\n  switch (riskAssessment.overallRisk) {\n    case 'CRITICAL': return 'IMMEDIATE - Within hours';\n    case 'HIGH': return 'URGENT - Within 24 hours';\n    case 'MODERATE': return 'Soon - Within 3-7 days';\n    case 'LOW': return 'Routine - Within 2-4 weeks';\n    default: return 'As needed';\n  }\n}\n\nfunction generateNextSteps(riskAssessment: any, agentResponses: AgentResponse[]): string[] {\n  const steps = [];\n  \n  if (riskAssessment.overallRisk === 'CRITICAL') {\n    steps.push('🚨 Call 108 or go to emergency room immediately');\n    steps.push('📋 Bring this report and list of current medications');\n    steps.push('👥 Notify family members about emergency situation');\n  } else {\n    steps.push('📅 Schedule appointment with recommended specialist');\n    steps.push('📋 Prepare symptom diary and medication list');\n    steps.push('🏥 Consider visiting nearest healthcare facility');\n  }\n  \n  // Add agent-specific recommendations\n  agentResponses.forEach(response => {\n    if (response.recommendations.length > 0) {\n      steps.push(...response.recommendations.slice(0, 2)); // Top 2 from each agent\n    }\n  });\n  \n  return [...new Set(steps)]; // Remove duplicates\n}\n\nfunction generateWarningSignsList(emergencyResponse: AgentResponse, riskAssessment: any): string[] {\n  const warnings = [\n    'Worsening of current symptoms',\n    'New severe symptoms appearing',\n    'Difficulty breathing or chest pain',\n    'High fever (>103°F/39.4°C)',\n    'Persistent vomiting or inability to keep fluids down',\n    'Signs of dehydration (dry mouth, dizziness)',\n    'Sudden weakness or confusion',\n    'Severe headache or vision changes'\n  ];\n  \n  // Add risk-specific warnings\n  if (riskAssessment.emergencyFlags.length > 0) {\n    warnings.unshift(`Watch for: ${riskAssessment.emergencyFlags.join(', ')}`);\n  }\n  \n  return warnings;\n}\n\nfunction calculateSystemConfidence(responses: AgentResponse[]): number {\n  const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;\n  return Math.round(avgConfidence * 100);\n}\n\nfunction calculateAgentConsensus(responses: AgentResponse[]): number {\n  // Calculate how much agents agree on urgency level\n  const urgencyLevels = responses.map(r => r.urgencyLevel);\n  const mostCommon = urgencyLevels.sort((a, b) => \n    urgencyLevels.filter(v => v === a).length - urgencyLevels.filter(v => v === b).length\n  ).pop();\n  \n  const consensusCount = urgencyLevels.filter(level => level === mostCommon).length;\n  return Math.round((consensusCount / responses.length) * 100);\n}\n\nfunction calculateReportReliability(riskAssessment: any, responses: AgentResponse[]): string {\n  const avgConfidence = calculateSystemConfidence(responses);\n  const consensus = calculateAgentConsensus(responses);\n  \n  if (avgConfidence >= 85 && consensus >= 75) return 'Very High';\n  if (avgConfidence >= 70 && consensus >= 60) return 'High';\n  if (avgConfidence >= 55 && consensus >= 45) return 'Moderate';\n  return 'Consult professional for verification';\n}\n\n// GET endpoint for fetching advanced reports\nexport async function GET(request: NextRequest) {\n  try {\n    const { searchParams } = new URL(request.url);\n    const sessionId = searchParams.get('sessionId');\n\n    if (!sessionId) {\n      return NextResponse.json({ error: \"Session ID is required\" }, { status: 400 });\n    }\n\n    const session = await prisma.session.findFirst({\n      where: { sessionId }\n    });\n\n    if (!session) {\n      return NextResponse.json({ error: \"Session not found\" }, { status: 404 });\n    }\n\n    return NextResponse.json({\n      success: true,\n      report: session.report,\n      conversation: session.conversation,\n      metadata: {\n        systemType: 'Advanced 5-Agent BioMistral System',\n        fetchedAt: new Date().toISOString()\n      }\n    });\n\n  } catch (error) {\n    console.error(\"Error fetching advanced report:\", error);\n    return NextResponse.json({ error: \"Failed to fetch report\" }, { status: 500 });\n  }\n}