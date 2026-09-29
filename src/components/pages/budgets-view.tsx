"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FormActions, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { useCategories } from "@/hooks/use-categories";
import { ApiError, api } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";

export function BudgetsView() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { names } = useCategories();
  const [form, setForm] = useState({ category: names[0] ?? "Food", limit: "" });
  const { data, loading: fetching, error: fetchError, refetch } = useApiQuery(
    () => api.budgets.list(),
    [],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.budgets.create({ category: form.category, limit: Number(form.limit) });
      setOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create budget");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <PageLoading />;
  if (fetchError) return <PageError message={fetchError} />;

  return (
    <div>
      <PageHeader actionLabel="New budget" onAction={() => setOpen(true)} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((budget) => {
          const percentage = Math.round((budget.spent / budget.limit) * 100);
          const exceeded = budget.spent > budget.limit;
          return (
            <div key={budget.id} className="portal-card portal-card-hover p-6 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-brand-darker">{budget.category}</h3>
                  <p className="mt-0.5 text-sm text-muted">Monthly limit</p>
                </div>
                <div className="flex items-center gap-2">
                  {exceeded ? (
                    <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-expense">
                      <AlertTriangle className="h-3 w-3" />
                      Over
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-income">
                      <CheckCircle2 className="h-3 w-3" />
                      On track
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await api.budgets.delete(budget.id);
                      refetch();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-brand-darker">
                {formatCurrency(budget.spent)}
              </p>
              <p className="mt-1 text-sm text-muted">of {formatCurrency(budget.limit)} budget</p>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-brand-light/50">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    exceeded ? "bg-gradient-to-r from-expense to-rose-400" : "bg-gradient-to-r from-brand to-income",
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} title="New budget" onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex h-12 w-full rounded-xl border border-brand-light px-4"
            >
              {names.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Monthly limit"
            type="number"
            min="1"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            required
          />
          {error && <p className="text-sm text-expense">{error}</p>}
          <FormActions onCancel={() => setOpen(false)} loading={loading} />
        </form>
      </Modal>
    </div>
  );
}
