import { NextResponse } from "next/server";
import { prisma } from "@/components/lib/prisma";

export async function GET() {
  try {
    const [
      totalStudents,
      totalQuestionSets,
      totalQuestions,
      totalAttempts,
      recentAttempts,
      passRateData,
      questionsBySet,
      monthlyAttempts,
    ] = await Promise.all([
      // Total students
      prisma.user.count({ where: { role: "STUDENT" } }),
      // Total question sets
      prisma.questionSet.count(),
      // Total questions
      prisma.question.count(),
      // Total test attempts
      prisma.testAttempt.count(),
      // Recent attempts (last 5)
      prisma.testAttempt.findMany({
        take: 5,
        orderBy: { startTime: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          questionSet: { select: { title: true } },
        },
      }),
      // Pass rate
      prisma.testAttempt.aggregate({
        _count: true,
        _avg: { score: true },
        where: { submitted: true },
      }),
      // Questions per set
      prisma.questionSet.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          title: true,
          _count: { select: { questions: true } },
        },
      }),
      // Monthly attempts (last 6 months)
      prisma.testAttempt.findMany({
        where: {
          startTime: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
        select: {
          startTime: true,
          score: true,
          submitted: true,
        },
        orderBy: { startTime: "asc" },
      }),
    ]);

    const submittedAttempts = passRateData._count;
    const avgScore = passRateData._avg.score || 0;
    const passCount = await prisma.testAttempt.count({
      where: { submitted: true, score: { gte: 50 } },
    });

    // Calculate monthly stats
    const monthlyStats = {};
    monthlyAttempts.forEach((attempt) => {
      const month = new Date(attempt.startTime).toLocaleString("default", { month: "short", year: "2-digit" });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { month, attempts: 0, passed: 0, totalScore: 0 };
      }
      monthlyStats[month].attempts++;
      if (attempt.submitted && attempt.score !== null) {
        monthlyStats[month].totalScore += attempt.score;
        if (attempt.score >= 50) monthlyStats[month].passed++;
      }
    });

    Object.values(monthlyStats).forEach((stat) => {
      stat.avgScore = stat.attempts > 0 ? Math.round(stat.totalScore / stat.attempts) : 0;
      delete stat.totalScore;
    });

    return NextResponse.json({
      analytics: {
        totalStudents,
        totalQuestionSets,
        totalQuestions,
        totalAttempts,
        passRate: submittedAttempts > 0 ? Math.round((passCount / submittedAttempts) * 100) : 0,
        avgScore: Math.round(avgScore),
        recentAttempts,
        questionsBySet: questionsBySet.map((qs) => ({
          title: qs.title,
          count: qs._count.questions,
        })),
        monthlyStats: Object.values(monthlyStats),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

