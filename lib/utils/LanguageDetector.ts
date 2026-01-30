/**
 * Language Detection Utility for Indian Medical AI
 * Detects language from user input to provide appropriate medical responses
 */

import { LANGUAGE_METADATA } from '../data/MedicalKnowledgeBase';

interface LanguageDetectionResult {
    detectedLanguage: string;
    confidence: number;
    languageMetadata?: typeof LANGUAGE_METADATA[keyof typeof LANGUAGE_METADATA];
    isIndianLanguage: boolean;
}

// Character ranges for Indian scripts
const SCRIPT_PATTERNS = {
    hindi: /[\u0900-\u097F]/g,        // Devanagari (Hindi/Marathi/Sanskrit)
    marathi: /[\u0900-\u097F]/g,      // Also Devanagari
    tamil: /[\u0B80-\u0BFF]/g,        // Tamil script
    telugu: /[\u0C00-\u0C7F]/g,       // Telugu script
    kannada: /[\u0C80-\u0CFF]/g,      // Kannada script
    bengali: /[\u0980-\u09FF]/g,      // Bengali script
    gujarati: /[\u0A80-\u0AFF]/g,     // Gujarati script
    malayalam: /[\u0D00-\u0D7F]/g,    // Malayalam script
};

// Common words in romanized Indian languages for detection
const ROMANIZED_PATTERNS: Record<string, string[]> = {
    hindi: [
        'mujhe', 'mera', 'hai', 'hain', 'tha', 'thi', 'kya', 'kaise', 'kab', 'kyun',
        'bukhar', 'dard', 'pet', 'sir', 'aankh', 'paani', 'khana', 'dawai', 'doctor',
        'theek', 'bura', 'achha', 'bahut', 'thoda', 'zyada', 'kam', 'jyada',
        'nahi', 'haan', 'ji', 'aur', 'lekin', 'agar', 'toh', 'bhi'
    ],
    marathi: [
        'mala', 'maze', 'aahe', 'hote', 'kay', 'kasa', 'keva', 'ka',
        'taap', 'dukhte', 'pot', 'doke', 'pani', 'khane', 'aushadh',
        'thik', 'vaait', 'changle', 'khup', 'thode', 'jast',
        'nahi', 'ho', 'ani', 'pan', 'tar'
    ],
    tamil: [
        'enakku', 'ennoda', 'irukku', 'irundhudhu', 'enna', 'eppadi', 'eppo', 'en',
        'kaichal', 'vali', 'vayiru', 'thala', 'thanni', 'saapadu', 'marundhu',
        'nalla', 'mosam', 'romba', 'konjam', 'adhigam',
        'illa', 'aama', 'um', 'aana', 'appo'
    ],
    telugu: [
        'naaku', 'naa', 'undi', 'undedi', 'enti', 'ela', 'eppudu', 'enduku',
        'jwaram', 'noppi', 'kallu', 'tala', 'neellu', 'annam', 'marundu',
        'manchidi', 'cheddadi', 'chala', 'konchem', 'ekkuva',
        'ledu', 'avunu', 'mariyu', 'kani', 'aithe'
    ],
    kannada: [
        'nanage', 'nanna', 'ide', 'ittu', 'enu', 'hegae', 'yaavaga', 'yaake',
        'jwara', 'novu', 'hotte', 'tale', 'neeru', 'oota', 'marandu',
        'olleyadhu', 'kedu', 'tumba', 'swalpa', 'hechchu',
        'illa', 'haudu', 'mattu', 'aadre', 'andre'
    ],
    bengali: [
        'amar', 'amake', 'achhe', 'chhilo', 'ki', 'kemon', 'kokhon', 'keno',
        'jor', 'byatha', 'pet', 'matha', 'jol', 'khabar', 'oshudh',
        'bhalo', 'kharap', 'onek', 'ektu', 'beshi',
        'na', 'haan', 'ar', 'kintu', 'tahole'
    ],
    gujarati: [
        'mane', 'maru', 'che', 'hatu', 'shu', 'kem', 'kyare', 'kem',
        'taav', 'dukhave', 'pet', 'matha', 'paani', 'jaman', 'dawai',
        'saaru', 'kharaab', 'ganu', 'thodu', 'vadhu',
        'nahi', 'haa', 'ane', 'pan', 'to'
    ],
    malayalam: [
        'enikku', 'ente', 'undu', 'undayirunnu', 'enthu', 'engane', 'eppol', 'enthinaanu',
        'pani', 'vedana', 'vayaru', 'thala', 'vellam', 'bhakshanam', 'marunu',
        'nalla', 'mosham', 'valare', 'koodi', 'kuravu',
        'illa', 'athe', 'um', 'pakshe', 'enkil'
    ]
};

