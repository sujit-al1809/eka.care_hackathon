// Quick test for language detection
const { detectLanguage } = require('./lib/utils/LanguageDetector.ts');

// Test Hindi input
const hindiTest = "मुझे सिरदर्द है और बुखार भी है";
console.log("Hindi test:", detectLanguage(hindiTest));

// Test Marathi input  
const marathiTest = "माझे डोके दुखत आहे आणि ताप आहे";
console.log("Marathi test:", detectLanguage(marathiTest));

// Test English input
const englishTest = "I have a headache and fever";
console.log("English test:", detectLanguage(englishTest));