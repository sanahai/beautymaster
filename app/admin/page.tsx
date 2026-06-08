import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [newUsers, newEnrolls, pending, activeStudents, totalQuestions, paidEnrolls] =
    await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.enrollment.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.enrollment.count({ where: { status: "pending" } }),
      prisma.enrollment.count({ where: { status: "active" } }),
      prisma.question.count(),
      prisma.enrollment.findMany({
        where: { status: { in: ["active", "paid"] } },
        select: { amount: true, paidAt: true },
      }),
    ]);

  const revenue = paidEnrolls.reduce((sum, e) => sum + e.amount, 0);

  // 만료 임박(7일 이내)
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const expiringSoon = await prisma.enrollment.findMany({
    where: { status: "active", expiresAt: { lte: soon, gte: new Date() } },
    include: { user: true, course: true },
    take: 5,
  });

  const cards = [
    { label: "오늘 신규 가입", value: newUsers, icon: "🆕" },
    { label: "오늘 신규 신청", value: newEnrolls, icon: "📝" },
    { label: "승인 대기", value: pending, icon: "⏳", href: "/admin/enrollments" },
    { label: "활성 수강생", value: activeStudents, icon: "🎓" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">관리자 대시보드</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <div className="card">
              <div className="mb-1 text-2xl">{c.icon}</div>
              <div className="text-3xl font-extrabold text-primary">{c.value}</div>
              <div className="mt-1 text-sm text-beauty-gray">{c.label}</div>
            </div>
          );
          return c.href ? (
            <Link key={c.label} href={c.href}>{inner}</Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 text-lg font-bold text-beauty-neutral">누적 매출</h2>
          <p className="text-3xl font-extrabold text-primary">{revenue.toLocaleString()}원</p>
          <p className="mt-1 text-sm text-beauty-gray">활성·결제완료 수강 기준</p>
          <div className="mt-4 rounded-btn bg-primary-pale/50 p-3 text-sm text-beauty-gray">
            등록된 문제 수: <span className="font-bold text-primary">{totalQuestions.toLocaleString()}개</span>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-3 text-lg font-bold text-beauty-neutral">만료 임박 (7일 이내)</h2>
          {expiringSoon.length === 0 ? (
            <p className="text-sm text-beauty-gray">해당 수강생이 없습니다.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {expiringSoon.map((e) => (
                <li key={e.id} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-beauty-neutral">{e.user.name} · {e.course.name}</span>
                  <span className="text-beauty-gray">
                    ~{e.expiresAt?.toLocaleDateString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
