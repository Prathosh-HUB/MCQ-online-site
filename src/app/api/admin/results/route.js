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
          { user: { name: { contains: search } } },
          { user: { email: { contains: search } } },
          { questionSet: { title: { contains: search } } },
        ],
      }),
    };

    const [testAttempts, total] = await Promise.all([
      prisma.testAttempt.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          questionSet: { select: { id: true, title: true } },
        },
        orderBy: { startTime: "desc" },
        skip,
        take: limit,
      }),
      prisma.testAttempt.count({ where }),
    ]);

    return NextResponse.json({
      testAttempts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get results error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

