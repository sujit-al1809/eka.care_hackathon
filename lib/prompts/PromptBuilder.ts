/**
 * Dynamic Prompt Builder
 * Constructs contextual prompts: patientHistory + symptoms + emergencyFlags + language + allergies + OCR + X-ray inference
 * Enhanced with 8-language Indian medical knowledge base
 */

import { PatientContext, AgentResponse } from '../agents/AgentSystem';
import { 
  MEDICAL_TRAINING_DATA, 
  getTrainingDataByLanguage, 
  getTrainingDataByCondition,
  LANGUAGE_METADATA,
  REGIONAL_DISEASES 
} from '../data/MedicalKnowledgeBase';

interface PromptContext extends PatientContext {
  sessionHistory?: string[];
  medicalImages?: string[];
  ocrResults?: string[];
  previousDiagnosis?: string[];
  currentSeason?: string;
  timeOfDay?: string;
  consultationType?: 'emergency' | 'routine' | 'follow-up' | 'second-opinion';
}

interface GeneratedPrompt {
  systemPrompt: string;
  userPrompt: string;
  context: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  agentType: 'primary' | 'diagnostic' | 'emergency' | 'treatment' | 'imaging';
  language: string;
  indianContext: string;
}

export class DynamicPromptBuilder {
  private readonly INDIAN_MEDICAL_CONTEXT = {
    commonConditions: ['diabetes', 'hypertension', 'tuberculosis', 'dengue', 'malaria'],
    culturalFactors: ['joint families', 'dietary habits', 'festival seasons', 'work stress'],
    availableTreatments: ['government hospitals', 'AYUSH medicines', 'home remedies'],
    regionalDiseases: {
      north: ['respiratory infections', 'seasonal allergies'],
      south: ['tropical diseases', 'monsoon infections'],
      west: ['heat-related illnesses', 'urban pollution effects'],
      east: ['water-borne diseases', 'nutritional deficiencies']
    }
  };

  private readonly EMERGENCY_INDICATORS = [
    'chest pain', 'difficulty breathing', 'severe headache', 'high fever',
    'sudden weakness', 'confusion', 'severe abdominal pain', 'bleeding'
  ];

  private readonly LANGUAGE_MEDICAL_TERMS = {
    hindi: {
      symptoms: 'लक्षण', fever: 'बुखार', pain: 'दर्द', headache: 'सिरदर्द',
      stomach: 'पेट', cough: 'खांसी', cold: 'सर्दी', weakness: 'कमजोरी'
    },
    tamil: {
      symptoms: 'அறிகுறிகள்', fever: 'காய்ச்சல்', pain: 'வலி', headache: 'தலைவலி',
      stomach: 'வயிறு', cough: 'இருமல்', cold: 'சளி', weakness: 'பலவீனம்'
    },
    telugu: {
      symptoms: 'లక్షణాలు', fever: 'జ్వరం', pain: 'నొప్పి', headache: 'తలనొప్పి',
      stomach: 'కడుపు', cough: 'దగ్గు', cold: 'జలుబు', weakness: 'బలహీనత'
    },
    marathi: {
      symptoms: 'लक्षणे', fever: 'ताप', pain: 'दुखणे', headache: 'डोकेदुखी',
      stomach: 'पोट', cough: 'खोकला', cold: 'सर्दी', weakness: 'अशक्तपणा'
    },
    kannada: {
      symptoms: 'ಲಕ್ಷಣಗಳು', fever: 'ಜ್ವರ', pain: 'ನೋವು', headache: 'ತಲೆನೋವು',
      stomach: 'ಹೊಟ್ಟೆ', cough: 'ಕೆಮ್ಮು', cold: 'ಶೀತ', weakness: 'ದೌರ್ಬಲ್ಯ'
    },
    bengali: {
      symptoms: 'লক্ষণ', fever: 'জ্বর', pain: 'ব্যথা', headache: 'মাথা ব্যথা',
      stomach: 'পেট', cough: 'কাশি', cold: 'সর্দি', weakness: 'দুর্বলতা'
    },
    gujarati: {
      symptoms: 'લક્ષણો', fever: 'તાવ', pain: 'દુખાવો', headache: 'માથાનો દુખાવો',
      stomach: 'પેટ', cough: 'ખાંસી', cold: 'શરદી', weakness: 'નબળાઈ'
    },
    malayalam: {
      symptoms: 'ലക്ഷണങ്ങൾ', fever: 'പനി', pain: 'വേദന', headache: 'തലവേദന',
      stomach: 'വയറ്', cough: 'ചുമ', cold: 'ജലദോഷം', weakness: 'ബലഹീനത'
    }
  };

