import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { approveDemoEnrollmentAction } from "@/app/actions/enroll";

export default async function PaymentPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await requireSession();
  const course = await prisma.course.findUnique({ where: { slug: params.slug } });
  if (!course) redirect("/enroll");

  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 24);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">결제 안내 (계좌이체)</h1>
        <p className="mb-8 text-beauty-gray">아래 계좌로 입금하시면 관리자 확인 후 승인됩니다.</p>

        <div className="card space-y-4">
          <Row label="과정" value={course.name} />
          <Row label="결제 금액" value={`${course.price.toLocaleString()}원`} highlight />
          <Row label="입금 은행" value="국민은행" />
          <Row label="계좌번호" value="123456-78-901234" />
          <Row label="예금주" value="(주)뷰티마스터" />
          <Row label="입금자명" value={`${session.name} (가입자명과 동일하게)`} />
          <Row
            label="입금 기한"
            value={`${deadline.toLocaleString("ko-KR")}까지 (24시간)`}
          />
        </div>

        <div className="mt-6 rounded-card bg-primary-pale/50 p-5 text-sm text-beauty-neutral">
          <p className="font-semibold">📌 안내</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-beauty-gray">
            <li>입금 확인 후 카카오/이메일로 승인 알림이 발송됩니다.</li>
            <li>입금 기한 내 미입금 시 신청이 자동 취소됩니다.</li>
          </ul>
        </div>

        <div className="mt-8 rounded-card border-2 border-dashed border-primary p-5 text-center">
          <p className="mb-3 text-sm text-beauty-gray">
            🧪 데모 환경에서는 입금 없이 즉시 승인하여 학습을 체험할 수 있습니다.
          </p>
          <form action={approveDemoEnrollmentAction}>
            <input type="hidden" name="slug" value={course.slug} />
            <button type="submit" className="btn-accent">
              데모: 즉시 승인하고 학습 시작
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
      <span className="text-sm text-beauty-gray">{label}</span>
      <span className={`font-semibold ${highlight ? "text-lg text-primary" : "text-beauty-neutral"}`}>
        {value}
      </span>
    </div>
  );
}
