import { SERVICES, COLOR_STYLES } from "@/lib/services";

export default function FinalCTA() {
  return (
    <section className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
          지금 바로 내 자격증 시험을 준비하세요
        </h2>
        <p className="mt-4 text-slate-500">아래에서 서비스를 선택해 바로 시작할 수 있습니다.</p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {SERVICES.map((s) => {
            const c = COLOR_STYLES[s.color];
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-white transition ${c.btn} ${c.btnHover}`}
              >
                {s.name} →
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