  /**
   * Get relevant training examples based on detected language and condition
   */
  private getRelevantTrainingExamples(symptoms: string, language: string): string[] {
    const examples: string[] = [];
    const lowerSymptoms = symptoms.toLowerCase();
    
    // Detect conditions from symptoms
    const conditionKeywords: Record<string, string[]> = {
      diarrhea: ['loose motion', 'diarrhea', 'jhada', 'vomit', 'ulti', 'julabh', 'pet kharab', 'virechan', 'bidi'],
      diabetes: ['sugar', 'diabetes', 'thirst', 'urination', 'shakkar', 'madhumeh'],
      body_pain: ['pain', 'ache', 'dard', 'dukhave', 'novu', 'vali', 'vedana', 'byatha'],
      hypertension: ['bp', 'blood pressure', 'high bp', 'tension'],
      fever: ['fever', 'bukhar', 'taav', 'jwara', 'kaichal', 'pani'],
      dengue: ['dengue', 'platelet', 'monsoon fever', 'chikungunya'],
      acidity: ['gas', 'acid', 'burning', 'gerd', 'jalan', 'erchchal'],
      cardiac: ['chest', 'heart', 'seene', 'chhati', 'neenju', 'buk'],
      stroke: ['weakness', 'one side', 'paralysis', 'kamzori', 'ek taraf']
    };
    
    // Find matching conditions
    const matchedConditions: string[] = [];
    for (const [condition, keywords] of Object.entries(conditionKeywords)) {
      if (keywords.some(keyword => lowerSymptoms.includes(keyword))) {
        matchedConditions.push(condition);
      }
    }
    
    // Get training examples for matched conditions in the specified language
    const langKey = language.toLowerCase();
    for (const condition of matchedConditions.slice(0, 2)) { // Limit to 2 conditions
      const conditionExamples = MEDICAL_TRAINING_DATA.filter(
        item => item.condition.includes(condition) && item.language === langKey
      );
      if (conditionExamples.length > 0) {
        examples.push(conditionExamples[0].text);
      }
    }
    
    // If no specific match, get general examples in that language
    if (examples.length === 0 && langKey !== 'english') {
      const langExamples = getTrainingDataByLanguage(langKey);
      if (langExamples.length > 0) {
        examples.push(langExamples[0].text); // Add one example for language context
      }
    }
    
    return examples;
  }

  /**
   * Get regional disease awareness based on location
   */
  private getRegionalDiseaseContext(location?: string): string[] {
    if (!location) return [];
    
    const lowerLocation = location.toLowerCase();
    const diseases: string[] = [];
    
    if (lowerLocation.includes('kerala') || lowerLocation.includes('coastal')) {
      diseases.push(...REGIONAL_DISEASES.kerala);
      diseases.push('CRITICAL: Kerala region - Be aware of Leptospirosis after floods, Nipah virus outbreaks in certain districts');
    }
    if (lowerLocation.includes('karnataka') || lowerLocation.includes('bangalore')) {
      diseases.push(...REGIONAL_DISEASES.karnataka);
      diseases.push('Karnataka region: Scrub typhus common in Western Ghats areas after farm work');
    }
    if (lowerLocation.includes('tamil') || lowerLocation.includes('chennai')) {
      diseases.push(...REGIONAL_DISEASES.tamil_nadu);
      diseases.push('Tamil Nadu: Scrub typhus and leptospirosis after agricultural exposure');
    }
    if (lowerLocation.includes('bengal') || lowerLocation.includes('kolkata') || lowerLocation.includes('bihar')) {
      diseases.push(...REGIONAL_DISEASES.bengal);
      diseases.push('Bengal/Bihar region: Kala-azar (Visceral Leishmaniasis) endemic - prolonged fever with splenomegaly');
    }
    if (lowerLocation.includes('gujarat') || lowerLocation.includes('kutch')) {
      diseases.push(...REGIONAL_DISEASES.gujarat);
      diseases.push('Gujarat/Kutch: Cutaneous Leishmaniasis endemic - skin nodules/ulcers after sandfly bites');
    }
    
    return diseases;
  }

