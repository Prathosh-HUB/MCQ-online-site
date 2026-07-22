import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const attemptId = parseInt(id, 10);

    if (isNaN(attemptId)) {
      return NextResponse.json(
        { error: "Invalid test attempt ID" },
        { status: 400 }
      );
    }

    const { answers } = await request.json();

    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        questionSet: {
          include: { questions: true },
        },
      },
    });

    if (!testAttempt) {
      return NextResponse.json(
        { error: "Test attempt not found" },
        { status: 404 }
      );
    }

    if (testAttempt.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (testAttempt.submitted) {
      return NextResponse.json(
        { error: "Test already submitted" },
        { status: 400 }
      );
    }

    // Process and save answers
    let correctCount = 0;
    const answerRecords = [];

    for (const question of testAttempt.questionSet.questions) {
      const selectedAnswer = answers[question.id] || null;
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      answerRecords.push({
        testAttemptId: attemptId,
        questionId: question.id,
        selectedAnswer,
        isCorrect,
      });
    }

    // Delete existing answers and create new ones
    await prisma.answer.deleteMany({ where: { testAttemptId: attemptId } });
    await prisma.answer.createMany({ data: answerRecords });

    // Update test attempt
    const totalQuestions = testAttempt.questionSet.questions.length;
    const updatedAttempt = await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        submitted: true,
        endTime: new Date(),
        score: Math.round((correctCount / totalQuestions) * 100),
        totalQuestions,
        correctCount,
      },
    });

    return NextResponse.json({ testAttempt: updatedAttempt });
  } catch (error) {
    console.error("Submit test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
