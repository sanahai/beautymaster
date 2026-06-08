// 동일 문제+회차에서는 항상 같은 셔플 결과 보장 (seed 기반)
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export type ShuffledOption = {
  text: string;
  originalIndex: number; // 1~4 (원본 정답 번호와 매칭)
};

// 문제의 보기 4개를 seed 기반으로 셔플하여 화면 표시용 배열 반환.
// originalIndex 로 정답 여부를 판정한다.
export function shuffleOptions(
  options: [string, string, string, string],
  questionId: number,
  roundNumber: number
): ShuffledOption[] {
  const indexed: ShuffledOption[] = options.map((text, i) => ({
    text,
    originalIndex: i + 1,
  }));
  return seededShuffle(indexed, questionId * 10 + roundNumber);
}

// 셔플된 순서를 "3142" 같은 문자열로 직렬화 (저장용)
export function serializeOrder(shuffled: ShuffledOption[]): string {
  return shuffled.map((o) => o.originalIndex).join("");
}
