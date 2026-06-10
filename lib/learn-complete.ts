import { prisma } from "./prisma";

// 단계 완료를 서버에서 직접 기록한다.
// 클라이언트 fetch(/api/learn/complete) 가 네비게이션으로 중단되어도
// 결과 페이지(서버 컴포넌트)에서 호출되어 진행률이 확실히 반영되도록 한다.
export async function recordStepComplete(
  userId: number,
  courseId: number,
  sessionType: string,
  mockNumber?: number
): Promise<void> {
  const update: Record<string, unknown> = {
    lastQIndex: 0,
    curStepKey: "",
    curStepPct: 0,
  };

  switch (sessionType) {
    case "round1":
      update.round1Done = true;
      update.lastRound = 1;
      break;
    case "round2":
      update.round2Done = true;
      update.lastRound = 2;
      break;
    case "round3":
      update.round3Done = true;
      update.lastRound = 3;
      break;
    case "wrong_round":
      update.wrongRoundDone = true;
      break;
    case "mock":
      if (mockNumber) {
        const prog = await prisma.learningProgress.findUnique({
          where: { userId_courseId: { userId, courseId } },
        });
        update.mockDone = Math.max(prog?.mockDone ?? 0, mockNumber);
        update.lastMock = mockNumber;
      }
      break;
    case "wrong_mock":
      update.wrongMockDone = true;
      break;
    default:
      return;
  }

  await prisma.learningProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, ...update },
    update,
  });
}