  /**
   * Build comprehensive medical consultation prompt
   */
  buildMedicalPrompt(context: PromptContext, agentType: string = 'primary'): GeneratedPrompt {
    const priority = this.assessPriority(context);
    const indianContext = this.buildIndianContext(context);
    const seasonalContext = this.getSeasonalContext();
    const emergencyFlags = this.detectEmergencyFlags(context.symptoms);

    const systemPrompt = this.buildSystemPrompt(agentType as any, context, indianContext);
    const userPrompt = this.buildUserPrompt(context, emergencyFlags, seasonalContext);
    
    return {
      systemPrompt,
      userPrompt,
      context: this.buildFullContext(context, indianContext, seasonalContext),
      priority,
      agentType: agentType as any,
      language: context.language || 'english',
      indianContext
    };
  }

  /**
   * Build agent-specific system prompt with multilingual knowledge base
   */
  private buildSystemPrompt(agentType: 'primary' | 'diagnostic' | 'emergency' | 'treatment' | 'imaging', 
                          context: PromptContext, indianContext: string): string {
    // Get relevant training examples for the language and symptoms
    const trainingExamples = this.getRelevantTrainingExamples(
      context.symptoms, 
      context.language || 'english'
    );
    
    // Get regional disease context
    const regionalDiseases = this.getRegionalDiseaseContext(context.location);
    
    // Get language metadata
    const langKey = (context.language || 'english').toLowerCase();
    const langMeta = LANGUAGE_METADATA[langKey as keyof typeof LANGUAGE_METADATA];
    
    const basePrompt = `You are an expert Indian medical AI assistant specialized in ${agentType} medical consultation.
You are trained on comprehensive Indian medical cases covering 8 Indian languages and regional diseases.

INDIAN MEDICAL CONTEXT:
${indianContext}

${langMeta ? `LANGUAGE CONTEXT:
Patient's preferred language: ${langMeta.name} (${langMeta.nativeName})
Region: ${langMeta.region}
Respond in ${langMeta.name} when appropriate, using local medical terminology.
` : ''}

${regionalDiseases.length > 0 ? `REGIONAL DISEASE AWARENESS:
${regionalDiseases.join('\n')}
` : ''}

${trainingExamples.length > 0 ? `REFERENCE CONSULTATION EXAMPLES (Follow this communication style):
${trainingExamples.map((ex, i) => `Example ${i + 1}:\n${ex}`).join('\n\n')}
` : ''}

YOUR ROLE AS ${agentType.toUpperCase()} AGENT:`;

    const roleSpecificPrompts = {
      primary: `
- Route patients to appropriate specialists based on symptoms
- Identify emergency situations requiring immediate attention
- Consider Indian medical practices and available healthcare systems
- Provide initial assessment and triage decisions
- Account for language barriers and cultural factors`,

      diagnostic: `  
- Structure symptoms systematically with Indian medical terminology
- Calculate severity based on Indian population patterns
- Generate differential diagnosis considering regional diseases
- Account for monsoon diseases, tropical conditions, and endemic illnesses
- Consider socio-economic factors affecting diagnosis`,

      emergency: `
- Detect critical red flags requiring immediate intervention
- Prioritize life-threatening conditions common in Indian settings
- Guide to nearest emergency services (108 helpline, government hospitals)
- Consider time-sensitive conditions like cardiac events, stroke, sepsis
- Provide rapid assessment and emergency action plans`,

      treatment: `
- Design treatment plans using medications available in India
- Include Ayurvedic and home remedies where appropriate
- Consider Indian dietary habits and food availability
- Account for climate, season, and regional disease patterns  
- Provide cost-effective treatment options for different economic levels`,

      imaging: `
- Analyze medical images (X-rays, CT, MRI) when available
- Guide on imaging requirements for Indian healthcare settings
- Consider availability and cost of imaging in government vs private hospitals
- Correlate imaging findings with clinical symptoms
- Suggest appropriate imaging based on suspected conditions`
    };

    return basePrompt + roleSpecificPrompts[agentType] + `

LANGUAGE & CULTURAL SENSITIVITY:
- Communicate in ${context.language || 'English'} when needed
- Use simple, clear medical language
- Consider family involvement in healthcare decisions (Indian culture)
- Respect traditional medicine integration possibilities
- Be aware of health literacy levels

MEDICAL SAFETY:
- Always recommend professional consultation for serious conditions
- Clearly state limitations of AI advice
- Emphasize emergency situations requiring immediate care
- Maintain patient safety as top priority

RESPONSE FORMAT:
Provide structured, actionable medical guidance with:
1. Assessment - Clear analysis of symptoms
2. Recommendations - Specific, actionable steps  
3. Indian Context - Regional/cultural considerations
4. Next Steps - Clear guidance on follow-up care
5. Emergency Flags - When to seek immediate help`;
  }

