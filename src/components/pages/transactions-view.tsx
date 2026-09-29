"use client";

import { TransactionForm } from "@/components/forms/transaction-form";
import { DataTable, formatCurrency, formatDate } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/ui/modal";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface TransactionsViewProps {
  type: "income" | "expense";
  actionLabel: string;
  emptyMessage?: string;
}

export function TransactionsView({ type, actionLabel, emptyMessage }: TransactionsViewProps) {
  const [open, setOpen] = useState(false);
  const { data, loading, error, refetch } = useApiQuery(() => api.transactions.list(type), [type]);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const isIncome = type === "income";

  return (
    <div>
      <PageHeader actionLabel={actionLabel} onAction={() => setOpen(true)} />
      <DataTable
        data={data ?? []}
        columns={[
          { key: "description", label: "Description" },
          { key: "category", label: "Category" },
          {
            key: "amount",
            label: "Amount",
            render: (item) => (
              <span className={`font-bold ${isIncome ? "text-income" : "text-expense"}`}>
                {isIncome ? "+" : "−"}
                {formatCurrency(item.amount)}
              </span>
            ),
          },
          {
            key: "date",
            label: "Date",
            render: (item) => formatDate(item.date),
          },
          {
            key: "id",
            label: "",
            render: (item) => (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await api.transactions.delete(item.id);
                  refetch();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
        emptyMessage={emptyMessage}
      />

      <Modal open={open} title={actionLabel} onClose={() => setOpen(false)}>
        <TransactionForm
          type={type}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}
