import { prisma } from "@/lib/prisma";
import { approveEnrollmentAction, cancelEnrollmentAction } from "@/app/actions/admin";

const STATUS: Record<string, string> = {
  pending: "입금대기",
  active: "수강중",
  paid: "결제완료",
  expired: "만료",
  cancelled: "취소",
};

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    include: { user: true, course: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">수강신청 & 결제 관리</h1>

      <div className="overflow-x-auto rounded-card bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-primary-pale/40 text-left text-beauty-neutral">
            <tr>
              <th className="px-4 py-3">신청자</th>
              <th className="px-4 py-3">과정</th>
              <th className="px-4 py-3">금액</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">신청일</th>
              <th className="px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-semibold text-beauty-neutral">{e.user.name}</div>
                  <div className="text-xs text-beauty-gray">{e.user.email}</div>
                </td>
                <td className="px-4 py-3 text-beauty-neutral">{e.course.name}</td>
                <td className="px-4 py-3 text-beauty-neutral">{e.amount.toLocaleString()}원</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      e.status === "active" || e.status === "paid"
                        ? "bg-[#E8F5E9] text-beauty-success"
                        : e.status === "pending"
                        ? "bg-primary-pale text-primary"
                        : "bg-gray-100 text-beauty-gray"
                    }`}
                  >
                    {STATUS[e.status] || e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-beauty-gray">
                  {e.createdAt.toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  {e.status === "pending" ? (
                    <div className="flex gap-2">
                      <form action={approveEnrollmentAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <button className="rounded-btn bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-light">
                          승인
                        </button>
                      </form>
                      <form action={cancelEnrollmentAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-danger hover:text-beauty-danger">
                          취소
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs text-beauty-gray">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enrollments.length === 0 && (
          <p className="p-6 text-center text-beauty-gray">신청 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
