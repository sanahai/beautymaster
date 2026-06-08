import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-beauty-bg px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-extrabold text-primary">
        <span className="text-3xl">💄</span>
        BEAUTY<span className="text-beauty-neutral">master</span>
      </Link>
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-beauty-neutral">로그인</h1>
        <p className="mb-6 text-sm text-beauty-gray">미용사 자격증 합격, 지금 시작하세요.</p>
        <LoginForm redirectTo={searchParams.redirect || "/dashboard"} />
      </div>
      <p className="mt-6 text-center text-xs text-beauty-gray">
        데모 계정 — 학생: student@test.com / test1234 · 관리자: admin@beautymaster.kr / admin1234
      </p>
    </main>
  );
}
