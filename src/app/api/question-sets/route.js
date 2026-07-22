import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionSets = await prisma.questionSet.findMany({
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questionSets });
  } catch (error) {
    console.error("Get question sets error:", error);
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

    const { title, description, timeLimit } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const questionSet = await prisma.questionSet.create({
      data: {
        title,
        description: description || "",
        timeLimit: timeLimit || 600,
        createdById: user.id,
      },
    });

    return NextResponse.json({ questionSet }, { status: 201 });
  } catch (error) {
    console.error("Create question set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

