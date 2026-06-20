import { prisma } from "@/lib/prisma";
import { requireSubsiteStaff } from "@/lib/academy-subsite";
import { getAcademyStudentIds } from "@/lib/academy-tenant";

const CATEGORY: Record<string, string> = {
  question: "문제(지문)",
  option: "선택지",
  answer: "정답",
  explanation: "해설",
  other: "기타",
};

export const dynamic = "force-dynamic";

export default async function SubsiteAdminReportsPage({
  params,
  searchParams,
}: {
  params: { subdomain: string };
  searchParams?: { status?: string };
}) {
  const { academy } = await requireSubsiteStaff(params.subdomain);
  const studentIds = await getAcademyStudentIds(academy.id);
  const status = searchParams?.status === "resolved" ? "resolved" : "open";
  const baseWhere = { userId: { in: studentIds.length ? studentIds : [-1] } };

  const reports = await prisma.questionReport.findMany({
    where: { ...baseWhere, status },
    include: { question: { include: { course: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-white">오류신고</h1>
      <p className="text-slate-400">우리 학원 수강생 신고 {reports.length}건</p>
      {reports.length === 0 ? (
        <p className="text-slate-500">신고 내역이 없습니다.</p>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-xs text-slate-500">
              {r.user.name} · {CATEGORY[r.category]} · {r.createdAt.toLocaleDateString("ko-KR")}
            </p>
            <p className="mt-2 text-sm text-slate-300">{r.detail}</p>
          </div>
        ))
      )}
    </div>
  );
}
