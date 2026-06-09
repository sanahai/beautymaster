"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/access";
import { PACKAGE_PRICE } from "@/lib/courses";

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

// 미용사 패키지 신청: 활성 과정 4종 전체를 패키지 가격으로 일괄 신청 (대기 상태)
export async function createPackageEnrollmentAction() {
  const session = await requireSession("/enroll/package");

  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });
  if (courses.length === 0) redirect("/enroll");

  // 패키지 총액을 과정 수만큼 분배 (합계가 PACKAGE_PRICE와 정확히 일치하도록 나머지 보정)
  const per = Math.floor(PACKAGE_PRICE / courses.length);
  let remainder = PACKAGE_PRICE - per * courses.length;

  for (const c of courses) {
    const amount = per + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId: c.id } },
    });
    if (existing && existing.status === "active") continue; // 이미 수강중이면 유지

    if (existing) {
      await prisma.enrollment.update({
        where: { id: existing.id },
        data: { status: "pending", amount },
      });
    } else {
      await prisma.enrollment.create({
        data: { userId: session.userId, courseId: c.id, status: "pending", amount },
      });
    }
  }

  redirect("/enroll/package/payment");
}