// Medical keywords that help identify context
const MEDICAL_KEYWORDS_ROMANIZED: Record<string, string[]> = {
    hindi: ['bukhar', 'dard', 'ulti', 'jhada', 'sugar', 'bp', 'dawai', 'injection', 'tablet', 'syrup'],
    marathi: ['taap', 'dukhte', 'ulti', 'julabh', 'sakhar', 'aushadh', 'goli'],
    tamil: ['kaichal', 'vali', 'vaandhi', 'vayiru', 'marundhu', 'oosi'],
    telugu: ['jwaram', 'noppi', 'vanthi', 'virechanalu', 'marundu'],
    kannada: ['jwara', 'novu', 'vanti', 'bidi', 'marandu'],
    bengali: ['jor', 'byatha', 'bomi', 'paikhaana', 'oshudh'],
    gujarati: ['taav', 'dukhave', 'ulti', 'jhada', 'dawai'],
    malayalam: ['pani', 'vedana', 'okshanam', 'vayaru', 'marunu']
};

/**
 * Detect the language of user input
 */
export function detectLanguage(text: string): LanguageDetectionResult {
    if (!text || text.trim().length === 0) {
        return { detectedLanguage: 'english', confidence: 1.0, isIndianLanguage: false };
    }

    const scores: Record<string, number> = {};
    
    // Step 1: Check for native scripts (highest confidence)
    for (const [lang, pattern] of Object.entries(SCRIPT_PATTERNS)) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
            const coverage = matches.length / text.replace(/\s/g, '').length;
            
            // Differentiate Hindi vs Marathi using DEVANAGARI script words
            if (lang === 'hindi' || lang === 'marathi') {
                // Marathi-specific words in Devanagari
                const marathiDevanagari = [
                    'आहे', 'होते', 'माझे', 'तुझे', 'त्याचे', 'तिचे', 'करा', 'जा',
                    'मला', 'आम्हाला', 'तुम्हाला', 'त्यांना', 'का', 'कसे', 'केव्हा',
                    'दुखते', 'दुखत', 'आहेत', 'नाही', 'हो', 'आणि', 'पण', 'तर',
                    'अंग', 'डोके', 'पोट', 'छाती', 'पाय', 'हात', 'कान', 'नाक',
                    'ताप', 'सर्दी', 'खोकला', 'थकवा', 'जुलाब', 'उलटी'
                ];
                
                // Hindi-specific words in Devanagari  
                const hindiDevanagari = [
                    'है', 'हैं', 'था', 'थी', 'थे', 'मेरा', 'मेरी', 'तेरा', 'तेरी',
                    'उसका', 'उसकी', 'करो', 'जाओ', 'आओ', 'लो', 'दो',
                    'मुझे', 'हमको', 'तुमको', 'उनको', 'क्या', 'कैसे', 'कब',
                    'हो रहा', 'हो रही', 'कर रहा', 'कर रही', 'आ रहा', 'जा रहा',
                    'दर्द', 'तकलीफ', 'बुखार', 'खांसी', 'जुकाम', 'कमजोरी'
                ];
                
                const marathiCount = marathiDevanagari.filter(w => text.includes(w)).length;
                const hindiCount = hindiDevanagari.filter(w => text.includes(w)).length;
                
                // Also check romanized words
                const marathiRomanized = ['aahe', 'hote', 'maze', 'tuze', 'tyache', 'tiche', 'kara', 'ja', 'mala', 'dukhte'];
                const hindiRomanized = ['hai', 'hain', 'tha', 'thi', 'mera', 'tera', 'uska', 'karo', 'jao', 'mujhe', 'dard'];
                
                const textLower = text.toLowerCase();
                const marathiRomanCount = marathiRomanized.filter(w => textLower.includes(w)).length;
                const hindiRomanCount = hindiRomanized.filter(w => textLower.includes(w)).length;
                
                const totalMarathi = marathiCount + marathiRomanCount;
                const totalHindi = hindiCount + hindiRomanCount;
                
                if (totalMarathi > totalHindi) {
                    scores['marathi'] = coverage * 100 + (totalMarathi * 10);
                } else if (totalHindi > totalMarathi) {
                    scores['hindi'] = coverage * 100 + (totalHindi * 10);
                } else {
                    // Default to Hindi if equal (more common)
                    scores['hindi'] = coverage * 100;
                }
            } else {
                scores[lang] = coverage * 100;
            }
        }
    }
    
    // Step 2: Check for romanized words (medium confidence)
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);
    
    for (const [lang, patterns] of Object.entries(ROMANIZED_PATTERNS)) {
        let matchCount = 0;
        for (const pattern of patterns) {
            if (words.includes(pattern) || textLower.includes(pattern)) {
                matchCount++;
            }
        }
        
        // Also check medical keywords
        const medicalPatterns = MEDICAL_KEYWORDS_ROMANIZED[lang] || [];
        for (const pattern of medicalPatterns) {
            if (words.includes(pattern) || textLower.includes(pattern)) {
                matchCount += 2; // Weight medical terms higher
            }
        }
        
        if (matchCount > 0) {
            scores[lang] = (scores[lang] || 0) + (matchCount * 5);
        }
    }
    
    // Step 3: Find the best match
    let bestLang = 'english';
    let bestScore = 0;
    
    for (const [lang, score] of Object.entries(scores)) {
        if (score > bestScore) {
            bestScore = score;
            bestLang = lang;
        }
    }
    
    // Calculate confidence (0-1)
    const confidence = bestScore > 0 ? Math.min(bestScore / 50, 1.0) : 0.1;
    
    // Default to English if no Indian language detected with sufficient confidence
    if (confidence < 0.2) {
        return { detectedLanguage: 'english', confidence: 0.9, isIndianLanguage: false };
    }
    
    return {
        detectedLanguage: bestLang,
        confidence,
        languageMetadata: LANGUAGE_METADATA[bestLang as keyof typeof LANGUAGE_METADATA],
        isIndianLanguage: true
    };
}

