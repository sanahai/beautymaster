export default function ExplanationBox({
  explanation,
  isCorrect,
}: {
  explanation: string | null;
  isCorrect: boolean | null;
}) {
  return (
    <div className="animate-fade-in rounded-card border border-primary-pale bg-primary-pale/30 p-4">
      {isCorrect !== null && (
        <p
          className={`mb-1 font-bold ${
            isCorrect ? "text-beauty-success" : "text-beauty-danger"
          }`}
        >
          {isCorrect ? "✓ 정답입니다!" : "✗ 오답입니다"}
        </p>
      )}
      <p className="text-sm font-semibold text-primary">해설</p>
      <p className="mt-1 text-sm leading-relaxed text-beauty-neutral">
        {explanation || "해설이 등록되지 않은 문제입니다."}
      </p>
    </div>
  );
}
