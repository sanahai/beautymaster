import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyStats, getAtRiskStudents } from "@/lib/academy-stats";
import { sendOwnerWeeklyReportEmail } from "@/lib/email";
import { sendWeeklyAlimtalk } from "@/lib/alimtalk";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const academies = await prisma.academy.findMany({
    where: { activeUntil: { gte: new Date() }, tier: { in: ["standard", "premium"] } },
  });

  const results = [];
  for (const academy of academies) {
    const stats = await getAcademyStats(academy.id);
    const atRisk = await getAtRiskStudents(academy.id, 5);

    await sendOwnerWeeklyReportEmail({
      to: academy.ownerEmail,
      academyName: academy.name,
      stats,
      atRisk: atRisk.map((s) => ({ name: s.name, accuracy: s.accuracy, status: s.status.label })),
    });

    if (academy.ownerPhone) {
      await sendWeeklyAlimtalk({
        phone: academy.ownerPhone,
        academyName: academy.name,
        inactiveCount: stats.inactive7d,
        atRiskCount: atRisk.length,
      });
    }

    results.push({ academyId: academy.id, name: academy.name, atRisk: atRisk.length });
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}
