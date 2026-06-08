"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RESULT_KEY } from "./QuizRunner";
import type { QuizResult } from "@/lib/types";

type Props = {
  homeHref: string;
  retryHref?: string;
  nextHref?: string;
  nextLabel?: string;
  ctaEnroll?: boolean; // 무료체험 결과: 결제 유도
  celebrate?: boolean; // 최종 완료/합격 축하
};

export default function ResultView({
  homeHref,
  retryHref,
  nextHref,
  nextLabel,
  ctaEnroll,
  celebrate,
}: Props) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [openWrong, setOpenWrong] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_KEY);
      if (raw) setResult(JSON.parse(raw));
    } catch {}
  }, []);

  if (!result) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="mb-4 text-beauty-gray">결과 데이터를 찾을 수 없습니다.</p>
        <Link href={homeHref} className="btn-primary">학습 홈으로</Link>
      </div>
    );
  }

  const rate = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  const min = Math.floor(result.totalTime / 60);
  const sec = result.totalTime % 60;
  const isMock = result.sessionType === "mock";
  const passed = isMock && result.passScore !== undefined && result.correct >= result.passScore;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {celebrate && <Confetti />}

      {/* 합격/불합격 배너 (모의고사) */}
      {isMock && (
        <div
          className={`rounded-card p-6 text-center text-white ${
            passed ? "bg-beauty-success" : "bg-beauty-danger"
          }`}
        >
          <div className="text-4xl">{passed ? "🏆" : "💪"}</div>
          <h2 className="mt-2 text-2xl font-extrabold">
            {passed ? "합격입니다!" : "불합격 · 조금만 더!"}
          </h2>
          <p className="mt-1 opacity-90">
            {result.correct} / {result.total}점 (합격선 {result.passScore}점)
          </p>
        </div>
      )}

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="총 문제" value={`${result.total}`} />
        <SummaryCard label="정답" value={`${result.correct}`} accent />
        <SummaryCard label="정답률" value={`${rate}%`} accent />
        <SummaryCard label="소요 시간" value={`${min}분 ${sec}초`} />
      </div>

      {/* 과목별 정답률 */}
      <div className="card">
        <h3 className="mb-4 text-lg font-bold text-beauty-neutral">과목별 정답률</h3>
        <div className="space-y-3">
          {Object.entries(result.perSubject).map(([subj, s]) => {
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={subj}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-beauty-neutral">{subj}</span>
                  <span className="text-beauty-gray">
                    {s.correct}/{s.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-pale">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 60 ? "bg-beauty-success" : "bg-primary"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 오답 목록 */}
      {result.wrongList.length > 0 && (
        <div className="card">
          <h3 className="mb-4 text-lg font-bold text-beauty-neutral">
            오답 목록 ({result.wrongList.length})
          </h3>
          <ul className="space-y-2">
            {result.wrongList.map((w, i) => (
              <li key={`${w.id}-${i}`} className="rounded-btn border border-gray-100">
                <button
                  onClick={() => setOpenWrong(openWrong === i ? null : i)}
                  className="flex w-full items-start gap-2 p-3 text-left"
                >
                  <span className="mt-0.5 text-beauty-danger">✗</span>
                  <span className="flex-1 text-sm text-beauty-neutral">{w.content}</span>
                </button>
                {openWrong === i && (
                  <div className="border-t border-gray-100 bg-primary-pale/20 p-3 text-sm">
                    <p className="text-beauty-success">정답: {w.correctText}</p>
                    <p className="mt-1 text-beauty-gray">{w.explanation}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 결제 유도 (무료체험) */}
      {ctaEnroll && (
        <div className="rounded-card bg-primary p-6 text-center text-white">
          <h3 className="text-xl font-bold">실력을 확인하셨나요?</h3>
          <p className="mt-1 text-primary-pale">
            전체 1,000+문제와 6회 모의고사로 합격까지 함께해요.
          </p>
          <Link
            href="/enroll"
            className="mt-4 inline-flex rounded-btn bg-white px-6 py-3 font-bold text-primary hover:bg-primary-pale"
          >
            전체 과정 결제하기
          </Link>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {retryHref && (
          <Link href={retryHref} className="btn-outline flex-1">
            다시 풀기
          </Link>
        )}
        <Link href={homeHref} className="btn-outline flex-1">
          학습 홈으로
        </Link>
        {nextHref && (
          <Link href={nextHref} className="btn-primary flex-1">
            {nextLabel || "다음 단계로"}
          </Link>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="card text-center">
      <div className={`text-2xl font-extrabold ${accent ? "text-primary" : "text-beauty-neutral"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-beauty-gray">{label}</div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 40 });
  const emojis = ["🎉", "✨", "💄", "💖", "🌸", "🏆"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute animate-[fall_3s_linear_infinite] text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          {emojis[i % emojis.length]}
        </span>
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0.2; } }`}</style>
    </div>
  );
}
