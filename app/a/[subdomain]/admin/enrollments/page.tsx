import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSubsiteStaff } from "@/lib/academy-subsite";
import { getAcademyStudentIds } from "@/lib/academy-tenant";

const STATUS: Record<string, string> = {
  pending: "입금대기",
  active: "수강중",
  expired: "만료",
  cancelled: "취소",
};

export const dynamic = "force-dynamic";

export default async function SubsiteAdminEnrollmentsPage({
  params,
  searchParams,
}: {
  params: { subdomain: string };
  searchParams?: { q?: string; status?: string };
}) {
  const { academy } = await requireSubsiteStaff(params.subdomain);
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
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-2 text-2xl font-bold text-white">수강관리</h1>
      <p className="mb-6 text-slate-400">{academy.name} 소속 수강 현황</p>
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800">
        <table className="w-full text-sm text-slate-300">
          <thead className="border-b border-slate-700 text-left">
            <tr>
              <th className="px-4 py-3">수강생</th>
              <th className="px-4 py-3">과정</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">신청일</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-slate-700/50">
                <td className="px-4 py-3 font-semibold text-white">{e.user.name}</td>
                <td className="px-4 py-3">{e.course.name}</td>
                <td className="px-4 py-3">{STATUS[e.status] ?? e.status}</td>
                <td className="px-4 py-3">{e.createdAt.toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
