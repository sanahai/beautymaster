import { notFound } from "next/navigation";
import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireEnrollment } from "@/lib/access";

export default async function RoundResultPage({
  params,
}: {
  params: { slug: string; n: string };
}) {
  const n = Number(params.n);
  if (![1, 2, 3].includes(n)) notFound();
  await requireEnrollment(params.slug);

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