/**
 * Get the appropriate greeting based on language
 */
export function getGreeting(language: string): string {
    const greetings: Record<string, string> = {
        hindi: 'नमस्ते! मैं आपकी कैसे मदद कर सकता/सकती हूँ?',
        marathi: 'नमस्कार! मी तुमची कशी मदत करू शकतो?',
        tamil: 'வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?',
        telugu: 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?',
        kannada: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        bengali: 'নমস্কার! আমি আপনাকে কিভাবে সাহায্য করতে পারি?',
        gujarati: 'નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?',
        malayalam: 'നമസ്കാരം! ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?',
        english: 'Hello! How can I help you today?'
    };
    
    return greetings[language.toLowerCase()] || greetings.english;
}

/**
 * Get emergency message in the appropriate language
 */
export function getEmergencyMessage(language: string): string {
    const messages: Record<string, string> = {
        hindi: '🚨 आपातकालीन स्थिति! कृपया तुरंत 108 पर कॉल करें या नजदीकी अस्पताल जाएं।',
        marathi: '🚨 आणीबाणी! कृपया लगेच 108 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.',
        tamil: '🚨 அவசரம்! உடனடியாக 108 அழைக்கவும் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும்.',
        telugu: '🚨 అత్యవసర పరిస్థితి! వెంటనే 108కి కాల్ చేయండి లేదా సమీపంలోని ఆసుపత్రికి వెళ్ళండి.',
        kannada: '🚨 ತುರ್ತು! ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ.',
        bengali: '🚨 জরুরি অবস্থা! অনুগ্রহ করে এখনই 108 এ কল করুন বা নিকটস্থ হাসপাতালে যান।',
        gujarati: '🚨 કટોકટી! કૃપા કરીને તરત જ 108 પર કૉલ કરો અથવા નજીકની હોસ્પિટલમાં જાઓ.',
        malayalam: '🚨 അടിയന്തിരാവസ്ഥ! ഉടൻ 108-ലേക്ക് വിളിക്കുക അല്ലെങ്കിൽ അടുത്തുള്ള ആശുപത്രിയിലേക്ക് പോകുക.',
        english: '🚨 EMERGENCY! Please call 108 immediately or go to the nearest hospital.'
    };
    
    return messages[language.toLowerCase()] || messages.english;
}