  /**
   * Build comprehensive user prompt
   */
  private buildUserPrompt(context: PromptContext, emergencyFlags: string[], seasonalContext: string): string {
    let prompt = `PATIENT CONSULTATION REQUEST:

Chief Complaint:
${context.symptoms}

Patient Details:`;

    if (context.age) prompt += `\n- Age: ${context.age}`;
    if (context.gender) prompt += `\n- Gender: ${context.gender}`;
    if (context.location) prompt += `\n- Location: ${context.location}`;
    if (context.language) prompt += `\n- Preferred Language: ${context.language}`;

    if (context.history) {
      prompt += `\n\nMedical History:\n${context.history}`;
    }

    if (context.allergies && context.allergies.length > 0) {
      prompt += `\n\nKnown Allergies:\n${context.allergies.join(', ')}`;
    }

    if (emergencyFlags.length > 0) {
      prompt += `\n\nEMERGENCY FLAGS DETECTED:\n${emergencyFlags.join(', ')}`;
    }

    if (context.sessionHistory && context.sessionHistory.length > 0) {
      prompt += `\n\nPrevious Conversation:\n${context.sessionHistory.slice(-3).join('\n')}`;
    }

    if (context.ocrResults && context.ocrResults.length > 0) {
      prompt += `\n\nOCR Text from Medical Documents:\n${context.ocrResults.join('\n')}`;
    }

    if (context.medicalImages && context.medicalImages.length > 0) {
      prompt += `\n\nMedical Images Provided: ${context.medicalImages.length} image(s) for analysis`;
    }

    if (context.previousDiagnosis && context.previousDiagnosis.length > 0) {
      prompt += `\n\nPrevious Diagnoses:\n${context.previousDiagnosis.join(', ')}`;
    }

    prompt += `\n\nContextual Information:\n${seasonalContext}`;

    if (context.consultationType) {
      prompt += `\n\nConsultation Type: ${context.consultationType}`;
    }

    prompt += `\n\nPlease provide your medical assessment and recommendations following the structured format.`;

    return prompt;
  }

