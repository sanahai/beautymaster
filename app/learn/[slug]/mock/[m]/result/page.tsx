import { notFound } from "next/navigation";
import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireEnrollment } from "@/lib/access";
import { recordStepComplete } from "@/lib/learn-complete";
import { prisma } from "@/lib/prisma";

export default async function MockResultPage({
  params,
}: {
  params: { slug: string; m: string };
}) {
  const m = Number(params.m);
  if (m < 1 || m > 6) notFound();
  const { session, course } = await requireEnrollment(params.slug);
  // 결과 페이지 도달 = 해당 모의고사 완료 → 서버에서 확실히 진행률 반영
  await recordStepComplete(session.userId, course.id, "mock", m);
  // 진행 중이던 모의고사 세션 마감 (점수는 클라이언트가 별도 기록)
  await prisma.mockSession.updateMany({
    where: { userId: session.userId, courseId: course.id, mockNumber: m, completedAt: null },
    data: { completedAt: new Date() },
  });

  const base = `/learn/${params.slug}`;
  const next =
    m < 6
      ? { href: `${base}/mock/${m + 1}`, label: `모의고사 ${m + 1}회 응시` }
      : { href: `${base}/wrong/mock`, label: "최종 오답복습 하러가기" };

  return (
    <QuizShell exitHref={base}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-beauty-neutral">
          모의고사 {m}회 결과
        </h1>
        <ResultView
          homeHref={base}
          retryHref={`${base}/mock/${m}`}
          nextHref={next.href}
          nextLabel={next.label}
        />
      </div>
    </QuizShell>
  );
}
