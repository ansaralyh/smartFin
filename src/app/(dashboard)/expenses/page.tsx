import { TransactionsView } from "@/components/pages/transactions-view";

export const metadata = { title: "Expenses" };

export default function ExpensesPage() {
  return <TransactionsView type="expense" actionLabel="Add expense" />;
}