  /**
   * Build Indian medical context with enhanced regional awareness
   */
  private buildIndianContext(context: PromptContext): string {
    const contextElements = [];

    // Seasonal diseases
    const month = new Date().getMonth();
    if (month >= 6 && month <= 9) {
      contextElements.push('Monsoon season: High risk of dengue, malaria, chikungunya, leptospirosis, and water-borne diseases');
      contextElements.push('Post-flood risks: Leptospirosis (especially Kerala, coastal areas), skin infections, GI diseases');
    } else if (month >= 3 && month <= 5) {
      contextElements.push('Summer season: Risk of heat stroke, dehydration, food poisoning, and viral gastroenteritis');
    } else {
      contextElements.push('Winter season: Respiratory infections, joint pain, and cardiac events more common');
    }

    // Economic considerations
    contextElements.push('Healthcare accessibility: Government hospitals (free/subsidized), private clinics, AYUSH facilities, and home remedies are common treatment approaches');

    // Cultural factors
    contextElements.push('Family involvement: Healthcare decisions often involve family members in Indian culture');

    // Enhanced regional diseases based on location
    if (context.location) {
      const location = context.location.toLowerCase();
      
      // Metro cities - pollution
      if (location.includes('mumbai') || location.includes('delhi') || location.includes('bangalore') || location.includes('chennai') || location.includes('kolkata')) {
        contextElements.push('Urban health issues: Air pollution-related respiratory problems, stress disorders, and lifestyle diseases common');
      }
      
      // Kerala specific
      if (location.includes('kerala') || location.includes('kochi') || location.includes('trivandrum')) {
        contextElements.push('KERALA SPECIFIC: High vigilance for Leptospirosis (post-floods), Nipah virus (in outbreak areas), Scrub typhus (after agricultural work)');
        contextElements.push('Emergency: 108 ambulance, Govt Medical College hospitals have Nipah isolation facilities');
      }
      
      // Karnataka specific
      if (location.includes('karnataka') || location.includes('bangalore') || location.includes('mysore') || location.includes('mangalore')) {
        contextElements.push('KARNATAKA SPECIFIC: Scrub typhus common in Western Ghats/Malnad areas, Dengue in urban areas, KFD (Kyasanur Forest Disease) in specific districts');
      }
      
      // Tamil Nadu specific
      if (location.includes('tamil') || location.includes('chennai') || location.includes('madurai') || location.includes('coimbatore')) {
        contextElements.push('TAMIL NADU SPECIFIC: Scrub typhus in rural/agricultural areas, Dengue in urban, Leptospirosis in coastal/flood areas');
      }
      
      // Andhra/Telangana specific
      if (location.includes('andhra') || location.includes('telangana') || location.includes('hyderabad') || location.includes('vizag')) {
        contextElements.push('TELANGANA/AP SPECIFIC: Scrub typhus in agricultural areas, seasonal dengue outbreaks, fluorosis in certain districts');
      }
      
      // Bengal/Bihar specific
      if (location.includes('bengal') || location.includes('kolkata') || location.includes('bihar') || location.includes('jharkhand')) {
        contextElements.push('BENGAL/BIHAR SPECIFIC: Kala-azar (Visceral Leishmaniasis) endemic in certain districts - prolonged fever + splenomegaly, Japanese Encephalitis in monsoon');
        contextElements.push('Kala-azar treatment: Free at govt hospitals, Liposomal Amphotericin B available');
      }
      
      // Gujarat specific
      if (location.includes('gujarat') || location.includes('kutch') || location.includes('ahmedabad')) {
        contextElements.push('GUJARAT SPECIFIC: Cutaneous Leishmaniasis in Kutch region, leptospirosis in Surat after floods, fluorosis in certain areas');
      }
      
      // Maharashtra specific
      if (location.includes('maharashtra') || location.includes('mumbai') || location.includes('pune')) {
        contextElements.push('MAHARASHTRA SPECIFIC: Leptospirosis in Mumbai during floods, Scrub typhus in Konkan, H1N1 seasonal outbreaks');
      }
      
      // North India
      if (location.includes('rajasthan') || location.includes('punjab') || location.includes('haryana') || location.includes('up') || location.includes('mp')) {
        contextElements.push('NORTH INDIA SPECIFIC: Heat-related illnesses in summer, respiratory infections in winter, Japanese Encephalitis in UP/Bihar border');
      }
    }

    // Language considerations with full 8-language support
    if (context.language && context.language.toLowerCase() !== 'english') {
      const langKey = context.language.toLowerCase();
      const langMeta = LANGUAGE_METADATA[langKey as keyof typeof LANGUAGE_METADATA];
      if (langMeta) {
        contextElements.push(`Language: Patient prefers ${langMeta.name} (${langMeta.nativeName}) from ${langMeta.region} - use culturally appropriate medical explanations`);
      } else {
        contextElements.push(`Language: Patient prefers ${context.language} - use simple medical terms and cultural context`);
      }
    }

    // Available treatment options
    contextElements.push('Treatment options: Allopathic medicine (primary), Ayurveda, Unani, Siddha, Homeopathy, and validated home remedies');
    contextElements.push('Emergency services: 108 National Emergency Number, 102 Mother-Child ambulance, government hospital emergency departments');
    contextElements.push('Important helplines: Mental Health - KIRAN 1800-599-0019 (24/7 free), Poison control centers in major cities');

    return contextElements.join('\n');
  }

