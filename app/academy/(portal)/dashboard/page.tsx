import Link from "next/link";
import StatCards from "@/components/academy/StatCards";
import AcademyCodeCard from "@/components/academy/AcademyCodeCard";
import AcademyPortalLinkCard from "@/components/academy/AcademyPortalLinkCard";
import UpgradeBanner from "@/components/academy/UpgradeBanner";
import { requireAcademyStaff } from "@/lib/academy-access";
import { getAcademyStats, getAtRiskStudents } from "@/lib/academy-stats";
import { getAcademyTenantStats } from "@/lib/academy-tenant";
import { TENANT_ADMIN_NAV, tenantAdminHref } from "@/lib/tenant-admin-nav";
import { tierAtLeast } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function AcademyDashboardPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const { user, academy } = await requireAcademyStaff();
  const [stats, tenantStats, atRisk] = await Promise.all([
    getAcademyStats(academy.id),
    getAcademyTenantStats(academy.id),
    tierAtLeast(academy.tier, "standard") ? getAtRiskStudents(academy.id) : Promise.resolve([]),
  ]);

  return (
    <div>
      {searchParams?.error === "upgrade" && (
        <div className="mb-6">
          <UpgradeBanner />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {academy.name} · 대시보드
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {user.role === "owner" ? "원장" : user.role === "teacher" ? "강사" : "관리자"} · 학생 {stats.total}/{academy.maxStudents}명
        </p>
      </div>

      {academy.code && <AcademyCodeCard code={academy.code} />}
      <AcademyPortalLinkCard subdomain={academy.subdomain} code={academy.code} />

      <StatCards
        stats={[
          { label: "수강생", value: stats.total },
          { label: "7일 활성", value: stats.active7d, color: "#10B981" },
          { label: "활성 수강", value: tenantStats.activeEnrollments, color: "#0EA5E9" },
          { label: "미처리 오류신고", value: tenantStats.openReports, color: "#F59E0B" },
        ]}
      />

      {atRisk.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-900">주의 학생 {atRisk.length}명</h2>
          <Link href="/academy/students?filter=warning" className="mt-2 inline-block text-sm font-semibold text-amber-800 hover:underline">
            수강생관리에서 보기 →
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TENANT_ADMIN_NAV.filter((n) => n.href !== "/dashboard").map((item) => (
          <Link
            key={item.href}
            href={tenantAdminHref(item.href)}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-2 font-bold text-slate-900">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
