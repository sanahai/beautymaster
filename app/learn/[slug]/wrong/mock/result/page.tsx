import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireEnrollment } from "@/lib/access";
import { recordStepComplete } from "@/lib/learn-complete";

export default async function WrongMockResultPage({
  params,
}: {
  params: { slug: string };
}) {
  const { session, course } = await requireEnrollment(params.slug);
  await recordStepComplete(session.userId, course.id, "wrong_mock");
  const base = `/learn/${params.slug}`;
  return (
    <QuizShell exitHref={base}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <div className="text-5xl">🏆</div>
          <h1 className="mt-2 text-2xl font-extrabold text-primary">전체 학습 완료!</h1>
          <p className="mt-1 text-beauty-gray">합격을 진심으로 축하드립니다 🎉</p>
        </div>
        <ResultView homeHref={base} nextHref="/dashboard" nextLabel="대시보드로" celebrate />
      </div>
    </QuizShell>
  );
}
