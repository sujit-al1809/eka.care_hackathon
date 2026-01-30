import { NextRequest, NextResponse } from "next/server";
import { generateMedicalReport } from "@/shared/GeminiModel";
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

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      const text = await request.text();
      if (!text) {
        return NextResponse.json({ error: "Empty request body" }, { status: 400 });
      }
      body = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { sessionId, messages, consultationDuration } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Generate report using Gemini
    const reportText = await generateMedicalReport(messages);

    // Parse the JSON report
    let report;
    try {
      const cleanedResponse = reportText.replace(/```json\n?|\n?```/g, '').trim();
      report = JSON.parse(cleanedResponse);
    } catch {
      // If parsing fails, create a basic report
      report = {
        patient_language: "unknown",
        summary_english: "Consultation completed. Please consult a doctor for proper diagnosis.",
        summary_native: "परामर्श पूरा हुआ। कृपया सही निदान के लिए डॉक्टर से संपर्क करें।",
        symptoms_reported: [],
        severity_assessment: "moderate",
        risk_level: "MODERATE",
        risk_score: 5,
        possible_conditions: [],
        recommendations: ["Consult a healthcare professional"],
        recommendations_native: ["स्वास्थ्य विशेषज्ञ से संपर्क करें"],
        specialist_recommended: "General Physician",
        follow_up_needed: true,
        emergency_flag: false,
        raw_response: reportText
      };
    }

    // Add risk assessment if not present
    if (!report.risk_level || !report.risk_score) {
      // Calculate risk based on severity and symptoms
      const riskAssessment = calculateRiskLevel(report);
      report.risk_level = riskAssessment.level;
      report.risk_score = riskAssessment.score;
    }

    // Add metadata
    report.generated_at = new Date().toISOString();
    report.session_id = sessionId;
    report.consultation_duration = consultationDuration || messages.length;

    // Save report to database if sessionId provided
    if (sessionId) {
      try {
        await prisma.session.update({
          where: { sessionId },
          data: {
            report: report,
            conversation: messages
          }
        });
      } catch (dbError) {
        console.error("Error saving report to database:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({
      error: "Failed to generate report",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Helper function to calculate risk level
function calculateRiskLevel(report: any): { level: string, score: number } {
  let score = 2; // Base score

  // Check severity
  if (report.severity_assessment === 'high') score += 4;
  else if (report.severity_assessment === 'moderate') score += 2;

  // Check for emergency indicators
  if (report.emergency_flag) score += 3;

  // Check symptoms count
  if (report.symptoms_reported && report.symptoms_reported.length > 5) score += 1;

  // Check for critical conditions
  const criticalConditions = ['heart', 'stroke', 'emergency', 'critical', 'urgent'];
  if (report.possible_conditions && report.possible_conditions.some((condition: string) =>
    criticalConditions.some(critical => condition.toLowerCase().includes(critical))
  )) {
    score += 2;
  }

  // Determine level
  let level = 'LOW';
  if (score >= 8) level = 'CRITICAL';
  else if (score >= 6) level = 'HIGH';
  else if (score >= 4) level = 'MODERATE';

  return { level, score: Math.min(score, 10) };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report: session.report,
      conversation: session.conversation
    });

  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}
