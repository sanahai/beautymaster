export type QuizOption = {
  text: string;
  originalIndex: number; // 1~4 (원본 보기 번호)
};

export type QuizQuestion = {
  id: number;
  subject: string | null;
  content: string;
  explanation: string | null;
  options: QuizOption[];
  answer: number; // 정답의 originalIndex (1~4)
  shuffledOrder: string;
};

export type SessionType =
  | "trial"
  | "round1"
  | "round2"
  | "round3"
  | "wrong_round"
  | "wrong_mock"
  | "mock";

export type WrongItem = {
  id: number;
  subject: string | null;
  content: string;
  correctText: string;
  explanation: string | null;
};

export type QuizResult = {
  sessionType: SessionType;
  courseSlug: string;
  mockNumber?: number;
  total: number;
  correct: number;
  totalTime: number;
  perSubject: Record<string, { correct: number; total: number }>;
  wrongList: WrongItem[];
  passScore?: number; // 모의고사 합격선 (점수)
};
