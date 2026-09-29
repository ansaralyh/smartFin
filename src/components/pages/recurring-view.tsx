"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FormActions, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { useCategories } from "@/hooks/use-categories";
import { ApiError, api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function RecurringView() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { names } = useCategories();
  const [form, setForm] = useState({
    description: "",
    category: names[0] ?? "Other",
    amount: "",
    type: "expense" as "income" | "expense",
    frequency: "monthly",
    nextDueDate: new Date().toISOString().split("T")[0],
  });
  const { data, loading: fetching, error: fetchError, refetch } = useApiQuery(
    () => api.recurring.list(),
    [],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.recurring.create({ ...form, amount: Number(form.amount) });
      setOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create recurring item");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <PageLoading />;
  if (fetchError) return <PageError message={fetchError} />;

  return (
    <div>
      <PageHeader actionLabel="Add recurring" onAction={() => setOpen(true)} />
      <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
        {(data ?? []).map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6"
          >
            <div>
              <p className="text-base font-medium text-stone-900">{item.description}</p>
              <p className="mt-1 text-sm text-stone-400">
                {item.category} · {item.frequency} · Next {formatDate(item.nextDueDate)}
                {!item.isActive && " · Paused"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-medium text-stone-900">
                {item.type === "income" ? "+" : "−"}
                {formatCurrency(item.amount)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await api.recurring.delete(item.id);
                  refetch();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title="Add recurring transaction" onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })} className="h-12 w-full rounded-xl border px-4">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="h-12 w-full rounded-xl border px-4">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-12 w-full rounded-xl border px-4">
              {names.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          <Input label="Amount" type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <Input label="Next due date" type="date" value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} required />
          {error && <p className="text-sm text-expense">{error}</p>}
          <FormActions onCancel={() => setOpen(false)} loading={loading} />
        </form>
      </Modal>
    </div>
  );
}
