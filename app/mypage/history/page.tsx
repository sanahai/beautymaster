import Link from "next/link";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  active: { text: "수강중", cls: "bg-[#E8F5E9] text-beauty-success" },
  pending: { text: "입금대기", cls: "bg-primary-pale text-primary" },
  paid: { text: "결제완료", cls: "bg-[#E8F5E9] text-beauty-success" },
  expired: { text: "만료", cls: "bg-gray-100 text-beauty-gray" },
  cancelled: { text: "취소", cls: "bg-gray-100 text-beauty-gray" },
};

export default async function HistoryPage() {
  const session = await requireSession("/mypage/history");
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/mypage" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
          ← 마이페이지
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-beauty-neutral">결제·수강 내역</h1>

        {enrollments.length === 0 ? (
          <div className="card text-center text-beauty-gray">신청 내역이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((e) => {
              const s = STATUS_LABEL[e.status] || { text: e.status, cls: "bg-gray-100" };
              return (
                <div key={e.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-beauty-neutral">{e.course.name}</p>
                    <p className="text-sm text-beauty-gray">
                      {e.createdAt.toLocaleDateString("ko-KR")} · {e.amount.toLocaleString()}원
                      {e.expiresAt && ` · ~${e.expiresAt.toLocaleDateString("ko-KR")}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>
                    {s.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
