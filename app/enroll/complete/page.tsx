import Link from "next/link";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";

export default async function EnrollCompletePage() {
  await requireSession();
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 text-6xl">🎉</div>
        <h1 className="mb-3 text-3xl font-bold text-beauty-neutral">수강신청 완료!</h1>
        <p className="mb-8 text-beauty-gray">
          승인이 완료되었습니다. 이제 바로 학습을 시작할 수 있어요.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-primary">내 학습 현황 보기</Link>
          <Link href="/enroll" className="btn-outline">다른 과정 보기</Link>
        </div>
      </main>
    </>
  );
}
