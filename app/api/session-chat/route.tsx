import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";

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
  const user = await currentUser();
  const { notes, selectedDoctor } = await request.json();

  try {
    const sessionId = uuidv4()
    const result = await prisma.session.create({
      data: {
        sessionId,
        createdBy: user?.emailAddresses[0]?.emailAddress || 'unknown',
        notes: notes || "",
        createdOn: new Date().toString(),
        selectedDocter: selectedDoctor || null,
      }
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error("Error creating session:", e);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const user = await currentUser()
    const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';

    const result = await prisma.session.findFirst({
      where: {
        sessionId: sessionId,
          
        ...(userEmail !== 'unknown' ? { createdBy: userEmail } : {})
      },
    })

    if (!result) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

// Update session with detected language or conversation
export async function PUT(request: NextRequest) {
  try {
    const { sessionId, detectedLanguage, conversation } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';

    // Build update data dynamically
    const updateData: any = {};
    if (detectedLanguage) updateData.detectedLanguage = detectedLanguage;
    if (conversation) updateData.conversation = conversation;

    const result = await prisma.session.update({
      where: { sessionId },
      data: updateData
    });

    return NextResponse.json({ success: true, session: result });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}