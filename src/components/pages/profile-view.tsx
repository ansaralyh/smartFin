"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError, api } from "@/lib/api";
import { useEffect, useState } from "react";

export function ProfileView() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currency: "PKR",
    monthlyIncome: "",
  });

  useEffect(() => {
    api.profile
      .get()
      .then(({ user }) => {
        setForm({
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          currency: user.currency,
          monthlyIncome: String(user.monthlyIncome ?? ""),
        });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.profile.update({
        name: form.name,
        phone: form.phone,
        currency: form.currency,
        monthlyIncome: Number(form.monthlyIncome) || 0,
      });
      await refreshUser();
      setSuccess("Profile updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetData() {
    if (!window.confirm("Delete ALL transactions, budgets, savings, and other financial data? This cannot be undone.")) {
      return;
    }
    setResetting(true);
    setError(null);
    setSuccess(null);
    try {
      await api.user.resetData();
      setSuccess("All demo/financial data cleared. Refresh the dashboard to see your empty account.");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reset data");
    } finally {
      setResetting(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error && !form.name) return <PageError message={error} />;

  return (
    <div>
      <PageHeader />
      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8">
          <h2 className="text-lg font-medium text-stone-900">Personal</h2>
          <div className="mt-6 space-y-5">
            <Input
              id="name"
              label="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input id="email" label="Email" type="email" value={form.email} disabled />
            <Input
              id="phone"
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8">
          <h2 className="text-lg font-medium text-stone-900">Preferences</h2>
          <div className="mt-6 space-y-5">
            <Input
              id="currency"
              label="Currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
            <Input
              id="monthlyIncome"
              label="Monthly income"
              type="number"
              value={form.monthlyIncome}
              onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          {error && <p className="mb-3 text-sm text-expense">{error}</p>}
          {success && <p className="mb-3 text-sm text-success">{success}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 md:p-8">
        <h2 className="text-lg font-medium text-red-900">Clear financial data</h2>
        <p className="mt-2 text-sm text-red-800/80">
          Remove all transactions, budgets, savings goals, and demo data from your account.
          Use this if you still see sample entries like &quot;Grocery shopping&quot; or &quot;Monthly salary&quot;.
        </p>
        <Button
          type="button"
          variant="danger"
          className="mt-4"
          disabled={resetting}
          onClick={handleResetData}
        >
          {resetting ? "Clearing..." : "Clear all financial data"}
        </Button>
      </div>
    </div>
  );
}
