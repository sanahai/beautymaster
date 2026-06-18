import { notFound, redirect } from "next/navigation";
import { requireEnrollment } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildAcademyQuizQuestions } from "@/lib/academy-quiz";
import { tierAtLeast } from "@/lib/academy";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";

export default async function AcademyQuestionsLearnPage({
  params,
}: {
  params: { slug: string };
}) {
  const { session } = await requireEnrollment(params.slug);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true },
  });

  if (!user?.academy || !tierAtLeast(user.academy.tier, "premium")) {
    redirect(`/learn/${params.slug}`);
  }

  const custom = await prisma.academyCustomQuestion.findMany({
    where: { academyId: user.academyId! },
    orderBy: { id: "asc" },
  });

  if (custom.length === 0) notFound();

  const quiz = buildAcademyQuizQuestions(custom);
  const base = `/learn/${params.slug}`;

  return (
    <QuizShell exitHref={base}>
      <QuizRunner
        questions={quiz}
        sessionType="academy"
        courseSlug={params.slug}
        timerSeconds={null}
        revealMode={false}
        resultPath={`${base}/academy/result`}
        title={`🏫 ${user.academy.name} 학원 문제`}
        callComplete={false}
        hideReport
        answerApi="/api/learn/academy-answer"
      />
    </QuizShell>
  );
}
