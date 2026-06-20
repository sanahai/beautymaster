import { prisma } from "./prisma";

export async function getAcademyStudentIds(academyId: number): Promise<number[]> {
  const students = await prisma.user.findMany({
    where: { academyId, role: "student" },
    select: { id: true },
  });
  return students.map((s) => s.id);
}

export async function getAcademyTenantStats(academyId: number) {
  const studentIds = await getAcademyStudentIds(academyId);
  if (studentIds.length === 0) {
    return {
      activeEnrollments: 0,
      totalAnswers: 0,
      correctRate: 0,
      mockCompleted: 0,
      mockPassRate: 0,
      openReports: 0,
    };
  }

  const [activeEnrollments, totalAnswers, correctAnswers, mockSessions, openReports] =
    await Promise.all([
      prisma.enrollment.count({
        where: { userId: { in: studentIds }, status: "active", userDeleted: false },
      }),
      prisma.userAnswer.count({ where: { userId: { in: studentIds } } }),
      prisma.userAnswer.count({ where: { userId: { in: studentIds }, isCorrect: true } }),
      prisma.mockSession.findMany({
        where: { userId: { in: studentIds }, completedAt: { not: null }, score: { not: null } },
      }),
      prisma.questionReport.count({
        where: { userId: { in: studentIds }, status: "open" },
      }),
    ]);

  const correctRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  const passed = mockSessions.filter((m) => (m.score ?? 0) >= m.totalQ * 0.6).length;
  const mockPassRate =
    mockSessions.length > 0 ? Math.round((passed / mockSessions.length) * 100) : 0;

  return {
    activeEnrollments,
    totalAnswers,
    correctRate,
    mockCompleted: mockSessions.length,
    mockPassRate,
    openReports,
  };
}
