interface HealthScoreProps {
  score: number;
  breakdown?: { label: string; value: number }[];
}

export function HealthScore({ score, breakdown }: HealthScoreProps) {
  return (
    <div className="portal-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-text">Financial health</h3>
        <div className="text-right">
          <span className="text-3xl font-semibold text-brand">{score}</span>
          <span className="text-sm text-text-secondary"> /100</span>
        </div>
      </div>
      {breakdown && (
        <div className="mt-5 space-y-3">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-text-secondary">{item.label}</span>
                <span className="font-medium text-text">{item.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
