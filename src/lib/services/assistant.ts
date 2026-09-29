import {
  getBudgets,
  getDashboard,
  getPredictions,
  getSavingsGoals,
  getTransactions,
} from "@/lib/services/finance";

function fmt(amount: number) {
  return `PKR ${amount.toLocaleString()}`;
}

function monthName() {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

export async function buildAssistantContext(userId: string) {
  const [dashboard, budgets, savings, predictions, transactions] = await Promise.all([
    getDashboard(userId),
    getBudgets(userId),
    getSavingsGoals(userId),
    getPredictions(userId),
    getTransactions(userId),
  ]);

  return { dashboard, budgets, savings, predictions, transactions };
}

export async function answerLocally(userId: string, message: string): Promise<string> {
  const q = message.toLowerCase().trim();
  const { dashboard, budgets, savings, predictions, transactions } =
    await buildAssistantContext(userId);

  const { summary, categoryExpenses } = dashboard;
  const month = monthName();

  if (/^(hi|hello|hey|salam|aoa)\b/.test(q)) {
    return `Hello! I'm SmartFin AI. Ask me about your spending, income, budgets, or savings for ${month}.`;
  }

  if (q.includes("spend") || q.includes("expense")) {
    if (summary.totalExpenses === 0 && transactions.filter((t) => t.type === "expense").length === 0) {
      return `You have no expenses recorded yet for ${month}. Add expenses from the Expenses tab to track spending.`;
    }
    const top = [...categoryExpenses].sort((a, b) => b.amount - a.amount)[0];
    let reply = `Your total expenses for ${month} are ${fmt(summary.totalExpenses)}.`;
    if (top) {
      reply += ` Your highest category is ${top.category} at ${fmt(top.amount)}.`;
    }
    return reply;
  }

  if (q.includes("income") || q.includes("earn")) {
    if (summary.totalIncome === 0) {
      return `No income recorded for ${month} yet. Add income from the Income tab.`;
    }
    return `Your total income for ${month} is ${fmt(summary.totalIncome)}.`;
  }

  if (q.includes("balance") || q.includes("saved") || q.includes("saving")) {
    if (q.includes("goal")) {
      if (savings.length === 0) {
        return "You have no savings goals yet. Create one from the Savings tab.";
      }
      return savings
        .map(
          (g) =>
            `${g.name}: ${fmt(g.savedAmount)} of ${fmt(g.targetAmount)} (${Math.round((g.savedAmount / g.targetAmount) * 100)}%)`,
        )
        .join("\n");
    }
    return `Your available balance this month is ${fmt(summary.currentBalance)} (income ${fmt(summary.totalIncome)} minus expenses ${fmt(summary.totalExpenses)}).`;
  }

  if (q.includes("highest") || q.includes("top category") || q.includes("most spent")) {
    if (categoryExpenses.length === 0) {
      return "No expense categories to show yet. Add some expenses first.";
    }
    const top = [...categoryExpenses].sort((a, b) => b.amount - a.amount)[0];
    return `Your highest expense category is ${top.category} at ${fmt(top.amount)} this month.`;
  }

  if (q.includes("predict") || q.includes("forecast")) {
    if (predictions.length === 0) {
      return "No forecasts yet. Go to Forecasts and click \"Refresh forecasts\" to generate predictions from your data.";
    }
    const overall = predictions.find((p) => !p.category) ?? predictions[0];
    return `Your predicted expenses for ${overall.period} are ${fmt(overall.predictedAmount)} (${overall.modelUsed}, ${Math.round((overall.confidence ?? 0) * 100)}% confidence).`;
  }

  if (q.includes("budget")) {
    if (budgets.length === 0) {
      return "No budgets set up. Create budgets from the Budgets tab.";
    }
    const exceeded = budgets.filter((b) => b.spent > b.limit);
    const lines = budgets.map(
      (b) =>
        `${b.category}: ${fmt(b.spent)} / ${fmt(b.limit)} (${b.spent > b.limit ? "over" : "on track"})`,
    );
    let reply = lines.join("\n");
    if (exceeded.length > 0) {
      reply += `\n\nWarning: ${exceeded.map((b) => b.category).join(", ")} exceeded budget.`;
    }
    return reply;
  }

  if (q.includes("health") || q.includes("score")) {
    return `Your financial health score is ${summary.financialHealthScore}/100. Budgets on track: ${summary.budgetStatus.onTrack}, exceeded: ${summary.budgetStatus.exceeded}.`;
  }

  if (q.includes("transaction") || q.includes("recent")) {
    if (transactions.length === 0) {
      return "No transactions yet. Add income or expenses to get started.";
    }
    return transactions
      .slice(0, 5)
      .map(
        (t) =>
          `${t.date} · ${t.description} · ${t.type === "income" ? "+" : "-"}${fmt(t.amount)} (${t.category})`,
      )
      .join("\n");
  }

  if (q.includes("help") || q.includes("what can you")) {
    return [
      "I can answer questions about:",
      "• Monthly spending and income",
      "• Top expense categories",
      "• Budgets and savings goals",
      "• Expense forecasts",
      "• Financial health score",
      "",
      "Try: \"How much did I spend this month?\"",
    ].join("\n");
  }

  return [
    `Here's your ${month} snapshot:`,
    `• Income: ${fmt(summary.totalIncome)}`,
    `• Expenses: ${fmt(summary.totalExpenses)}`,
    `• Balance: ${fmt(summary.currentBalance)}`,
    `• Health score: ${summary.financialHealthScore}/100`,
    "",
    "Ask about spending, budgets, savings, or forecasts for more detail.",
  ].join("\n");
}
