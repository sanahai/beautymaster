import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { questionId, selected, isCorrect, timeSpent } = body as {
    questionId: number;
    selected: number | null;
    isCorrect: boolean;
    timeSpent?: number;
  };

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true },
  });
  if (!user?.academyId || user.academy?.tier !== "premium") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const question = await prisma.academyCustomQuestion.findFirst({
    where: { id: questionId, academyId: user.academyId },
  });
  if (!question) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.academyUserAnswer.create({
    data: {
      userId: session.userId,
      academyQuestionId: questionId,
      selected: selected ?? null,
      isCorrect,
      timeSpent: timeSpent ?? null,
    },
  });

  await prisma.user.update({
    where: { id: session.userId },
    data: { lastActiveAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
