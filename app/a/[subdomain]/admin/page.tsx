import Link from "next/link";
import StatCards from "@/components/academy/StatCards";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { getAcademyStats, getAtRiskStudents } from "@/lib/academy-stats";
import { getAcademyTenantStats } from "@/lib/academy-tenant";
import { TENANT_ADMIN_NAV, subsiteTenantAdminHref } from "@/lib/tenant-admin-nav";
import { tierAtLeast } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminDashboardPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);
  const [stats, tenantStats, atRisk] = await Promise.all([
    getAcademyStats(academy.id),
    getAcademyTenantStats(academy.id),
    tierAtLeast(academy.tier, "standard") ? getAtRiskStudents(academy.id) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{academy.name} · 대시보드</h1>
        <p className="text-slate-400">학원 관리자 · 학습 현황 요약</p>
      </div>
      <StatCards
        stats={[
          { label: "수강생", value: stats.total, color: "#38BDF8" },
          { label: "7일 활성", value: stats.active7d, color: "#34D399" },
          { label: "활성 수강", value: tenantStats.activeEnrollments, color: "#2DD4BF" },
          { label: "미처리 신고", value: tenantStats.openReports, color: "#FBBF24" },
        ]}
      />
      {atRisk.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <h2 className="font-bold text-amber-200">주의 학생 {atRisk.length}명</h2>
          <Link
            href={subsitePath(params.subdomain, "/admin/students?filter=warning")}
            className="mt-2 inline-block text-sm text-amber-300 hover:underline"
          >
            수강생관리 →
          </Link>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TENANT_ADMIN_NAV.filter((n) => n.href !== "/dashboard").map((item) => (
          <Link
            key={item.href}
            href={subsiteTenantAdminHref(params.subdomain, item.href)}
            className="rounded-2xl border border-slate-700 bg-slate-800 p-5 hover:border-teal-600/50"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-2 font-bold text-white">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
