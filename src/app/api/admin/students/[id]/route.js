import { NextResponse } from "next/server";
import { prisma } from "@/components/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const student = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Delete associated test attempts and answers first
    const testAttempts = await prisma.testAttempt.findMany({
      where: { userId: student.id },
      select: { id: true },
    });

    for (const attempt of testAttempts) {
      await prisma.answer.deleteMany({ where: { testAttemptId: attempt.id } });
    }

    await prisma.testAttempt.deleteMany({ where: { userId: student.id } });
    await prisma.user.delete({ where: { id: student.id } });

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

