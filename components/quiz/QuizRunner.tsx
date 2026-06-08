"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import TimerGauge from "./TimerGauge";
import OptionButton, { type OptionStatus } from "./OptionButton";
import ExplanationBox from "./ExplanationBox";
import type { QuizQuestion, QuizResult, SessionType, WrongItem } from "@/lib/types";

type Props = {
  questions: QuizQuestion[];
  sessionType: SessionType;
  courseSlug: string;
  timerSeconds: number | null;
  revealMode: boolean; // round1: 정답·해설 즉시 표시
  resultPath: string;
  title: string;
  mockNumber?: number;
  callComplete?: boolean;
};

export const RESULT_KEY = "bm_result";

export default function QuizRunner({
  questions,
  sessionType,
  courseSlug,
  timerSeconds,
  revealMode,
  resultPath,
  title,
  mockNumber,
  callComplete = true,
}: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(revealMode);
  const [seconds, setSeconds] = useState(timerSeconds ?? 0);
  const [finishing, setFinishing] = useState(false);

  const startRef = useRef<number>(Date.now());
  const statsRef = useRef({
    correct: 0,
    totalTime: 0,
    perSubject: {} as Record<string, { correct: number; total: number }>,
    wrongList: [] as WrongItem[],
  });

  const q = questions[index];
  const total = questions.length;

  const recordAnswer = useCallback(
    (sel: number | null, isCorrect: boolean, timeSpent: number) => {
      if (revealMode) return; // 1회차는 기록하지 않음
      fetch("/api/learn/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: q.id,
          sessionType,
          selected: sel,
          isCorrect,
          timeSpent,
          shuffledOrder: q.shuffledOrder,
          mockNumber,
        }),
      }).catch(() => {});
    },
    [q, sessionType, mockNumber, revealMode]
  );

  const commitStats = useCallback(
    (sel: number | null, isCorrect: boolean, timeSpent: number) => {
      const s = statsRef.current;
      s.totalTime += timeSpent;
      const subj = q.subject || "기타";
      if (!s.perSubject[subj]) s.perSubject[subj] = { correct: 0, total: 0 };
      s.perSubject[subj].total += 1;
      if (isCorrect) {
        s.correct += 1;
        s.perSubject[subj].correct += 1;
      } else {
        const correctOpt = q.options.find((o) => o.originalIndex === q.answer);
        s.wrongList.push({
          id: q.id,
          subject: q.subject,
          content: q.content,
          correctText: correctOpt?.text || "",
          explanation: q.explanation,
        });
      }
    },
    [q]
  );

  const handleSelect = (originalIndex: number) => {
    if (revealed || selected !== null) return;
    const timeSpent = Math.round((Date.now() - startRef.current) / 1000);
    const isCorrect = originalIndex === q.answer;
    setSelected(originalIndex);
    setRevealed(true);
    commitStats(originalIndex, isCorrect, timeSpent);
    recordAnswer(originalIndex, isCorrect, timeSpent);
  };

  const handleTimeout = useCallback(() => {
    if (revealed) return;
    const timeSpent = timerSeconds ?? 0;
    setSelected(null);
    setRevealed(true);
    commitStats(null, false, timeSpent);
    recordAnswer(null, false, timeSpent);
  }, [revealed, timerSeconds, commitStats, recordAnswer]);

  // 타이머
  useEffect(() => {
    if (timerSeconds === null || revealed) return;
    if (seconds <= 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, revealed, timerSeconds, handleTimeout]);

  const finish = async () => {
    setFinishing(true);
    const s = statsRef.current;
    const result: QuizResult = {
      sessionType,
      courseSlug,
      mockNumber,
      total,
      correct: s.correct,
      totalTime: s.totalTime,
      perSubject: s.perSubject,
      wrongList: s.wrongList,
      passScore: sessionType === "mock" ? Math.ceil(total * 0.6) : undefined,
    };
    try {
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
    } catch {}

    if (callComplete) {
      try {
        await fetch("/api/learn/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug,
            sessionType,
            mockNumber,
            score: sessionType === "mock" ? s.correct : undefined,
          }),
        });
      } catch {}
    }
    router.push(resultPath);
  };

  const next = () => {
    // 1회차(reveal)는 카운트만, 나머지는 stats 이미 반영됨
    if (revealMode) {
      // reveal 모드는 정답 처리 없이 진행률만
    }
    if (index + 1 >= total) {
      finish();
      return;
    }
    const nextIdx = index + 1;
    setIndex(nextIdx);
    setSelected(null);
    setRevealed(revealMode);
    setSeconds(timerSeconds ?? 0);
    startRef.current = Date.now();

    // 진행 저장 (반복학습 한정, 5문제마다)
    if (sessionType.startsWith("round") && nextIdx % 5 === 0) {
      fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lastQIndex: nextIdx }),
      }).catch(() => {});
    }
  };

  if (!q) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-beauty-gray">출제할 문제가 없습니다.</p>
      </div>
    );
  }

  const optionStatus = (originalIndex: number): OptionStatus => {
    if (revealMode) {
      return originalIndex === q.answer ? "correct" : "disabled";
    }
    if (!revealed) {
      return selected === originalIndex ? "selected" : "idle";
    }
    if (originalIndex === q.answer) return "correct";
    if (originalIndex === selected) return "wrong";
    return "disabled";
  };

  const isCorrectNow = revealMode ? null : revealed ? selected === q.answer : null;

  return (
    <div className="mx-auto max-w-2xl">
      {/* 상단 바 */}
      <div className="mb-5 flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar current={index + 1} total={total} subject={q.subject} />
        </div>
        {timerSeconds !== null && !revealMode && (
          <TimerGauge seconds={seconds} total={timerSeconds} />
        )}
      </div>

      {/* 문제 카드 */}
      <div className="card animate-fade-in">
        <p className="mb-1 text-sm font-semibold text-primary">{title}</p>
        <h2 className="mb-5 text-lg font-bold leading-relaxed text-beauty-neutral">
          Q{index + 1}. {q.content}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <OptionButton
              key={i}
              number={i + 1}
              text={opt.text}
              status={optionStatus(opt.originalIndex)}
              onClick={() => handleSelect(opt.originalIndex)}
              disabled={revealed || revealMode}
            />
          ))}
        </div>

        {revealed && (
          <div className="mt-5">
            <ExplanationBox explanation={q.explanation} isCorrect={isCorrectNow} />
          </div>
        )}

        <button
          onClick={next}
          disabled={!revealed || finishing}
          className="btn-primary mt-6 w-full"
        >
          {finishing
            ? "결과 정리 중..."
            : index + 1 >= total
            ? "결과 보기"
            : "다음 문제"}
        </button>
      </div>
    </div>
  );
}
