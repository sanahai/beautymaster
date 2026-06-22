import { SERVICES, COLOR_STYLES } from "@/lib/services";

export default function ServiceCards() {
  return (
    <section id="services" className="bg-white px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">3대 AI 문제은행 서비스</h2>
          <p className="mt-3 text-slate-500">준비 중인 자격증에 맞는 서비스를 선택하세요</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => {
            const c = COLOR_STYLES[s.color];
            return (
              <article
                key={s.id}
                className={`group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ${c.ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${c.bg}`}>
                  {s.icon}
                </div>
                <h3 className={`text-xl font-bold ${c.text}`}>{s.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">{s.certs}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition ${c.btn} ${c.btnHover}`}
                >
                  바로가기 →
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
