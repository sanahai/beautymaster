import { requireAcademyStaff } from "@/lib/academy-access";
import { getAcademyStats } from "@/lib/academy-stats";
import { getAcademyTenantStats } from "@/lib/academy-tenant";

export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default async function AcademyStatsPage() {
  const { academy } = await requireAcademyStaff();
  const [stats, tenant] = await Promise.all([
    getAcademyStats(academy.id),
    getAcademyTenantStats(academy.id),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">통계</h1>
      <p className="mb-6 text-sm text-slate-500">{academy.name} 수강생 학습 통계</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="등록 수강생" value={`${stats.total}명`} />
        <Stat label="7일 활성" value={`${stats.active7d}명`} />
        <Stat label="7일 미접속" value={`${stats.inactive7d}명`} />
        <Stat label="평균 정답률" value={`${stats.avgAccuracy}%`} />
        <Stat label="활성 수강" value={`${tenant.activeEnrollments}건`} />
        <Stat label="누적 풀이" value={tenant.totalAnswers.toLocaleString()} />
        <Stat label="완료 모의고사" value={`${tenant.mockCompleted}회`} />
        <Stat label="모의고사 합격률" value={`${tenant.mockPassRate}%`} />
        <Stat label="미처리 오류신고" value={`${tenant.openReports}건`} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-2 font-bold text-slate-900">안내</h2>
        <p className="text-sm text-slate-500">
          상세 PDF·주간 리포트는 프리미엄 플랜에서 B2B 추가 기능으로 제공됩니다.
          플랫폼 전체 통계는 통합관리자 메뉴에서 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
