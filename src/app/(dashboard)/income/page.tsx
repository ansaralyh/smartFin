import { TransactionsView } from "@/components/pages/transactions-view";

export const metadata = { title: "Income" };

export default function IncomePage() {
  return (
    <TransactionsView
      type="income"
      actionLabel="Add income"
      emptyMessage="No income recorded yet."
    />
  );
}
