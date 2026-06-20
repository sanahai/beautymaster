import { requireSubsiteStaff } from "@/lib/academy-subsite";
import { getAcademyStats } from "@/lib/academy-stats";
import { getAcademyTenantStats } from "@/lib/academy-tenant";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminStatsPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);
  const [stats, tenant] = await Promise.all([
    getAcademyStats(academy.id),
    getAcademyTenantStats(academy.id),
  ]);

  const items = [
    { label: "등록 수강생", value: `${stats.total}명` },
    { label: "7일 활성", value: `${stats.active7d}명` },
    { label: "평균 정답률", value: `${stats.avgAccuracy}%` },
    { label: "활성 수강", value: `${tenant.activeEnrollments}건` },
    { label: "누적 풀이", value: tenant.totalAnswers.toLocaleString() },
    { label: "모의고사 합격률", value: `${tenant.mockPassRate}%` },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-2xl font-bold text-white">통계</h1>
      <p className="mb-6 text-slate-400">{academy.name} 수강생 학습 통계</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
