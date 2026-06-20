import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAcademyStaff } from "@/lib/academy-access";
import { getAcademyStudentIds } from "@/lib/academy-tenant";

const STATUS: Record<string, string> = {
  pending: "입금대기",
  active: "수강중",
  expired: "만료",
  cancelled: "취소",
};

export const dynamic = "force-dynamic";

export default async function AcademyEnrollmentsPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string };
}) {
  const { academy } = await requireAcademyStaff();
  const studentIds = await getAcademyStudentIds(academy.id);
  const q = searchParams?.q?.trim();
  const status = searchParams?.status;

  const where: Prisma.EnrollmentWhereInput = {
    userId: { in: studentIds.length ? studentIds : [-1] },
    userDeleted: false,
  };
  if (q) where.user = { name: { contains: q, mode: "insensitive" } };
  if (status) where.status = status;

  const enrollments = await prisma.enrollment.findMany({
    where,
    include: { user: true, course: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">수강관리</h1>
      <p className="mb-6 text-sm text-slate-500">{academy.name} 소속 수강생의 수강·결제 현황</p>

      <form className="mb-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="수강생 이름"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select name="status" defaultValue={status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">전체 상태</option>
          {Object.entries(STATUS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
          검색
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">수강생</th>
              <th className="px-4 py-3">과정</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">금액</th>
              <th className="px-4 py-3">신청일</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  수강 내역이 없습니다.
                </td>
              </tr>
            ) : (
              enrollments.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{e.user.name}</p>
                    <p className="text-xs text-slate-400">{e.user.email}</p>
                  </td>
                  <td className="px-4 py-3">{e.course.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold">
                      {STATUS[e.status] ?? e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{e.amount.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-slate-500">
                    {e.createdAt.toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        결제 승인·상태 변경은 통합관리자(플랫폼)에서 처리됩니다.
      </p>
    </div>
  );
}
