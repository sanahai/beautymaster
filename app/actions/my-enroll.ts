"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/access";

// 회원이 본인 수강신청을 취소 (대기/수강중 → 취소). 내역은 보존됨.
export async function cancelMyEnrollmentAction(formData: FormData) {
  const session = await requireSession();
  const id = Number(formData.get("id"));

  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment || enrollment.userId !== session.userId) return;
  if (!["pending", "active"].includes(enrollment.status)) return;

  await prisma.enrollment.update({
    where: { id },
    data: { status: "cancelled" },
  });

  revalidatePath("/mypage/history");
  revalidatePath("/dashboard");
  revalidatePath("/admin/enrollments");
}

// 회원이 본인 내역을 삭제(숨김). 실제 레코드는 보존되어 목록에 '삭제됨'으로 표시.
export async function deleteMyEnrollmentAction(formData: FormData) {
  const session = await requireSession();
  const id = Number(formData.get("id"));

  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment || enrollment.userId !== session.userId) return;

  // 진행 중(대기/수강중)인 신청을 삭제하면 함께 취소 처리하여 학습/매출 집계에서 제외
  const nextStatus = ["pending", "active"].includes(enrollment.status)
    ? "cancelled"
    : enrollment.status;

  await prisma.enrollment.update({
    where: { id },
    data: { userDeleted: true, status: nextStatus },
  });

  revalidatePath("/mypage/history");
  revalidatePath("/dashboard");
  revalidatePath("/admin/enrollments");
}
