import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Hindi/Indian language keywords for specialists
const specialistKeywords: Record<string, string[]> = {
  "General Physician": [
    // English
    "fever", "cold", "cough", "flu", "headache", "pain", "general", "health", "tired", "fatigue", "weakness",
    // Hindi
    "बुखार", "सर्दी", "खांसी", "सिरदर्द", "दर्द", "थकान", "कमजोरी", "बीमार",
    // Tamil
    "காய்ச்சல்", "இருமல்", "தலைவலி",
    // Telugu
    "జ్వరం", "దగ్గు", "తలనొప్పి"
  ],
  "Pediatrician": [
    "child", "baby", "infant", "kid", "toddler", "children", "pediatric", "growth", "development",
    "बच्चा", "शिशु", "बच्चे", "குழந்தை", "పిల్లల"
  ],
  "Dermatologist": [
    "skin", "rash", "acne", "itch", "dermatitis", "eczema", "mole", "hair", "nail", "allergy",
    "त्वचा", "खुजली", "दाने", "एलर्जी", "சருமம்", "அரிப்பு", "చర్మం"
  ],
  "Psychologist": [
    "stress", "anxiety", "depression", "mental", "mood", "sleep", "trauma", "emotion", "behavior", "panic", "fear",
    "तनाव", "चिंता", "अवसाद", "नींद", "डर", "மன", "பயம்", "మానసిక"
  ],
  "Nutritionist": [
    "diet", "weight", "nutrition", "food", "eating", "appetite", "obesity", "underweight", "meal", "vitamin", "deficiency",
    "वजन", "खाना", "मोटापा", "உணவு", "எடை", "ఆహారం", "బరువు"
  ],
  "Cardiologist": [
    "heart", "chest", "blood pressure", "hypertension", "palpitation", "cardiovascular", "cholesterol",
    "दिल", "छाती", "रक्तचाप", "இதயம்", "நெஞ்சு", "గుండె", "ఛాతీ"
  ],
  "ENT Specialist": [
    "ear", "nose", "throat", "hearing", "sinus", "voice", "snoring", "tonsil", "neck", "smell", "taste",
    "कान", "नाक", "गला", "காது", "மூக்கு", "தொண்டை", "చెవి", "ముక్కు", "గొంతు"
  ],
  "Orthopedic": [
    "bone", "joint", "muscle", "back", "spine", "knee", "shoulder", "fracture", "sprain", "arthritis",
    "हड्डी", "जोड़", "पीठ", "घुटना", "எலும்பு", "மூட்டு", "ఎముక", "కీలు"
  ],
  "Gynecologist": [
    "menstrual", "period", "pregnancy", "uterus", "ovary", "vaginal", "women", "female", "reproductive", "pelvic",
    "मासिक", "गर्भावस्था", "महिला", "மாதவிடாய்", "கர்ப்பம்", "రుతుస్రావం", "గర్భం"
  ],
  "Dentist": [
    "tooth", "teeth", "gum", "dental", "mouth", "jaw", "bite", "cavity", "oral", "tongue",
    "दांत", "मसूड़े", "मुंह", "பல்", "ஈறு", "దంతం", "నోరు"
  ]
};

async function translateToEnglish(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Translate this medical symptom description to English. Only output the translation, nothing else: "${text}"`
    );
    return result.response.text();
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

function findDoctorBySymptoms(symptoms: string) {
  const lowercaseSymptoms = symptoms.toLowerCase();
  const matchCounts: Record<string, number> = {};

  Object.entries(specialistKeywords).forEach(([specialist, keywords]) => {
    matchCounts[specialist] = keywords.filter(keyword =>
      lowercaseSymptoms.includes(keyword.toLowerCase())
    ).length;
  });

  let bestMatch = "General Physician";
  let highestCount = 0;

  Object.entries(matchCounts).forEach(([specialist, count]) => {
    if (count > highestCount) {
      highestCount = count;
      bestMatch = specialist;
    }
  });

  const doctor = AIDoctorAgents.find(doc => doc.specialist === bestMatch);
  return doctor || AIDoctorAgents[0];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notes } = body;

    if (!notes) {
      return NextResponse.json({ error: "Notes are required" }, { status: 400 });
    }

    if (notes.trim().length < 5) {
      const defaultDoctor = AIDoctorAgents[0];
      if (!defaultDoctor.image.startsWith("http")) {
        defaultDoctor.image = defaultDoctor.image || "/doctor1.png";
      }
      return NextResponse.json(defaultDoctor);
    }

    // Check if text contains non-English characters (Indian languages)
    const hasNonEnglish = /[^\x00-\x7F]/.test(notes);
    
    let searchText = notes;
    if (hasNonEnglish) {
      // Translate to English for better matching
      const translated = await translateToEnglish(notes);
      searchText = notes + " " + translated;
    }

    const matchedDoctor = findDoctorBySymptoms(searchText);

    if (matchedDoctor && !matchedDoctor.image.startsWith("http")) {
      matchedDoctor.image = matchedDoctor.image || "/doctor1.png";
    }

    return NextResponse.json(matchedDoctor);
  } catch (error) {
    console.error("Request processing error:", error);

    const defaultDoctor = AIDoctorAgents[0];
    if (defaultDoctor.image && !defaultDoctor.image.startsWith("http")) {
      defaultDoctor.image = defaultDoctor.image || "/doctor1.png";
    }
    return NextResponse.json(defaultDoctor);
  }
}