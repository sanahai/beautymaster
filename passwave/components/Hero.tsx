function WaveDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute -bottom-px left-0 w-full text-white"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
        />
      </svg>
      <svg
        className="absolute bottom-8 left-0 w-full opacity-20"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="url(#waveGrad)"
          d="M0,96L60,90.7C120,85,240,75,360,69.3C480,64,600,64,720,74.7C840,85,960,107,1080,112C1200,117,1320,107,1380,101.3L1440,96L1440,120L0,120Z"
        />
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a40] via-[#312e81] to-[#4f46e5] px-4 pb-28 pt-20 text-white md:pb-32 md:pt-28">
      <WaveDecoration />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-indigo-100 backdrop-blur">
          AI 국가자격증 문제은행 허브
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          국가자격증 합격,
          <br />
          AI 문제은행으로 끝낸다
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-indigo-100 sm:text-lg">
          미용·조리·전문자격까지 — PASSWAVE 하나로 시작하세요
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#services"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-bold text-[#1a1a40] shadow-lg transition hover:bg-indigo-50 sm:w-auto"
          >
            내 자격증 찾기
          </a>
          <a
            href="#features"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            서비스 둘러보기
          </a>
        </div>
      </div>
    </section>
  );
}
