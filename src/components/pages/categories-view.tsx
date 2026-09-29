"use client";

import { PageHeader } from "@/components/layout/page-header";
import { FormActions, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { ApiError, api } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function CategoriesView() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, loading: fetching, error: fetchError, refetch } = useApiQuery(
    () => api.categories.list(),
    [],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.categories.create({ name });
      setName("");
      setOpen(false);
      refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add category");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <PageLoading />;
  if (fetchError) return <PageError message={fetchError} />;

  return (
    <div>
      <PageHeader actionLabel="Add category" onAction={() => setOpen(true)} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white px-6 py-5"
          >
            <div>
              <p className="text-base font-medium text-stone-900">{category.name}</p>
              <p className="text-sm text-stone-400 capitalize">{category.type}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await api.categories.delete(category.id);
                refetch();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Modal open={open} title="Add category" onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
          {error && <p className="text-sm text-expense">{error}</p>}
          <FormActions onCancel={() => setOpen(false)} loading={loading} />
        </form>
      </Modal>
    </div>
  );
}
