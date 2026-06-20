import { prisma } from "@/lib/prisma";
import { requireAcademyStaff } from "@/lib/academy-access";
import { getAcademyStudentIds } from "@/lib/academy-tenant";

const CATEGORY: Record<string, string> = {
  question: "문제(지문)",
  option: "선택지",
  answer: "정답",
  explanation: "해설",
  other: "기타",
};

export const dynamic = "force-dynamic";

export default async function AcademyReportsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const { academy } = await requireAcademyStaff();
  const studentIds = await getAcademyStudentIds(academy.id);
  const status = searchParams?.status === "resolved" ? "resolved" : "open";

  const baseWhere = { userId: { in: studentIds.length ? studentIds : [-1] } };
  const [reports, openCount, resolvedCount] = await Promise.all([
    prisma.questionReport.findMany({
      where: { ...baseWhere, status },
      include: { question: { include: { course: true } }, user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.questionReport.count({ where: { ...baseWhere, status: "open" } }),
    prisma.questionReport.count({ where: { ...baseWhere, status: "resolved" } }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">오류신고</h1>
      <p className="mb-6 text-sm text-slate-500">우리 학원 수강생이 신고한 문제 오류</p>

      <div className="mb-6 flex gap-2">
        {[
          { key: "open", label: `미처리 ${openCount}`, href: "/academy/reports?status=open" },
          { key: "resolved", label: `처리완료 ${resolvedCount}`, href: "/academy/reports?status=resolved" },
        ].map((t) => (
          <a
            key={t.key}
            href={t.href}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              status === t.key ? "bg-teal-700 text-white" : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
          신고 내역이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>{r.createdAt.toLocaleDateString("ko-KR")}</span>
                <span>·</span>
                <span>{r.user.name}</span>
                <span>·</span>
                <span>{CATEGORY[r.category] ?? r.category}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{r.question.course.name}</p>
              <p className="mt-1 text-sm text-slate-600">{r.detail}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-slate-400">
        신고 처리(검토 완료)는 통합관리자가 진행합니다.
      </p>
    </div>
  );
}
