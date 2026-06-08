import Link from "next/link";
import Header from "@/components/Header";
import { requireEnrollment, getOrCreateProgress } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { computeSteps, progressPercent } from "@/lib/progress";

export default async function LearnHomePage({
  params,
}: {
  params: { slug: string };
}) {
  const { session, course } = await requireEnrollment(params.slug);
  const progress = await getOrCreateProgress(session.userId, course.id);
  const steps = computeSteps(course.slug, progress);
  const pct = progressPercent(progress);

  // 오답복습 단계의 오답 개수 표시
  const roundWrong = await prisma.wrongNote.count({
    where: {
      userId: session.userId,
      source: { in: ["round2", "round3"] },
      isResolved: false,
      question: { courseId: course.id },
    },
  });
  const mockWrong = await prisma.wrongNote.count({
    where: {
      userId: session.userId,
      source: { in: ["mock1", "mock2", "mock3", "mock4", "mock5", "mock6"] },
      isResolved: false,
      question: { courseId: course.id },
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/dashboard" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
          ← 대시보드
        </Link>
        <h1 className="mb-1 text-3xl font-bold text-beauty-neutral">{course.name}</h1>
        <p className="mb-6 text-beauty-gray">단계별로 잠금 해제하며 학습을 완성하세요.</p>

        {/* 전체 진행률 */}
        <div className="card mb-8">
          <div className="mb-2 flex justify-between">
            <span className="font-semibold text-beauty-neutral">전체 진행률</span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-primary-pale">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* 단계 카드 */}
        <div className="space-y-3">
          {steps.map((step) => {
            const wrongCount =
              step.key === "wrong_round" ? roundWrong : step.key === "wrong_mock" ? mockWrong : null;

            const card = (
              <div
                className={`flex items-center gap-4 rounded-card border-2 p-4 transition-all ${
                  step.state === "done"
                    ? "border-beauty-success/30 bg-[#E8F5E9]/40"
                    : step.state === "current"
                    ? "border-primary bg-white shadow-card hover:shadow-cardHover"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="text-3xl">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-beauty-neutral">{step.label}</h3>
                    {step.state === "done" && (
                      <span className="text-sm font-bold text-beauty-success">✓ 완료</span>
                    )}
                    {step.state === "locked" && <span className="text-sm">🔒</span>}
                  </div>
                  <p className="text-sm text-beauty-gray">
                    {step.desc}
                    {wrongCount !== null && step.state !== "locked" && (
                      <span className="ml-1 font-semibold text-primary">· 오답 {wrongCount}개</span>
                    )}
                  </p>
                </div>
                {step.state === "current" && (
                  <span className="rounded-btn bg-primary px-4 py-2 text-sm font-bold text-white">
                    {step.key.startsWith("round") || step.key.startsWith("wrong") ? "시작" : "응시"}
                  </span>
                )}
                {step.state === "done" && (
                  <span className="rounded-btn border border-primary px-4 py-2 text-sm font-semibold text-primary">
                    다시 풀기
                  </span>
                )}
              </div>
            );

            if (step.state === "locked") {
              return <div key={step.key}>{card}</div>;
            }
            // 오답복습은 오답이 없으면 비활성 안내
            if (wrongCount === 0 && step.state === "current") {
              return (
                <div key={step.key} className="relative">
                  {card}
                  <p className="mt-1 pl-4 text-xs text-beauty-gray">
                    복습할 오답이 없습니다. 이전 단계에서 오답이 누적되면 활성화됩니다.
                  </p>
                </div>
              );
            }
            return (
              <Link key={step.key} href={step.href} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
