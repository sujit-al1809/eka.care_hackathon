/**
 * 5-Agent Medical System
 * Multi-agent architecture for Indian medical consultation
 */

export interface PatientContext {
  symptoms: string;
  language: string;
  history?: string;
  allergies?: string[];
  emergencyFlags?: string[];
  location?: string; // For regional diseases
  age?: number;
  gender?: string;
}

export interface AgentResponse {
  agentType: 'primary' | 'diagnostic' | 'emergency' | 'treatment' | 'imaging';
  confidence: number;
  reasoning: string;
  recommendations: string[];
  nextAgent?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  indianContext?: string; // Regional/cultural considerations
}

// Indian Medical Context Mappings
export const INDIAN_MEDICAL_TERMS = {
  'loose motions': 'diarrhea',
  'sugar': 'diabetes',
  'body pain': 'myalgia',
  'pet mein dard': 'abdominal pain',
  'sir dard': 'headache',
  'bukhar': 'fever',
  'khasi': 'cough',
  'saans lene mein takleef': 'breathing difficulty',
  'chakkar aana': 'dizziness',
  'ulti': 'vomiting',
  'dast': 'diarrhea',
  'pet kharab': 'stomach upset',
  'gas': 'flatulence',
  'acidity': 'acid reflux',
  'weakness': 'fatigue'
};

// Regional Disease Patterns
export const REGIONAL_DISEASES = {
  monsoon: ['dengue', 'malaria', 'chikungunya', 'typhoid', 'hepatitis_a'],
  summer: ['heat_stroke', 'dehydration', 'food_poisoning'],
  winter: ['respiratory_infections', 'pneumonia', 'arthritis_flare'],
  year_round: ['diabetes', 'hypertension', 'tuberculosis']
};

// Emergency Red Flags
export const EMERGENCY_FLAGS = {
  cardiac: ['chest pain', 'shortness of breath', 'palpitations', 'sweating with chest pain'],
  stroke: ['sudden weakness', 'speech difficulty', 'face drooping', 'severe headache'],
  sepsis: ['high fever with confusion', 'rapid heart rate', 'difficulty breathing'],
  pediatric: ['difficulty breathing in child', 'high fever in infant', 'lethargy in child'],
  obstetric: ['severe abdominal pain pregnancy', 'bleeding pregnancy', 'severe headache pregnancy']
};

export class MedicalAgentSystem {
  /**
   * Primary Agent - Routes to specialists
   */
  async primaryAgent(context: PatientContext): Promise<AgentResponse> {
    const normalizedSymptoms = this.normalizeIndianTerms(context.symptoms);
    const emergencyLevel = this.checkEmergencyFlags(normalizedSymptoms);
    
    if (emergencyLevel === 'critical') {
      return {
        agentType: 'emergency',
        confidence: 0.95,
        reasoning: 'Critical symptoms detected - immediate medical attention required',
        recommendations: ['Call emergency services', 'Rush to nearest hospital'],
        nextAgent: 'emergency',
        urgencyLevel: 'critical',
        indianContext: 'Contact 108 (National Emergency Number) or nearest government hospital'
      };
    }

    // Route to appropriate specialist based on symptoms
    const specialization = this.getSpecialization(normalizedSymptoms);
    
    return {
      agentType: 'primary',
      confidence: 0.85,
      reasoning: `Symptoms suggest ${specialization} consultation based on Indian medical patterns`,
      recommendations: [`Consult ${specialization}`, 'Continue with diagnostic assessment'],
      nextAgent: 'diagnostic',
      urgencyLevel: emergencyLevel,
      indianContext: this.getIndianContext(normalizedSymptoms, context.location)
    };
  }

  /**
   * Diagnostic Agent - Symptom structuring + severity
   */
  async diagnosticAgent(context: PatientContext): Promise<AgentResponse> {
    const structuredSymptoms = this.structureSymptoms(context.symptoms);
    const severity = this.calculateSeverity(structuredSymptoms);
    const differentialDx = this.generateDifferentialDiagnosis(structuredSymptoms);

    return {
      agentType: 'diagnostic',
      confidence: 0.88,
      reasoning: `Structured analysis reveals ${severity} severity with ${differentialDx.length} possible conditions`,
      recommendations: differentialDx,
      nextAgent: severity === 'high' ? 'emergency' : 'treatment',
      urgencyLevel: this.mapSeverityToUrgency(severity),
      indianContext: this.getRegionalDiseaseContext(structuredSymptoms, context.location)
    };
  }

