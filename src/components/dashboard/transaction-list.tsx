import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";
import Link from "next/link";

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
}

export function TransactionList({
  transactions,
  title = "Recent transactions",
}: TransactionListProps) {
  return (
    <div className="portal-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <Link href="/expenses" className="text-xs font-medium text-brand hover:underline">
          View all
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-slate-50/80 text-left text-xs text-text-secondary">
            <th className="px-5 py-2.5 font-medium">Description</th>
            <th className="hidden px-5 py-2.5 font-medium sm:table-cell">Category</th>
            <th className="hidden px-5 py-2.5 font-medium md:table-cell">Date</th>
            <th className="px-5 py-2.5 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-slate-50/50">
              <td className="px-5 py-3.5 font-medium text-text">{tx.description}</td>
              <td className="hidden px-5 py-3.5 text-text-secondary sm:table-cell">{tx.category}</td>
              <td className="hidden px-5 py-3.5 text-text-secondary md:table-cell">
                {formatDate(tx.date)}
              </td>
              <td
                className={`px-5 py-3.5 text-right font-semibold ${
                  tx.type === "income" ? "text-success" : "text-text"
                }`}
              >
                {tx.type === "income" ? "+" : "−"}
                {formatCurrency(tx.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
