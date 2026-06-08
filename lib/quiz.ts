import { shuffleOptions, serializeOrder } from "./shuffle";
import type { QuizQuestion } from "./types";

type DbQuestion = {
  id: number;
  subject: string | null;
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: number;
  explanation: string | null;
};

// DB 문제를 회차 시드 기반으로 보기를 셔플하여 클라이언트용으로 변환
export function buildQuizQuestions(
  questions: DbQuestion[],
  roundSeed: number
): QuizQuestion[] {
  return questions.map((q) => {
    const shuffled = shuffleOptions(
      [q.option1, q.option2, q.option3, q.option4],
      q.id,
      roundSeed
    );
    return {
      id: q.id,
      subject: q.subject,
      content: q.content,
      explanation: q.explanation,
      options: shuffled,
      answer: q.answer, // originalIndex(1~4) 기준으로 정오 판정
      shuffledOrder: serializeOrder(shuffled),
    };
  });
}

export const ROUND_SEED: Record<string, number> = {
  trial: 0,
  round1: 1,
  round2: 2,
  round3: 3,
  wrong_round: 4,
  wrong_mock: 5,
};
