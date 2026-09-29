"use client";

import { BudgetSnapshot } from "@/components/dashboard/budget-snapshot";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { HealthScore } from "@/components/dashboard/health-score";
import { StatCard, StatIcons } from "@/components/dashboard/stat-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export function DashboardView() {
  const { data, loading, error } = useApiQuery(() => api.dashboard(), []);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageError message={error ?? "Failed to load dashboard"} />;

  const s = data.summary;

  return (
    <div className="space-y-6">
      <div className="portal-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm text-text-secondary">Available balance</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {formatCurrency(s.currentBalance)}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            <span className="text-success">{formatCurrency(s.totalIncome)}</span> in ·{" "}
            <span className="text-danger">{formatCurrency(s.totalExpenses)}</span> out this month
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/expenses"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
          >
            + Expense
          </Link>
          <Link
            href="/income"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
          >
            + Income
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Income" value={s.totalIncome} icon={StatIcons.income} />
        <StatCard title="Expenses" value={s.totalExpenses} icon={StatIcons.expense} />
        <StatCard title="Saved" value={s.totalSavings} icon={StatIcons.savings} />
        <StatCard
          title="Health score"
          value={s.financialHealthScore}
          format="number"
          icon={StatIcons.balance}
          subtitle="Out of 100"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ExpenseChart data={data.monthlyExpenses} />
        </div>
        <BudgetSnapshot budgets={data.budgets} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart data={data.categoryExpenses} />
        <HealthScoreLoader score={s.financialHealthScore} />
      </div>

      {s.recentTransactions.length > 0 ? (
        <TransactionList transactions={s.recentTransactions} />
      ) : (
        <div className="portal-card py-16 text-center">
          <p className="text-base font-medium text-text">No transactions yet</p>
          <p className="mt-2 text-sm text-text-secondary">
            Add income or expenses to see your dashboard update in real time.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/income" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white">
              Add income
            </Link>
            <Link href="/expenses" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text">
              Add expense
            </Link>
          </div>
        </div>
      )}

      <div className="portal-card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-text">Insights</h3>
        {data.insights.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {data.insights.map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-medium text-text">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{item.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-text-secondary">
            No insights yet. Go to Recommendations and click &quot;Refresh insights&quot; after adding transactions.
          </p>
        )}
      </div>
    </div>
  );
}

function HealthScoreLoader({ score }: { score: number }) {
  const { data } = useApiQuery(() => api.ml.healthScore(), []);
  const breakdown = data
    ? [
        { label: "Savings rate", value: data.breakdown.savingsRate },
        { label: "Budget adherence", value: data.breakdown.budgetAdherence },
        { label: "Expense stability", value: data.breakdown.expenseStability },
        { label: "Goal progress", value: data.breakdown.savingsGoalProgress },
      ]
    : [];

  return <HealthScore score={score} breakdown={breakdown} />;
}
