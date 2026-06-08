"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/access";

// 수강신청 생성 (계좌이체 대기 상태)
export async function createEnrollmentAction(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const session = await requireSession(`/enroll/${slug}`);

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) redirect("/enroll");

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: course!.id } },
  });

  if (existing && existing.status === "active") {
    redirect(`/learn/${slug}`);
  }

  if (existing) {
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { status: "pending", amount: course!.price },
    });
  } else {
    await prisma.enrollment.create({
      data: {
        userId: session.userId,
        courseId: course!.id,
        status: "pending",
        amount: course!.price,
      },
    });
  }

  redirect(`/enroll/${slug}/payment`);
}

// 데모용: 결제 즉시 승인 (실제로는 관리자가 입금 확인 후 승인)
export async function approveDemoEnrollmentAction(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const session = await requireSession();

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) redirect("/enroll");

  const expires = new Date();
  expires.setDate(expires.getDate() + course!.durationDays);

  await prisma.enrollment.updateMany({
    where: { userId: session.userId, courseId: course!.id },
    data: { status: "active", paidAt: new Date(), expiresAt: expires },
  });

  redirect("/enroll/complete");
}