  /**
   * 🚨 Emergency Agent - Red flags detection
   */
  async emergencyAgent(context: PatientContext): Promise<AgentResponse> {
    const emergencyFlags = this.detectEmergencyFlags(context.symptoms);
    const criticalSigns = this.checkCriticalSigns(context.symptoms);

    if (criticalSigns.length > 0) {
      return {
        agentType: 'emergency',
        confidence: 0.92,
        reasoning: `Critical signs detected: ${criticalSigns.join(', ')}`,
        recommendations: [
          'Immediate hospital visit required',
          'Do not delay - call 108',
          'Prepare for emergency care'
        ],
        urgencyLevel: 'critical',
        indianContext: 'Nearest government hospital with emergency services recommended'
      };
    }

    return {
      agentType: 'emergency',
      confidence: 0.75,
      reasoning: 'Emergency assessment completed - manageable condition',
      recommendations: ['Continue with treatment planning'],
      nextAgent: 'treatment',
      urgencyLevel: 'medium'
    };
  }

  /**
   * 💊 Treatment Agent - Plans with Indian meds
   */
  async treatmentAgent(context: PatientContext): Promise<AgentResponse> {
    const treatmentPlan = this.generateIndianTreatmentPlan(context);
    const homeRemedies = this.getIndianHomeRemedies(context.symptoms);
    const medications = this.getIndianMedications(context.symptoms);

    return {
      agentType: 'treatment',
      confidence: 0.82,
      reasoning: 'Treatment plan generated with Indian medical practices and available medications',
      recommendations: [
        ...treatmentPlan,
        ...homeRemedies.slice(0, 2), // Top 2 home remedies
        ...medications
      ],
      urgencyLevel: 'low',
      indianContext: 'Treatment plan considers Indian dietary habits, climate, and available medicines'
    };
  }

  /**
   * 📸 Imaging Agent - X-ray analysis placeholder
   */
  async imagingAgent(context: PatientContext, imageData?: string): Promise<AgentResponse> {
    // Placeholder for X-ray analysis
    return {
      agentType: 'imaging',
      confidence: 0.70,
      reasoning: 'Imaging analysis available - upload X-ray/CT scan for detailed assessment',
      recommendations: ['Upload medical images for analysis', 'Consult radiologist if needed'],
      urgencyLevel: 'low',
      indianContext: 'Government hospitals provide affordable imaging services'
    };
  }

  // Helper Methods
  private normalizeIndianTerms(symptoms: string): string {
    let normalized = symptoms.toLowerCase();
    Object.entries(INDIAN_MEDICAL_TERMS).forEach(([indian, english]) => {
      normalized = normalized.replace(new RegExp(indian, 'gi'), english);
    });
    return normalized;
  }

  private checkEmergencyFlags(symptoms: string): 'low' | 'medium' | 'high' | 'critical' {
    for (const [category, flags] of Object.entries(EMERGENCY_FLAGS)) {
      for (const flag of flags) {
        if (symptoms.toLowerCase().includes(flag.toLowerCase())) {
          return 'critical';
        }
      }
    }

    // Check for medium priority symptoms
    const mediumFlags = ['high fever', 'severe pain', 'persistent vomiting', 'difficulty breathing'];
    for (const flag of mediumFlags) {
      if (symptoms.toLowerCase().includes(flag.toLowerCase())) {
        return 'high';
      }
    }

    return 'medium';
  }

  private getSpecialization(symptoms: string): string {
    const specializations = {
      'chest pain|heart|cardiac': 'Cardiologist',
      'skin|rash|allergy': 'Dermatologist',
      'stomach|abdominal|digestive': 'Gastroenterologist',
      'headache|migraine|neurological': 'Neurologist',
      'joint|bone|arthritis': 'Orthopedist',
      'cough|breathing|lung': 'Pulmonologist',
      'eye|vision': 'Ophthalmologist',
      'ear|hearing|throat': 'ENT Specialist',
      'pregnancy|gynecological': 'Gynecologist',
      'child|pediatric|infant': 'Pediatrician'
    };

    for (const [pattern, specialist] of Object.entries(specializations)) {
      if (new RegExp(pattern, 'i').test(symptoms)) {
        return specialist;
      }
    }

    return 'General Physician';
  }

