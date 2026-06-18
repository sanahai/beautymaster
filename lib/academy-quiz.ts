import { shuffleOptions, serializeOrder } from "./shuffle";
import type { QuizQuestion } from "./types";

type CustomQ = {
  id: number;
  subject: string | null;
  content: string;
  options: unknown;
  answer: number;
  explanation: string | null;
};

export function buildAcademyQuizQuestions(questions: CustomQ[]): QuizQuestion[] {
  return questions.map((q) => {
    const opts = Array.isArray(q.options) ? (q.options as string[]) : [];
    const padded: [string, string, string, string] = [
      opts[0] || "",
      opts[1] || "",
      opts[2] || "",
      opts[3] || "",
    ];
    const shuffled = shuffleOptions(padded, q.id, 99);
    return {
      id: q.id,
      subject: q.subject,
      content: q.content,
      explanation: q.explanation,
      options: shuffled,
      answer: q.answer,
      shuffledOrder: serializeOrder(shuffled),
    };
  });
}
