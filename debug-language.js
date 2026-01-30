// Quick debug test for language detection
const fs = require('fs');
const path = require('path');

// Read the language detector file
const detectorPath = path.join(__dirname, 'lib', 'utils', 'LanguageDetector.ts');

console.log('Testing language detection...');

// Test Hindi phrases
const testPhrases = [
  'मुझे सिरदर्द है',
  'मुझे बुखार है',
  'मेरे पेट में दर्द है',
  'I have a headache',
  'मुझे सिरदर्द है और बुखार भी है'
];

// Simple Hindi detection test
function simpleHindiDetection(text) {
  // Check for Devanagari script
  const hindiPattern = /[\u0900-\u097F]/g;
  const matches = text.match(hindiPattern);
  
  if (matches && matches.length > 0) {
    return {
      language: 'hindi',
      confidence: matches.length / text.replace(/\s/g, '').length,
      isIndianLanguage: true,
      method: 'devanagari_script'
    };
  }
  
  // Check for common Hindi words in romanized form
  const hindiWords = ['mujhe', 'mera', 'hai', 'hain', 'bukhar', 'dard', 'pet', 'sir'];
  const lowerText = text.toLowerCase();
  const foundWords = hindiWords.filter(word => lowerText.includes(word));
  
  if (foundWords.length > 0) {
    return {
      language: 'hindi',
      confidence: foundWords.length / hindiWords.length,
      isIndianLanguage: true,
      method: 'romanized_words'
    };
  }
  
  return {
    language: 'english',
    confidence: 0.9,
    isIndianLanguage: false,
    method: 'default'
  };
}

testPhrases.forEach(phrase => {
  const result = simpleHindiDetection(phrase);
  console.log(`\nPhrase: "${phrase}"`);
  console.log(`Result:`, result);
});

console.log('\n✅ Language detection test completed');