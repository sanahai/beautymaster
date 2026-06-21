/**
 * 빈 DB(운영 최초·복구)에 최소 계정·학원 생성 — 기존 데이터는 건드리지 않음
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@beautymaster.kr";
const ADMIN_PASS = "admin1234";
const DEFAULT_OWNER_EMAIL = process.env.BOOTSTRAP_OWNER_EMAIL || "sanahai@naver.com";
const DEFAULT_OWNER_PASS = process.env.BOOTSTRAP_OWNER_PASSWORD || "owner1234";

function slugify(name) {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
  return s || `academy-${Date.now().toString(36)}`;
}

async function uniqueSubdomain(base) {
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const exists = await prisma.academy.findUnique({ where: { subdomain: candidate } });
    if (!exists) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

async function uniqueCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 30; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const exists = await prisma.academy.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error("code gen failed");
}

try {
  const [adminCount, ownerCount, academyCount] = await Promise.all([
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.count({ where: { role: "owner" } }),
    prisma.academy.count(),
  ]);

  if (adminCount === 0) {
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(ADMIN_PASS, 10),
        name: "관리자",
        role: "admin",
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] admin created: ${ADMIN_EMAIL} / ${ADMIN_PASS}`);
  } else {
    console.log("[bootstrap] admin exists, skip");
  }

  // 원장 계정 없거나 학원 없으면 기본 학원+원장 생성
  if (ownerCount === 0 || academyCount === 0) {
    let academy = await prisma.academy.findFirst({ orderBy: { id: "asc" } });
    if (!academy) {
      const activeUntil = new Date();
      activeUntil.setFullYear(activeUntil.getFullYear() + 1);
      academy = await prisma.academy.create({
        data: {
          name: "뷰티마스터",
          brand: process.env.NEXT_PUBLIC_BRAND || "beautymaster",
          tier: "premium",
          code: await uniqueCode(),
          subdomain: await uniqueSubdomain(slugify("beauty-master")),
          ownerEmail: DEFAULT_OWNER_EMAIL,
          maxStudents: 50,
          activeUntil,
          primaryColor: "#0F172A",
        },
      });
      console.log(`[bootstrap] academy created: ${academy.name} /a/${academy.subdomain}`);
    }

    let owner = await prisma.user.findUnique({ where: { email: DEFAULT_OWNER_EMAIL } });
    const passwordHash = await bcrypt.hash(DEFAULT_OWNER_PASS, 10);

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          email: DEFAULT_OWNER_EMAIL,
          passwordHash,
          name: "원장",
          role: "owner",
          academyId: academy.id,
          emailVerified: true,
        },
      });
      console.log(`[bootstrap] owner created: ${DEFAULT_OWNER_EMAIL} / ${DEFAULT_OWNER_PASS}`);
    } else {
      await prisma.user.update({
        where: { id: owner.id },
        data: {
          passwordHash,
          role: "owner",
          academyId: academy.id,
          emailVerified: true,
        },
      });
      console.log(`[bootstrap] owner updated: ${DEFAULT_OWNER_EMAIL} / ${DEFAULT_OWNER_PASS}`);
    }
  } else {
    // 원장은 있는데 비밀번호 몰라는 경우 — BOOTSTRAP_RESET_OWNER=1 이면 sanahai 비번 재설정
    if (process.env.BOOTSTRAP_RESET_OWNER === "1") {
      const owner = await prisma.user.findUnique({ where: { email: DEFAULT_OWNER_EMAIL } });
      if (owner) {
        await prisma.user.update({
          where: { id: owner.id },
          data: { passwordHash: await bcrypt.hash(DEFAULT_OWNER_PASS, 10), emailVerified: true },
        });
        console.log(`[bootstrap] owner password reset: ${DEFAULT_OWNER_EMAIL}`);
      }
    } else {
      console.log("[bootstrap] owner+academy exist, skip");
    }
  }
} finally {
  await prisma.$disconnect();
}
