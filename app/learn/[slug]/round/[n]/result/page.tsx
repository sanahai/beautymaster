import { notFound } from "next/navigation";
import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireEnrollment } from "@/lib/access";
import { recordStepComplete } from "@/lib/learn-complete";

export default async function RoundResultPage({
  params,
}: {
  params: { slug: string; n: string };
}) {
  const n = Number(params.n);
  if (![1, 2, 3].includes(n)) notFound();
  const { session, course } = await requireEnrollment(params.slug);
  // 결과 페이지 도달 = 해당 회차 완료 → 서버에서 확실히 진행률 반영
  await recordStepComplete(session.userId, course.id, `round${n}`);

  const base = `/learn/${params.slug}`;
  const next =
    n < 3
      ? { href: `${base}/round/${n + 1}`, label: `${n + 1}회차 시작하기` }
      : { href: `${base}/wrong/round`, label: "오답복습 하러가기" };

  return (
    <QuizShell exitHref={base}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-beauty-neutral">
          {n}회차 결과
        </h1>
        <ResultView
          homeHref={base}
          retryHref={`${base}/round/${n}`}
          nextHref={next.href}
          nextLabel={next.label}
        />
      </div>
    </QuizShell>
  );
}
