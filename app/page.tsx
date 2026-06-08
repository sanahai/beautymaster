import Link from "next/link";
import Header from "@/components/Header";
import { COURSES, PACKAGE_PRICE } from "@/lib/courses";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const totalQuestions = await prisma.question.count({ where: { isActive: true } });

  const flow = [
    { icon: "🎁", title: "무료체험", desc: "100문제 무제한" },
    { icon: "📖", title: "반복학습 3회차", desc: "읽기→50초→40초" },
    { icon: "🔁", title: "오답복습①", desc: "취약점 집중" },
    { icon: "📝", title: "모의고사 6회", desc: "실전 비율 반영" },
    { icon: "🔁", title: "오답복습②", desc: "최종 점검" },
    { icon: "🏆", title: "합격", desc: "60점 이상" },
  ];

  const reviews = [
    { name: "이○○", course: "미용사 일반", text: "선택지가 매번 섞여서 정답 위치를 외우는 습관이 사라졌어요. 3회차 돌고 나니 진짜 외워졌습니다." },
    { name: "박○○", course: "피부 미용사", text: "오답복습 기능이 최고예요. 틀린 문제만 모아서 다시 푸니 시간이 확 줄었어요. 한 번에 합격!" },
    { name: "최○○", course: "네일 미용사", text: "모의고사 난이도가 실제 시험이랑 비슷해서 실전 감각 잡는 데 큰 도움이 됐습니다." },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-pale to-beauty-bg">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
            <span className="mb-5 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
              미용사 자격증 필기 합격 플랫폼
            </span>
            <h1 className="mb-5 text-4xl font-extrabold leading-tight text-beauty-neutral sm:text-5xl">
              선택지가 매번 섞이는
              <br />
              <span className="text-primary">3배수 반복학습</span>으로 합격까지
            </h1>
            <p className="mx-auto mb-9 max-w-2xl text-lg text-beauty-gray">
              미용사 일반·피부·네일·메이크업 4종. {totalQuestions.toLocaleString()}개 이상의
              기출·예상 문제를 반복학습 알고리즘과 6회 모의고사로 완벽 대비하세요.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="btn-accent w-full px-8 py-4 text-lg sm:w-auto">
                무료체험 시작하기
              </Link>
              <Link href="/login" className="btn-outline w-full px-8 py-4 text-lg sm:w-auto">
                로그인
              </Link>
            </div>
          </div>
        </section>

        {/* 수치 배너 */}
        <section className="border-y border-primary-pale bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
            {[
              { num: "1,000+", label: "기출·예상 문제" },
              { num: "6회", label: "실전 모의고사" },
              { num: "3단계", label: "반복학습" },
              { num: "합격률 ↑", label: "오답복습 시스템" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-primary">{s.num}</div>
                <div className="mt-1 text-sm text-beauty-gray">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 자격증 목록 */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">자격증 4종</h2>
          <p className="mb-10 text-center text-beauty-gray">준비 중인 자격증을 선택하세요.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((c) => (
              <div key={c.slug} className="card group transition-shadow hover:shadow-cardHover">
                <div className="mb-3 text-5xl">{c.icon}</div>
                <h3 className="mb-1 text-lg font-bold text-beauty-neutral">{c.name}</h3>
                <p className="mb-4 text-sm text-beauty-gray">{c.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {c.price.toLocaleString()}원
                  </span>
                  <span className="text-xs text-beauty-gray">3개월</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 학습 플로우 */}
        <section className="bg-primary-pale/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">합격까지 학습 플로우</h2>
            <p className="mb-10 text-center text-beauty-gray">단계별 잠금 해제 방식으로 빠짐없이 학습합니다.</p>
            <div className="flex flex-wrap items-stretch justify-center gap-3">
              {flow.map((f, i) => (
                <div key={f.title} className="flex items-center gap-3">
                  <div className="w-32 rounded-card bg-white p-4 text-center shadow-card">
                    <div className="mb-1 text-3xl">{f.icon}</div>
                    <div className="text-sm font-bold text-beauty-neutral">{f.title}</div>
                    <div className="text-xs text-beauty-gray">{f.desc}</div>
                  </div>
                  {i < flow.length - 1 && (
                    <span className="hidden text-2xl text-primary sm:inline">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 가격 안내 */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">가격 안내</h2>
          <p className="mb-10 text-center text-beauty-gray">합리적인 가격으로 합격까지.</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card text-center">
              <h3 className="text-lg font-bold text-beauty-neutral">무료 체험</h3>
              <div className="my-4 text-4xl font-extrabold text-primary">0원</div>
              <p className="mb-6 text-sm text-beauty-gray">100문제 무제한 반복</p>
              <Link href="/signup" className="btn-outline w-full">시작하기</Link>
            </div>
            <div className="card relative border-2 border-primary text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-accent px-3 py-1 text-xs font-bold text-white">
                인기
              </span>
              <h3 className="text-lg font-bold text-beauty-neutral">단일 자격증</h3>
              <div className="my-4 text-4xl font-extrabold text-primary">39,000원</div>
              <p className="mb-6 text-sm text-beauty-gray">1종 전체 문제 · 3개월</p>
              <Link href="/enroll" className="btn-primary w-full">신청하기</Link>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-bold text-beauty-neutral">미용사 패키지</h3>
              <div className="my-4 text-4xl font-extrabold text-primary">
                {PACKAGE_PRICE.toLocaleString()}원
              </div>
              <p className="mb-6 text-sm text-beauty-gray">4종 전체 · 약 50% 할인</p>
              <Link href="/enroll" className="btn-outline w-full">신청하기</Link>
            </div>
          </div>
        </section>

        {/* 후기 */}
        <section className="bg-primary-pale/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-10 text-center text-3xl font-bold text-beauty-neutral">합격 후기</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.map((r) => (
                <div key={r.name} className="card">
                  <div className="mb-3 text-primary-accent">★★★★★</div>
                  <p className="mb-4 text-sm leading-relaxed text-beauty-neutral">“{r.text}”</p>
                  <div className="text-sm font-semibold text-beauty-gray">
                    {r.name} · {r.course}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-primary">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">지금 무료로 시작하세요</h2>
            <p className="mb-8 text-primary-pale">회원가입 후 100문제를 바로 풀어볼 수 있습니다.</p>
            <Link href="/signup" className="inline-flex rounded-btn bg-white px-8 py-4 text-lg font-bold text-primary transition hover:bg-primary-pale">
              무료체험 시작하기
            </Link>
          </div>
        </section>

        <footer className="bg-beauty-neutral py-8 text-center text-sm text-white/70">
          <p className="mb-1 font-bold text-white">💄 BEAUTYmaster</p>
          <p>미용사 자격증 필기시험 문제은행 · support@beautymaster.kr</p>
          <p className="mt-2 text-xs">© 2026 BEAUTYmaster. 개인정보 처리방침 · 이용약관</p>
        </footer>
      </main>
    </>
  );
}
