import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/components/lib/auth";
import { prisma } from "@/components/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testAttempts = await prisma.testAttempt.findMany({
      where: { userId: user.id },
      include: {
        questionSet: { select: { id: true, title: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ testAttempts });
  } catch (error) {
    console.error("Get test attempts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionSetId } = await request.json();
    const parsedId = parseInt(questionSetId, 10);

    if (!questionSetId || isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Valid question set ID is required" },
        { status: 400 }
      );
    }

    // Check if there's an existing incomplete attempt
    const existingAttempt = await prisma.testAttempt.findFirst({
      where: {
        userId: user.id,
        questionSetId: parsedId,
        submitted: false,
      },
    });

    if (existingAttempt) {
      // Reset startTime to now for accurate time tracking on resume
      const updatedAttempt = await prisma.testAttempt.update({
        where: { id: existingAttempt.id },
        data: { startTime: new Date() },
      });
      return NextResponse.json({ testAttempt: updatedAttempt });
    }

    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        questionSetId: parsedId,
        startTime: new Date(),
      },
    });

    return NextResponse.json({ testAttempt }, { status: 201 });
  } catch (error) {
    console.error("Create test attempt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
