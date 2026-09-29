"use client";

import { FormActions } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categories";
import { ApiError, api } from "@/lib/api";
import { useState } from "react";

interface TransactionFormProps {
  type: "income" | "expense";
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ type, onSuccess, onCancel }: TransactionFormProps) {
  const { names } = useCategories();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "",
    category: names[0] ?? "Other",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.transactions.create({
        type,
        description: form.description,
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-brand-darker">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="flex h-12 w-full rounded-xl border border-brand-light bg-white px-4 text-base"
        >
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Amount"
        type="number"
        min="1"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />
      <Input
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      {error && <p className="text-sm text-expense">{error}</p>}
      <FormActions onCancel={onCancel} submitLabel={`Add ${type}`} loading={loading} />
    </form>
  );
}
