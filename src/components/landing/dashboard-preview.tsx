import { formatCurrency } from "@/lib/utils";

export function DashboardPreview() {
  const stats = [
    { label: "Income", value: formatCurrency(100000), color: "text-income" },
    { label: "Expenses", value: formatCurrency(70000), color: "text-expense" },
    { label: "Saved", value: formatCurrency(30000), color: "text-brand" },
    { label: "Balance", value: formatCurrency(30000), color: "text-navy" },
  ];

  const bars = [64, 67, 65, 68, 69, 70];
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const barColors = ["#0d9488", "#14b8a6", "#0d9488", "#14b8a6", "#0f766e", "#0d9488"];

  const transactions = [
    { name: "Grocery shopping", cat: "Food", amount: "−3,500", type: "expense" },
    { name: "Monthly salary", cat: "Income", amount: "+100,000", type: "income" },
    { name: "September rent", cat: "Rent", amount: "−25,000", type: "expense" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-light bg-white shadow-[0_32px_64px_-16px_rgba(13,148,136,0.25)]">
      <div className="flex items-center gap-2 border-b border-brand-light/60 bg-brand-subtle/50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        <span className="ml-3 text-xs font-medium text-brand/70">
          smartfin.app/dashboard
        </span>
      </div>

      <div className="grid lg:grid-cols-[148px_1fr]">
        <aside className="hidden border-r border-brand-light/60 bg-gradient-to-b from-brand-subtle to-white p-4 lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand/60">
            Menu
          </p>
          <ul className="mt-3 space-y-1 text-xs">
            <li className="rounded-lg bg-brand px-2.5 py-2 font-medium text-white">
              Overview
            </li>
            {["Expenses", "Budgets", "Forecasts"].map((item) => (
              <li
                key={item}
                className="rounded-lg px-2.5 py-2 text-brand-dark/70 hover:bg-brand-light/40"
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <div className="p-5 md:p-6">
          <p className="text-sm font-semibold text-brand-darker">Overview</p>
          <p className="text-xs text-muted">September 2026</p>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-brand-light/50 bg-brand-subtle/30 p-3"
              >
                <p className="text-[10px] font-medium text-muted">{s.label}</p>
                <p className={`mt-1 text-sm font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-brand-light/50 bg-white p-4">
            <p className="text-xs font-semibold text-brand-darker">
              Monthly expenses
            </p>
            <div className="mt-3 flex h-28 items-end justify-between gap-1.5">
              {bars.map((h, i) => (
                <div
                  key={months[i]}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: barColors[i],
                    }}
                  />
                  <span className="text-[9px] text-muted">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-brand-light/50">
            <p className="border-b border-brand-light/50 bg-brand-subtle/40 px-4 py-2 text-xs font-semibold text-brand-darker">
              Recent transactions
            </p>
            {transactions.map((tx) => (
              <div
                key={tx.name}
                className="flex items-center justify-between border-b border-brand-light/30 px-4 py-2.5 last:border-0"
              >
                <div>
                  <p className="text-xs font-medium text-brand-darker">{tx.name}</p>
                  <p className="text-[10px] text-muted">{tx.cat}</p>
                </div>
                <span
                  className={`text-xs font-bold ${
                    tx.type === "income" ? "text-income" : "text-expense"
                  }`}
                >
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
