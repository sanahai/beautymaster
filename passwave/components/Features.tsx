const FEATURES = [
  {
    icon: "🧠",
    title: "AI 오개념 진단",
    desc: "단순 정답 풀이가 아닌, 왜 그 오답을 골랐는지 분석합니다.",
  },
  {
    icon: "📅",
    title: "최신 출제기준 반영",
    desc: "개정 시험 범위를 즉시 업데이트한 문제은행을 제공합니다.",
  },
  {
    icon: "📱",
    title: "언제 어디서나",
    desc: "모바일 최적화로 자투리 시간에도 꾸준히 학습할 수 있습니다.",
  },
  {
    icon: "✅",
    title: "검증된 문제 품질",
    desc: "난이도·정답 분포까지 설계된 고품질 문항으로 실전 대비합니다.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">PASSWAVE가 다른 이유</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
