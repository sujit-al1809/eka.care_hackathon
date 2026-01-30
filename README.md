# SwasthAI - Project Documentation for Presentation

## 1. Project Overview
**Name:** SwasthAI
**Tagline:** "An AI-powered clinical triage & diagnostic support system built for India."
**Mission:** Experience healthcare conversations in **Hindi, Tamil, Telugu, Kannada & more**, bridging the gap between symptoms and specialist care through advanced multimodal AI.

---

## 2. The Problem (Why SwasthAI?)
We are addressing three critical gaps in the Indian healthcare ecosystem:

1.  **The Language Barrier:**
    *   *The Pain:* India speaks 121+ languages, but medical apps are 90% English. A rural patient can't type "Dermatitis" but can describe "skin burning" in Bhojpuri or Tamil.
    *   *The Result:* Massive exclusion of non-English speakers from digital health.

2.  **The Triage Bottleneck:**
    *   *The Pain:* India's doctor-patient ratio is low (approx 1:834). Doctors waste hours on repetitive, basic queries ("Can I eat rice with fever?"), leaving less time for critical care.
    *   *The Result:* Deferred diagnostics and overwhelmed clinics.

3.  **Context Amnesia in Telehealth:**
    *   *The Pain:* Phone consultations lack visual context. A patient saying "I have a spot" is vague; showing it is precise. Most bots are text-only.
    *   *The Result:* Misdiagnosis or "please visit clinic" defaults that waste time.

---

## 3. The Solution (How We Fix It)
SwasthAI acts as the **intelligent front-desk** for healthcare:

### ✅ Solution 1: Native Voice-First Interface
*   **What it does:** Users speak naturally in **Hindi, Tamil, Telugu, Marathi, or English**.
*   **Impact:** Zero literacy barrier. We don't just translate; we support native scripts and colloquialisms.

### ✅ Solution 2: Intelligent Multi-Agent Triage
*   **What it does:** The "Primary Agent" acts as a GP. If it detects specialized needs (e.g., skin issues), it **automatically routes** the user to a "Specialist Agent" (e.g., Dermatologist) with specific tools.
*   **Impact:** Automates 70% of routine triage, filtering only qualified leads to human doctors.

### ✅ Solution 3: Multimodal Diagnostics
*   **What it does:** Users can upload images (rashes, wounds, reports) while talking. The AI sees the image *and* hears the symptoms simultaneously.
*   **Impact:** "Show and Tell" diagnostics that mimic a real physical exam.

---

## 4. System Architecture
A high-level view of how SwasthAI processes a patient interaction:

```mermaid
graph TD
    User((Patient)) -->|Voice & Image Input| Frontend[Next.js Client]
    
    subgraph "Frontend Layer"
        Frontend -->|Web Speech API| SpeechToText[Local Transcription]
        Frontend -->|VAD Algorithm| SilenceDetect[Silence Detection 1s]
        Frontend -->|Upload| ImageProcessor[Image Handler]
    end

    Frontend -->|POST Request| Backend[Next.js Serverless API]

    subgraph "The Brain (Agent System)"
        Backend -->|Context| AgentOrchestrator[Agent Orchestrator]
        
        AgentOrchestrator -->|Analyze| PrimaryAgent[Primary Physician Agent]
        
        PrimaryAgent --"Strict Triage"--> SpecialistCheck{Need Specialist?}
        
        SpecialistCheck --"Yes (Skin)"--> Dermatologist[Dermatologist Agent]
        SpecialistCheck --"Yes (Heart)"--> Emergency[Emergency Agent]
        SpecialistCheck --"No"--> GenPhysician[General Advice]
        
        Dermatologist -->|Visual Analysis| Gemini[Google Gemini 1.5 Flash]
        Emergency -->|Urgency Protocol| Gemini
        GenPhysician -->|Medical KB| Gemini
    end

    Gemini -->|Response| Backend
    Backend -->|Native Script Text| Frontend
    Frontend -->|Auto-Scroll| UI[Chat Interface]
```

### **Architecture Highlights:**
1.  **Low-Latency VAD:** Custom Voice Activity Detection ensuring <1.5s response time.
2.  **Stateful Context:** The `AgentOrchestrator` preserves conversation history and images even when switching from "Hindi" to "English" or "GP" to "Dermatologist".
3.  **Safety Layer:** A dedicated "Spam & Safety Filter" runs before any response is shown to the user.

---

## 5. Challenges Overcome (Dev Story)
*   **Solving "Hinglish":** We used strict prompt engineering to force the AI to stick to pure native scripts (Devanagari), preventing the common AI failure of mixing English words into Hindi sentences.
*   **Vision-Context Sync:** We architected a system where the image isn't just an attachment but part of the prompt context, allowing the AI to answer "Is *this* infected?" meaningfully.

---

## 6. Future Roadmap (Revenue & Sustainability)
*   **B2B Licensing:** White-label the Triage Agent for hospitals to pre-screen patients.
*   **Local-First AI:** Deploy 4-bit quantized models on-device for offline rural usage.
*   **EHR Integration:** Auto-generate ICD-10 coded medical notes for doctors after the chat.

---

## 7. Getting Started for Developers

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sujit-al1809/eka.care_hackathon.git
   cd eka.care_hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # API Keys
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
   
   # Database (if using Prisma)
   DATABASE_URL="postgresql://user:password@localhost:5432/swasthai"

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 8. Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TailwindCSS, Lucide Icons
- **AI/LLM:** Google Gemini 1.5 Flash (Multimodal)
- **Voice/Audio:** Web Speech API, MediaRecorder, Custom VAD (Voice Activity Detection)
- **Backend:** Next.js Serverless Functions
- **Database:** PostgreSQL (Prisma ORM)
- **Auth:** Clerk

---

## 9. License
[MIT](LICENSE)
