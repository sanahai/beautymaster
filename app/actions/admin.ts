"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";

export async function approveEnrollmentAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!enrollment) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + enrollment.course.durationDays);

  await prisma.enrollment.update({
    where: { id },
    data: { status: "active", paidAt: new Date(), expiresAt: expires },
  });
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
}

export async function cancelEnrollmentAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.enrollment.update({
    where: { id },
    data: { status: "cancelled" },
  });
  revalidatePath("/admin/enrollments");
}

export async function createQuestionAction(formData: FormData) {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  await prisma.question.create({
    data: {
      courseId,
      subject: String(formData.get("subject") || ""),
      content: String(formData.get("content") || ""),
      option1: String(formData.get("option1") || ""),
      option2: String(formData.get("option2") || ""),
      option3: String(formData.get("option3") || ""),
      option4: String(formData.get("option4") || ""),
      answer: Number(formData.get("answer")) || 1,
      explanation: String(formData.get("explanation") || "") || null,
      difficulty: Number(formData.get("difficulty")) || 2,
      isFree: formData.get("isFree") === "on",
    },
  });
  revalidatePath("/admin/questions");
}

export async function toggleQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q) return;
  await prisma.question.update({
    where: { id },
    data: { isActive: !q.isActive },
  });
  revalidatePath("/admin/questions");
}

// TSV 일괄 업로드: subject \t content \t opt1 \t opt2 \t opt3 \t opt4 \t answer \t explanation \t difficulty \t isFree
export async function bulkUploadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  const raw = String(formData.get("data") || "").trim();
  if (!raw || !courseId) return;

  const rows = raw.split("\n").filter((l) => l.trim());
  const data = rows
    .map((line) => {
      const c = line.split("\t");
      if (c.length < 7) return null;
      return {
        courseId,
        subject: c[0]?.trim() || null,
        content: c[1]?.trim() || "",
        option1: c[2]?.trim() || "",
        option2: c[3]?.trim() || "",
        option3: c[4]?.trim() || "",
        option4: c[5]?.trim() || "",
        answer: Number(c[6]?.trim()) || 1,
        explanation: c[7]?.trim() || null,
        difficulty: Number(c[8]?.trim()) || 2,
        isFree: (c[9]?.trim() || "").toUpperCase() === "TRUE",
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (data.length > 0) {
    await prisma.question.createMany({ data });
  }
  revalidatePath("/admin/questions");
}
