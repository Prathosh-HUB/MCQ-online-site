import { NextResponse } from "next/server";
import { prisma } from "@/components/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { text, questionType, imageUrls, optionImages, options, correctAnswer } = await request.json();

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const qType = questionType || question.questionType;

    if (options && !Array.isArray(options)) {
      return NextResponse.json(
        { error: "Options must be an array" },
        { status: 400 }
      );
    }

    if (qType === "MCQ" && correctAnswer && options && !options.includes(correctAnswer)) {
      return NextResponse.json(
        { error: "Correct answer must be one of the options" },
        { status: 400 }
      );
    }

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        ...(text !== undefined && { text }),
        ...(questionType !== undefined && { questionType: qType }),
        ...(imageUrls !== undefined && { imageUrls: imageUrls && imageUrls.length > 0 ? JSON.stringify(imageUrls.filter(Boolean)) : null }),
        ...(optionImages !== undefined && { optionImages: optionImages && optionImages.length > 0 ? JSON.stringify(optionImages) : null }),
        ...(options !== undefined && { options: JSON.stringify(options) }),
        ...(correctAnswer !== undefined && { correctAnswer }),
      },
    });

    return NextResponse.json({
      question: {
        ...updated,
        options: JSON.parse(updated.options),
        optionImages: updated.optionImages ? JSON.parse(updated.optionImages) : null,
        imageUrls: updated.imageUrls ? JSON.parse(updated.imageUrls) : null,
      },
    });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Delete associated answers
    await prisma.answer.deleteMany({ where: { questionId: parseInt(id) } });
    await prisma.question.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

