import type { Budget } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface BudgetSnapshotProps {
  budgets: Budget[];
}

export function BudgetSnapshot({ budgets }: BudgetSnapshotProps) {
  return (
    <div className="portal-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Budgets</h3>
        <Link href="/budgets" className="text-xs font-medium text-brand hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-4">
        {budgets.slice(0, 3).map((b) => {
          const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100);
          const over = b.spent > b.limit;
          return (
            <div key={b.id}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-text">{b.category}</span>
                <span className="text-text-secondary">
                  {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
                <div
                  className={cn("h-full rounded-full", over ? "bg-danger" : "bg-brand")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
