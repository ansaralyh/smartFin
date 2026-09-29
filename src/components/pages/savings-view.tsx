"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FormActions, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { ApiError, api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export function SavingsView() {
  const [open, setOpen] = useState(false);
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [form, setForm] = useState({ name: "", targetAmount: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, loading: fetching, error: fetchError, refetch } = useApiQuery(
    () => api.savings.list(),
    [],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.savings.create({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline || undefined,
      });
      setOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create goal");
    } finally {
      setLoading(false);
    }
  }

  async function handleContribute(e: React.FormEvent) {
    e.preventDefault();
    if (!contributeId) return;
    setLoading(true);
    try {
      await api.savings.contribute(contributeId, Number(amount));
      setContributeId(null);
      setAmount("");
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Contribution failed");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <PageLoading />;
  if (fetchError) return <PageError message={fetchError} />;

  return (
    <div>
      <PageHeader actionLabel="New goal" onAction={() => setOpen(true)} />
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((goal) => {
          const progress = Math.round((goal.savedAmount / goal.targetAmount) * 100);
          return (
            <div key={goal.id} className="rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium text-stone-900">{goal.name}</h3>
                <Button variant="outline" size="sm" onClick={() => setContributeId(goal.id)}>
                  Add funds
                </Button>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
                {formatCurrency(goal.savedAmount)}
                <span className="text-lg font-normal text-stone-400">
                  {" "}/ {formatCurrency(goal.targetAmount)}
                </span>
              </p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-stone-900" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-stone-400">{progress}% complete · {goal.status}</p>
            </div>
          );
        })}
      </div>

      <Modal open={open} title="New savings goal" onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Target amount" type="number" min="1" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          {error && <p className="text-sm text-expense">{error}</p>}
          <FormActions onCancel={() => setOpen(false)} loading={loading} />
        </form>
      </Modal>

      <Modal open={!!contributeId} title="Add funds" onClose={() => setContributeId(null)}>
        <form onSubmit={handleContribute} className="space-y-4">
          <Input label="Amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <FormActions onCancel={() => setContributeId(null)} submitLabel="Contribute" loading={loading} />
        </form>
      </Modal>
    </div>
  );
}
