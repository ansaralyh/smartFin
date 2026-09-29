import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";

interface WelcomeBannerProps {
  balance: number;
  income: number;
  expenses: number;
  healthScore: number;
}

export function WelcomeBanner({
  balance,
  income,
  expenses,
  healthScore,
}: WelcomeBannerProps) {
  const savingsRate = Math.round(((income - expenses) / income) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-darker via-brand-dark to-navy p-6 text-white shadow-xl shadow-brand/20 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-brand-light">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Total balance</span>
          </div>
          <p className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            {formatCurrency(balance)}
          </p>
          <p className="mt-3 flex items-center gap-4 text-sm text-teal-100/80">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />
              {formatCurrency(income)} income
            </span>
            <span className="flex items-center gap-1">
              <ArrowDownRight className="h-3.5 w-3.5 text-rose-300" />
              {formatCurrency(expenses)} spent
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
          <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
            <p className="text-xs font-medium text-teal-100/70">Savings rate</p>
            <p className="text-2xl font-bold">{savingsRate}%</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
            <p className="text-xs font-medium text-teal-100/70">Health score</p>
            <p className="flex items-center gap-1.5 text-2xl font-bold">
              {healthScore}
              <Sparkles className="h-4 w-4 text-gold-light" />
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-6">
        {[
          { label: "Add expense", href: "/expenses" },
          { label: "Add income", href: "/income" },
          { label: "View forecast", href: "/predictions" },
          { label: "Budgets", href: "/budgets" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition-all hover:bg-white/20"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
