import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions } from "@/lib/quiz";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";

export default async function TrialPage() {
  await requireSession("/trial");

  const questions = await prisma.question.findMany({
    where: { isFree: true, isActive: true },
    take: 100,
    orderBy: { id: "asc" },
  });

  const quiz = buildQuizQuestions(questions, 0);

  return (
    <QuizShell exitHref="/dashboard">
      <QuizRunner
        questions={quiz}
        sessionType="trial"
        courseSlug=""
        timerSeconds={null}
        revealMode={false}
        resultPath="/trial/result"
        title="🎁 무료체험"
        callComplete={false}
      />
    </QuizShell>
  );
}