  private getIndianContext(symptoms: string, location?: string): string {
    const contexts = [];
    
    // Seasonal context
    const month = new Date().getMonth();
    if (month >= 6 && month <= 9) { // Monsoon
      contexts.push('Monsoon season - higher risk of dengue, malaria, and water-borne diseases');
    } else if (month >= 3 && month <= 5) { // Summer
      contexts.push('Summer season - stay hydrated, risk of heat-related illnesses');
    }

    // Common Indian health issues
    if (symptoms.includes('diabetes') || symptoms.includes('sugar')) {
      contexts.push('Common in India - consider dietary changes including roti, rice alternatives');
    }

    if (symptoms.includes('tuberculosis') || symptoms.includes('tb')) {
      contexts.push('TB treatment available free at government hospitals under DOTS program');
    }

    return contexts.join('. ');
  }

  private structureSymptoms(symptoms: string): any {
    // Structure symptoms into categories
    return {
      chief_complaint: symptoms,
      duration: this.extractDuration(symptoms),
      severity: this.extractSeverity(symptoms),
      associated_symptoms: this.extractAssociatedSymptoms(symptoms)
    };
  }

  private extractDuration(symptoms: string): string {
    const durationPatterns = [
      /(\d+)\s*(day|days|din|दिन)/i,
      /(\d+)\s*(week|weeks|hafta|हफ्ता)/i,
      /(\d+)\s*(month|months|mahina|महीना)/i
    ];

    for (const pattern of durationPatterns) {
      const match = symptoms.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return 'recent onset';
  }

  private extractSeverity(symptoms: string): 'mild' | 'moderate' | 'severe' {
    const severeKeywords = ['severe', 'intense', 'unbearable', 'तेज़', 'बहुत'];
    const mildKeywords = ['mild', 'slight', 'little', 'हल्का', 'थोड़ा'];

    const lowerSymptoms = symptoms.toLowerCase();
    
    if (severeKeywords.some(keyword => lowerSymptoms.includes(keyword.toLowerCase()))) {
      return 'severe';
    }
    
    if (mildKeywords.some(keyword => lowerSymptoms.includes(keyword.toLowerCase()))) {
      return 'mild';
    }

    return 'moderate';
  }

  private extractAssociatedSymptoms(symptoms: string): string[] {
    const commonSymptoms = [
      'fever', 'headache', 'nausea', 'vomiting', 'diarrhea', 
      'fatigue', 'weakness', 'dizziness', 'pain', 'cough'
    ];

    return commonSymptoms.filter(symptom => 
      symptoms.toLowerCase().includes(symptom.toLowerCase())
    );
  }

  private calculateSeverity(structuredSymptoms: any): 'low' | 'medium' | 'high' {
    if (structuredSymptoms.severity === 'severe' || 
        structuredSymptoms.associated_symptoms.length > 3) {
      return 'high';
    }
    
    if (structuredSymptoms.severity === 'moderate' || 
        structuredSymptoms.associated_symptoms.length > 1) {
      return 'medium';
    }

    return 'low';
  }

  private generateDifferentialDiagnosis(structuredSymptoms: any): string[] {
    // Simple differential diagnosis based on symptoms
    const symptoms = structuredSymptoms.chief_complaint.toLowerCase();
    
    if (symptoms.includes('fever') && symptoms.includes('headache')) {
      return ['Viral fever', 'Dengue (if monsoon)', 'Malaria', 'Typhoid'];
    }
    
    if (symptoms.includes('stomach') || symptoms.includes('abdominal')) {
      return ['Gastroenteritis', 'Food poisoning', 'Peptic ulcer', 'Appendicitis'];
    }
    
    if (symptoms.includes('chest') && symptoms.includes('pain')) {
      return ['Cardiac issue (urgent)', 'Acid reflux', 'Muscle strain', 'Respiratory infection'];
    }

    return ['General consultation needed', 'Symptomatic treatment', 'Follow-up in 2-3 days'];
  }

  private mapSeverityToUrgency(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  }

  private getRegionalDiseaseContext(structuredSymptoms: any, location?: string): string {
    const month = new Date().getMonth();
    const season = month >= 6 && month <= 9 ? 'monsoon' : 
                   month >= 3 && month <= 5 ? 'summer' : 'winter';
    
    const seasonalDiseases = REGIONAL_DISEASES[season] || [];
    
    if (seasonalDiseases.length > 0) {
      return `${season} season diseases to consider: ${seasonalDiseases.slice(0, 3).join(', ')}`;
    }

    return 'Consider common Indian health patterns';
  }

  private detectEmergencyFlags(symptoms: string): string[] {
    const flags = [];
    const lowerSymptoms = symptoms.toLowerCase();

    for (const [category, flagList] of Object.entries(EMERGENCY_FLAGS)) {
      for (const flag of flagList) {
        if (lowerSymptoms.includes(flag.toLowerCase())) {
          flags.push(`${category}: ${flag}`);
        }
      }
    }

    return flags;
  }

  private checkCriticalSigns(symptoms: string): string[] {
    const criticalSigns = [
      'chest pain with sweating',
      'difficulty breathing',
      'sudden weakness',
      'severe headache',
      'high fever with confusion',
      'severe abdominal pain'
    ];

    return criticalSigns.filter(sign => 
      symptoms.toLowerCase().includes(sign.toLowerCase())
    );
  }

  private generateIndianTreatmentPlan(context: PatientContext): string[] {
    const plan = [];
    const symptoms = context.symptoms.toLowerCase();

    // Common Indian treatment approaches
    if (symptoms.includes('fever') || symptoms.includes('बुखार')) {
      plan.push('Rest and increase fluid intake');
      plan.push('Paracetamol 500mg if fever >101°F');
      plan.push('Light diet - khichdi, soup, fruits');
    }

    if (symptoms.includes('cough') || symptoms.includes('खासी')) {
      plan.push('Warm water with honey and ginger');
      plan.push('Steam inhalation 2-3 times daily');
      plan.push('Avoid cold foods and drinks');
    }

    if (symptoms.includes('stomach') || symptoms.includes('पेट')) {
      plan.push('BRAT diet (Banana, Rice, Apple, Toast)');
      plan.push('ORS solution for hydration');
      plan.push('Avoid spicy and oily foods');
    }

    return plan;
  }

  private getIndianHomeRemedies(symptoms: string): string[] {
    const remedies = [];
    const lowerSymptoms = symptoms.toLowerCase();

    if (lowerSymptoms.includes('cough')) {
      remedies.push('🫖 Honey + ginger tea 2-3 times daily');
      remedies.push('🌿 Tulsi (basil) leaves with warm water');
    }

    if (lowerSymptoms.includes('cold') || lowerSymptoms.includes('fever')) {
      remedies.push('🧄 Garlic + turmeric milk before bed');
      remedies.push('💨 Steam inhalation with ajwain (carom seeds)');
    }

    if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('acidity')) {
      remedies.push('🥥 Coconut water for natural electrolytes');
      remedies.push('🌿 Jeera (cumin) water on empty stomach');
    }

    if (lowerSymptoms.includes('headache')) {
      remedies.push('🧘 Balm application on temples');
      remedies.push('🫖 Ginger tea with cardamom');
    }

    return remedies.slice(0, 3); // Return top 3 remedies
  }

  private getIndianMedications(symptoms: string): string[] {
    const meds = [];
    const lowerSymptoms = symptoms.toLowerCase();

    if (lowerSymptoms.includes('fever')) {
      meds.push('💊 Paracetamol 500mg (Crocin/Dolo) every 6-8 hours');
    }

    if (lowerSymptoms.includes('pain')) {
      meds.push('💊 Ibuprofen 400mg (Brufen) if no stomach issues');
    }

    if (lowerSymptoms.includes('acidity') || lowerSymptoms.includes('gas')) {
      meds.push('💊 Pantoprazole 40mg (Pan-40) before breakfast');
      meds.push('💊 Simethicone (Digene) after meals');
    }

    if (lowerSymptoms.includes('cough')) {
      meds.push('Benadryl cough syrup (5ml) 3 times daily');
    }

    meds.push('Consult pharmacist/doctor before taking any medication');
    
    return meds;
  }
}

export const medicalAgentSystem = new MedicalAgentSystem();