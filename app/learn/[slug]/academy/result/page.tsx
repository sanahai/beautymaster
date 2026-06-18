import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireEnrollment } from "@/lib/access";

export default async function AcademyLearnResultPage({
  params,
}: {
  params: { slug: string };
}) {
  await requireEnrollment(params.slug);
  const base = `/learn/${params.slug}`;

  return (
    <QuizShell exitHref={base}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-beauty-neutral">학원 문제 결과</h1>
        <ResultView
          homeHref={base}
          retryHref={`${base}/academy`}
          nextHref={base}
          nextLabel="학습 홈으로"
        />
      </div>
    </QuizShell>
  );
}
