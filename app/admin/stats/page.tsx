import { prisma } from "@/lib/prisma";

export default async function AdminStatsPage() {
  const courses = await prisma.course.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { questions: true, enrollments: true } } },
  });

  const totalAnswers = await prisma.userAnswer.count();
  const correctAnswers = await prisma.userAnswer.count({ where: { isCorrect: true } });
  const correctRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const mockSessions = await prisma.mockSession.findMany({
    where: { completedAt: { not: null }, score: { not: null } },
  });
  const passed = mockSessions.filter((m) => (m.score ?? 0) >= m.totalQ * 0.6).length;
  const passRate =
    mockSessions.length > 0 ? Math.round((passed / mockSessions.length) * 100) : 0;

  const maxQ = Math.max(...courses.map((c) => c._count.questions), 1);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">통계 & 리포트</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="누적 풀이 문제" value={totalAnswers.toLocaleString()} />
        <Stat label="전체 정답률" value={`${correctRate}%`} />
        <Stat label="완료 모의고사" value={mockSessions.length.toLocaleString()} />
        <Stat label="모의고사 합격률" value={`${passRate}%`} />
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-bold text-beauty-neutral">과정별 문제 수</h2>
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-beauty-neutral">{c.name}</span>
                <span className="text-beauty-gray">
                  {c._count.questions}문제 · 수강 {c._count.enrollments}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-primary-pale">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(c._count.questions / maxQ) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <div className="text-3xl font-extrabold text-primary">{value}</div>
      <div className="mt-1 text-sm text-beauty-gray">{label}</div>
    </div>
  );
}