/**
 * Translate common medical instructions to the target language
 */
export function getMedicalInstruction(type: string, language: string): string {
    const instructions: Record<string, Record<string, string>> = {
        take_rest: {
            hindi: 'आराम करें',
            marathi: 'विश्रांती घ्या',
            tamil: 'ஓய்வு எடுங்கள்',
            telugu: 'విశ్రాంతి తీసుకోండి',
            kannada: 'ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ',
            bengali: 'বিশ্রাম নিন',
            gujarati: 'આરામ કરો',
            malayalam: 'വിശ്രമിക്കുക',
            english: 'Take rest'
        },
        drink_water: {
            hindi: 'खूब पानी पिएं',
            marathi: 'भरपूर पाणी प्या',
            tamil: 'நிறைய தண்ணீர் குடியுங்கள்',
            telugu: 'ఎక్కువ నీళ్ళు తాగండి',
            kannada: 'ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ',
            bengali: 'প্রচুর জল পান করুন',
            gujarati: 'પુષ્કળ પાણી પીવો',
            malayalam: 'ധാരാളം വെള്ളം കുടിക്കുക',
            english: 'Drink plenty of water'
        },
        take_ors: {
            hindi: 'ORS का घोल पिएं',
            marathi: 'ORS चे द्रावण प्या',
            tamil: 'ORS கரைசல் குடியுங்கள்',
            telugu: 'ORS ద్రావణం తాగండి',
            kannada: 'ORS ದ್ರಾವಣ ಕುಡಿಯಿರಿ',
            bengali: 'ORS সলিউশন পান করুন',
            gujarati: 'ORS સોલ્યુશન પીવો',
            malayalam: 'ORS ലായനി കുടിക്കുക',
            english: 'Drink ORS solution'
        },
        consult_doctor: {
            hindi: 'डॉक्टर से मिलें',
            marathi: 'डॉक्टरांना भेटा',
            tamil: 'மருத்துவரை அணுகவும்',
            telugu: 'వైద్యుడిని సంప్రదించండి',
            kannada: 'ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ',
            bengali: 'ডাক্তারের সাথে পরামর্শ করুন',
            gujarati: 'ડૉક્ટરની સલાહ લો',
            malayalam: 'ഡോക്ടറെ കാണുക',
            english: 'Consult a doctor'
        }
    };
    
    const instruction = instructions[type];
    if (!instruction) return type;
    
    return instruction[language.toLowerCase()] || instruction.english;
}

export default detectLanguage;
