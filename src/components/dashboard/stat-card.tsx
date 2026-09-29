import { cn, formatCurrency } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp, Wallet, PiggyBank } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: { value: number; positive: boolean };
  format?: "currency" | "number" | "percent";
  icon?: LucideIcon;
  className?: string;
}

const icons = { income: TrendingUp, expense: TrendingDown, savings: PiggyBank, balance: Wallet };

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  format = "currency",
  icon: Icon = Wallet,
  className,
}: StatCardProps) {
  const formatted =
    format === "currency"
      ? formatCurrency(value)
      : format === "percent"
        ? `${value}%`
        : value.toLocaleString();

  return (
    <div className={cn("portal-card p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{title}</p>
        <div className="rounded-md bg-slate-50 p-2 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-text">{formatted}</p>
      {subtitle && <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>}
      {trend && (
        <p className={cn("mt-2 text-xs font-medium", trend.positive ? "text-success" : "text-danger")}>
          {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% vs last month
        </p>
      )}
    </div>
  );
}

export { icons as StatIcons };
