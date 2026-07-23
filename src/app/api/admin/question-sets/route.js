import { NextResponse } from "next/server";
import { prisma } from "@/components/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [questionSets, total] = await Promise.all([
      prisma.questionSet.findMany({
        where,
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { questions: true, testAttempts: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.questionSet.count({ where }),
    ]);

    return NextResponse.json({
      questionSets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
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
    const { title, description, timeLimit } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "No admin user found" },
        { status: 500 }
      );
    }

    const questionSet = await prisma.questionSet.create({
      data: {
        title,
        description: description || "",
        timeLimit: timeLimit || 600,
        createdById: admin.id,
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
