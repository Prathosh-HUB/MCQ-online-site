import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/components/lib/auth";
import { prisma } from "@/components/lib/prisma";

export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const attemptId = parseInt(id, 10);

    if (isNaN(attemptId)) {
      return NextResponse.json(
        { error: "Invalid test attempt ID" },
        { status: 400 }
      );
    }

    const testAttempt = await prisma.testAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        questionSet: {
          include: {
            questions: true,
          },
        },
        answers: true,
      },
    });

    if (!testAttempt) {
      return NextResponse.json(
        { error: "Test attempt not found" },
        { status: 404 }
      );
    }

    if (testAttempt.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Convert options safely
    const questions = testAttempt.questionSet.questions.map((q) => {
      let options = q.options;
      let optionImages = q.optionImages;
      let imageUrls = q.imageUrls;

      try {
        if (typeof options === "string") {
          options = JSON.parse(options);
        }
      } catch (err) {
        console.error("Invalid options JSON:", q.options);
        // fallback if stored as comma separated string
        options = q.options.split(",");
      }

      try {
        if (typeof optionImages === "string") {
          optionImages = JSON.parse(optionImages);
        }
      } catch (err) {
        optionImages = null;
      }

      try {
        if (typeof imageUrls === "string") {
          imageUrls = JSON.parse(imageUrls);
        }
      } catch (err) {
        imageUrls = null;
      }

      return {
        ...q,
        options,
        optionImages,
        imageUrls,
      };
    });

    return NextResponse.json({
      testAttempt: {
        ...testAttempt,
        questionSet: {
          ...testAttempt.questionSet,
          questions,
        },
      },
    });

  } catch (error) {
    console.error("Get test attempt error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
