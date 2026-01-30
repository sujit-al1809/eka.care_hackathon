import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress || 'unknown';

    if (userEmail === 'unknown') {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: {
        createdBy: userEmail
      },
      orderBy: {
        createdOn: 'desc'
      }
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}