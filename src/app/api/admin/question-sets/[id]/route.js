import { NextResponse } from "next/server";
import { prisma } from "@/components/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, description, timeLimit } = await request.json();

    const questionSet = await prisma.questionSet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.questionSet.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(timeLimit !== undefined && { timeLimit }),
      },
    });

    return NextResponse.json({ questionSet: updated });
  } catch (error) {
    console.error("Update question set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const questionSet = await prisma.questionSet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    // Delete associated questions and answers
    const questions = await prisma.question.findMany({
      where: { questionSetId: parseInt(id) },
      select: { id: true },
    });

    for (const question of questions) {
      await prisma.answer.deleteMany({ where: { questionId: question.id } });
    }
    await prisma.question.deleteMany({ where: { questionSetId: parseInt(id) } });
    await prisma.testAttempt.deleteMany({ where: { questionSetId: parseInt(id) } });
    await prisma.questionSet.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Question set deleted successfully" });
  } catch (error) {
    console.error("Delete question set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