  /**
   * Get seasonal medical context
   */
  private getSeasonalContext(): string {
    const now = new Date();
    const month = now.getMonth();
    const timeContext = [];

    // Seasonal diseases
    if (month >= 6 && month <= 9) {
      timeContext.push('Monsoon season (June-September): Increased vector-borne diseases, fungal infections, and GI issues due to contaminated water');
    } else if (month >= 10 && month <= 2) {
      timeContext.push('Post-monsoon/Winter (October-February): Respiratory infections, joint pain, and cardiovascular issues more common');
    } else {
      timeContext.push('Summer season (March-May): Heat-related illnesses, dehydration, and food poisoning risks increase');
    }

    // Time of day considerations
    const hour = now.getHours();
    if (hour >= 22 || hour <= 6) {
      timeContext.push('Night consultation: Limited emergency services, focus on home management unless critical');
    } else if (hour >= 6 && hour <= 18) {
      timeContext.push('Day consultation: Full healthcare services available, easier specialist referrals');
    }

    // Festival seasons (approximate)
    if (month === 9 || month === 10) {
      timeContext.push('Festival season: Increased travel, dietary changes, and stress-related health issues');
    }

    return timeContext.join('. ');
  }

  /**
   * Detect emergency flags in symptoms - Enhanced with 8 Indian languages
   */
  private detectEmergencyFlags(symptoms: string): string[] {
    const flags = [];
    const lowerSymptoms = symptoms.toLowerCase();

    for (const indicator of this.EMERGENCY_INDICATORS) {
      if (lowerSymptoms.includes(indicator.toLowerCase())) {
        flags.push(`${indicator.toUpperCase()}`);
      }
    }

    // Enhanced Indian-specific emergency patterns covering all 8 languages
    const indianEmergencyPatterns = {
      // Hindi
      hindi: ['तेज़ बुखार', 'सांस लेने में तकलीफ', 'सीने में दर्द', 'बेहोश', 'खून', 'लकवा', 'heart attack'],
      // Tamil
      tamil: ['காய்ச்சல் அதிகம்', 'மூச்சு வாங்குவதில் சிரமம்', 'நெஞ்சு வலி', 'மயக்கம்', 'ரத்தம்'],
      // Telugu
      telugu: ['అధిక జ్వరం', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'ఛాతీ నొప్పి', 'స్పృహ తప్పడం', 'రక్తం'],
      // Marathi
      marathi: ['खूप ताप', 'श्वास घेण्यात त्रास', 'छातीत दुखणे', 'बेशुद्ध', 'रक्त'],
      // Kannada
      kannada: ['ತುಂಬಾ ಜ್ವರ', 'ಉಸಿರಾಟದ ತೊಂದರೆ', 'ಎದೆ ನೋವು', 'ಪ್ರಜ್ಞಾಹೀನ', 'ರಕ್ತ'],
      // Bengali
      bengali: ['খুব জ্বর', 'শ্বাস নিতে কষ্ট', 'বুকে ব্যথা', 'অজ্ঞান', 'রক্ত'],
      // Gujarati
      gujarati: ['ખૂબ તાવ', 'શ્વાસ લેવામાં તકલીફ', 'છાતીમાં દુખાવો', 'બેભાન', 'લોહી'],
      // Malayalam
      malayalam: ['കടുത്ത പനി', 'ശ്വാസം മുട്ടൽ', 'നെഞ്ചുവേദന', 'ബോധക്കേട്', 'രക്തം']
    };

    for (const [lang, patterns] of Object.entries(indianEmergencyPatterns)) {
      for (const pattern of patterns) {
        if (symptoms.includes(pattern)) {
          flags.push(`${pattern} (${lang.toUpperCase()} - Emergency indicator detected)`);
        }
      }
    }
    
    // Additional romanized emergency keywords common in India
    const romanizedEmergency = [
      'heart attack', 'paralysis', 'stroke', 'unconscious', 'behosh', 'blood vomit',
      'severe bleeding', 'accident', 'poisoning', 'snake bite', 'dog bite',
      'seene mein dard', 'ek taraf kamzori', 'nazar jaana', 'aankh ka dard'
    ];
    
    for (const term of romanizedEmergency) {
      if (lowerSymptoms.includes(term)) {
        flags.push(`${term.toUpperCase()} - CRITICAL`);
      }
    }

    return flags;
  }

