"use client";

import { CategoryChart } from "@/components/dashboard/category-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";

export function AnalyticsView() {
  const { data, loading, error } = useApiQuery(() => api.dashboard(), []);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError message={error ?? "Failed to load analytics"} />;

  const summary = data.summary;
  const monthlyAvg =
    data.monthlyExpenses.length > 0
      ? Math.round(
          data.monthlyExpenses.reduce((sum, m) => sum + m.amount, 0) /
            data.monthlyExpenses.length,
        )
      : 0;

  return (
    <div>
      <PageHeader />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Income" value={summary.totalIncome} />
        <StatCard title="Expenses" value={summary.totalExpenses} />
        <StatCard title="Saved" value={summary.totalSavings} />
        <StatCard title="Monthly average" value={monthlyAvg} subtitle="Recent months" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ExpenseChart data={data.monthlyExpenses} title="Expense trend" />
        <CategoryChart data={data.categoryExpenses} />
      </div>
    </div>
  );
}
