import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionSetId = searchParams.get("questionSetId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where = {
      ...(questionSetId ? { questionSetId: parseInt(questionSetId) } : {}),
      ...(search ? { text: { contains: search } } : {}),
    };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          questionSet: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.question.count({ where }),
    ]);

    const parsed = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    }));

    return NextResponse.json({
      questions: parsed,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { questionSetId, text, options, correctAnswer } = await request.json();

    if (!questionSetId || !text || !options || !correctAnswer) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "At least 2 options are required" },
        { status: 400 }
      );
    }

    if (!options.includes(correctAnswer)) {
      return NextResponse.json(
        { error: "Correct answer must be one of the options" },
        { status: 400 }
      );
    }

    const questionSet = await prisma.questionSet.findUnique({
      where: { id: parseInt(questionSetId) },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    const question = await prisma.question.create({
      data: {
        questionSetId: parseInt(questionSetId),
        text,
        options: JSON.stringify(options),
        correctAnswer,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
