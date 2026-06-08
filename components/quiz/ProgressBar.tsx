export default function ProgressBar({
  current,
  total,
  subject,
}: {
  current: number;
  total: number;
  subject?: string | null;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold text-beauty-neutral">
          {subject && (
            <span className="mr-2 rounded-full bg-primary-pale px-2.5 py-0.5 text-xs font-bold text-primary">
              {subject}
            </span>
          )}
          {current} / {total}
        </span>
        <span className="text-beauty-gray">{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-pale">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
