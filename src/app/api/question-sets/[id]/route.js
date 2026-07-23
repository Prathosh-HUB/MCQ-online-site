import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/components/lib/auth";
import { prisma } from "@/components/lib/prisma";

export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const questionSet = await prisma.questionSet.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            correctAnswer: true,
          },
        },
        createdBy: { select: { id: true, name: true } },
      },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    // Parse options from JSON string to array
    const parsedQuestionSet = {
      ...questionSet,
      questions: questionSet.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      })),
    };

    return NextResponse.json({ questionSet: parsedQuestionSet });
  } catch (error) {
    console.error("Get question set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

