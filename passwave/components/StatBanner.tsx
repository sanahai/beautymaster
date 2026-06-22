export default function StatBanner() {
  return (
    <section className="bg-gradient-to-r from-[#1a1a40] to-[#4f46e5] px-4 py-10">
      <p className="text-center text-base font-semibold text-white sm:text-lg md:text-xl">
        총 <span className="text-indigo-200">20,000+</span> 문항 ·{" "}
        <span className="text-indigo-200">5</span>개 분야 · 누적 학습자{" "}
        <span className="text-indigo-200">10,000+</span>명
      </p>
    </section>
  );
}
