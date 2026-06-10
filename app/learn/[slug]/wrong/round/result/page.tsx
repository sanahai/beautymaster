import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireEnrollment } from "@/lib/access";
import { recordStepComplete } from "@/lib/learn-complete";

export default async function WrongRoundResultPage({
  params,
}: {
  params: { slug: string };
}) {
  const { session, course } = await requireEnrollment(params.slug);
  await recordStepComplete(session.userId, course.id, "wrong_round");
  const base = `/learn/${params.slug}`;
  return (
    <QuizShell exitHref={base}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-beauty-neutral">
          반복학습 오답복습 완료
        </h1>
        <ResultView
          homeHref={base}
          nextHref={`${base}/mock/1`}
          nextLabel="모의고사 1회 응시"
        />
      </div>
    </QuizShell>
  );
}