  /**
   * Assess consultation priority
   */
  private assessPriority(context: PromptContext): 'low' | 'medium' | 'high' | 'critical' {
    const symptoms = context.symptoms.toLowerCase();
    
    // Critical priority
    const criticalIndicators = ['chest pain', 'difficulty breathing', 'severe headache', 'unconscious', 'severe bleeding'];
    if (criticalIndicators.some(indicator => symptoms.includes(indicator))) {
      return 'critical';
    }

    // High priority  
    const highIndicators = ['high fever', 'severe pain', 'vomiting blood', 'severe diarrhea', 'sudden weakness'];
    if (highIndicators.some(indicator => symptoms.includes(indicator))) {
      return 'high';
    }

    // Medium priority
    const mediumIndicators = ['fever', 'pain', 'headache', 'nausea', 'fatigue'];
    if (mediumIndicators.some(indicator => symptoms.includes(indicator))) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * 📝 Build complete context for LLM
   */
  private buildFullContext(context: PromptContext, indianContext: string, seasonalContext: string): string {
    const fullContext = [];

    fullContext.push('MEDICAL CONSULTATION CONTEXT:');
    fullContext.push(`Priority: ${this.assessPriority(context).toUpperCase()}`);
    fullContext.push(`Language: ${context.language || 'English'}`);
    
    if (context.age) fullContext.push(`Patient Age: ${context.age}`);
    if (context.location) fullContext.push(`Location: ${context.location}`);
    
    fullContext.push('\nINDIAN MEDICAL CONTEXT:');
    fullContext.push(indianContext);
    
    fullContext.push('\nSEASONAL/TEMPORAL CONTEXT:');
    fullContext.push(seasonalContext);

    if (context.emergencyFlags && context.emergencyFlags.length > 0) {
      fullContext.push('\nEMERGENCY FLAGS:');
      fullContext.push(context.emergencyFlags.join(', '));
    }

    return fullContext.join('\n');
  }

  /**
   * Generate follow-up prompts
   */
  generateFollowUpPrompt(previousResponse: AgentResponse, newSymptoms?: string): GeneratedPrompt {
    const context: PromptContext = {
      symptoms: newSymptoms || 'Follow-up consultation',
      language: 'english',
      consultationType: 'follow-up',
      sessionHistory: [`Previous assessment: ${previousResponse.reasoning}`]
    };

    const systemPrompt = `You are conducting a follow-up medical consultation. 
    Previous assessment: ${previousResponse.reasoning}
    Previous recommendations: ${previousResponse.recommendations.join(', ')}
    
    Focus on:
    1. Tracking symptom progression
    2. Evaluating treatment effectiveness  
    3. Adjusting recommendations based on changes
    4. Identifying any new concerns
    5. Determining next steps in care`;

    return this.buildMedicalPrompt(context, 'diagnostic');
  }
}

export const dynamicPromptBuilder = new DynamicPromptBuilder();