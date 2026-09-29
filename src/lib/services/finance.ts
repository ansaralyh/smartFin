import { connectDB } from "@/lib/db";
import { serializeDoc, serializeDocs } from "@/lib/serialize";
import { AIInsight } from "@/models/AIInsight";
import { Anomaly } from "@/models/Anomaly";
import { Budget } from "@/models/Budget";
import { ExpensePrediction } from "@/models/ExpensePrediction";
import { Notification } from "@/models/Notification";
import { SavingsGoal } from "@/models/SavingsGoal";
import { Transaction } from "@/models/Transaction";
import { ensureUserSetup } from "@/lib/services/seed";
import {
  createTransactionWithSync,
  processDueRecurring,
} from "@/lib/services/finance-crud";
import { currentMonthPrefix, monthLabel, syncBudgetSpent, userObjectId } from "@/lib/services/core";
import type {
  AIInsight as AIInsightType,
  Anomaly as AnomalyType,
  Budget as BudgetType,
  DashboardSummary,
  ExpensePrediction as PredictionType,
  Notification as NotificationType,
  SavingsGoal as SavingsGoalType,
  Transaction as TransactionType,
} from "@/types";

export { createTransactionWithSync as createTransaction };

export async function getTransactions(userId: string, type?: "income" | "expense") {
  await connectDB();
  await ensureUserSetup(userId);
  await processDueRecurring(userId);
  const filter: Record<string, unknown> = { userId: userObjectId(userId) };
  if (type) filter.type = type;
  const docs = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
  return serializeDocs<TransactionType>(docs);
}

export async function getBudgets(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  await syncBudgetSpent(userId);
  const docs = await Budget.find({ userId: userObjectId(userId) }).sort({ category: 1 });
  return serializeDocs<BudgetType>(docs);
}

export async function getSavingsGoals(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  const docs = await SavingsGoal.find({ userId: userObjectId(userId) }).sort({ createdAt: -1 });
  return serializeDocs<SavingsGoalType>(docs);
}

export async function getPredictions(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  const docs = await ExpensePrediction.find({ userId: userObjectId(userId) }).sort({
    createdAt: -1,
  });
  return serializeDocs<PredictionType>(docs);
}

export async function getAnomalies(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  const docs = await Anomaly.find({ userId: userObjectId(userId) }).sort({ detectedAt: -1 });
  return serializeDocs<AnomalyType>(docs);
}

export async function getInsights(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  const docs = await AIInsight.find({ userId: userObjectId(userId) }).sort({ createdAt: -1 });
  return serializeDocs<AIInsightType>(docs);
}

export async function getNotifications(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  const docs = await Notification.find({ userId: userObjectId(userId) }).sort({ createdAt: -1 });
  return serializeDocs<NotificationType>(docs);
}

export async function getDashboard(userId: string) {
  await connectDB();
  await ensureUserSetup(userId);
  await processDueRecurring(userId);
  await syncBudgetSpent(userId);

  const oid = userObjectId(userId);
  const month = currentMonthPrefix();
  const transactions = await Transaction.find({ userId: oid }).sort({ date: -1 });
  const budgets = await Budget.find({ userId: oid });

  const all = serializeDocs<TransactionType>(transactions);
  const monthTx = all.filter((t) => t.date.startsWith(month));

  const totalIncome = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalSavings = Math.max(totalIncome - totalExpenses, 0);

  const budgetsList = serializeDocs<BudgetType>(budgets);
  const onTrack = budgetsList.filter((b) => b.spent <= b.limit).length;
  const exceeded = budgetsList.filter((b) => b.spent > b.limit).length;

  const categoryMap = new Map<string, number>();
  for (const tx of monthTx.filter((t) => t.type === "expense")) {
    categoryMap.set(tx.category, (categoryMap.get(tx.category) ?? 0) + tx.amount);
  }

  const summary: DashboardSummary = {
    totalIncome,
    totalExpenses,
    totalSavings,
    currentBalance: totalSavings,
    monthlyExpenses: totalExpenses,
    financialHealthScore: computeHealthScore(totalIncome, totalExpenses, onTrack, budgetsList.length),
    budgetStatus: { onTrack, exceeded },
    recentTransactions: all.slice(0, 5),
  };

  return {
    summary,
    monthlyExpenses: buildMonthlyExpenses(all),
    categoryExpenses: Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
    })),
    insights: await getInsights(userId),
    budgets: budgetsList,
  };
}

function buildMonthlyExpenses(transactions: TransactionType[]) {
  const map = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    const key = tx.date.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + tx.amount);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, amount]) => ({ month: monthLabel(key), amount }));
}

function computeHealthScore(income: number, expenses: number, onTrack: number, budgetCount: number) {
  const savingsRate = income > 0 ? Math.min(((income - expenses) / income) * 100, 100) : 0;
  const budgetAdherence = budgetCount > 0 ? Math.round((onTrack / budgetCount) * 100) : 70;
  const expenseStability = income > 0 ? Math.min((expenses / income) * 100, 100) : 50;
  const ratio = income > 0 ? Math.min((income / Math.max(expenses, 1)) * 50, 100) : 50;
  return Math.max(
    0,
    Math.min(Math.round(savingsRate * 0.3 + budgetAdherence * 0.25 + (100 - expenseStability) * 0.2 + ratio * 0.25), 100),
  );
}

export async function getHealthScore(userId: string) {
  const { summary } = await getDashboard(userId);
  await connectDB();
  const budgets = await getBudgets(userId);
  const onTrack = budgets.filter((b) => b.spent <= b.limit).length;
  const goals = await SavingsGoal.find({ userId: userObjectId(userId) });
  const savingsGoalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, g) => sum + g.savedAmount / Math.max(g.targetAmount, 1), 0) /
            goals.length *
            100,
        )
      : 0;

  return {
    score: summary.financialHealthScore,
    breakdown: {
      savingsRate:
        summary.totalIncome > 0
          ? Math.round(((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100)
          : 0,
      budgetAdherence: budgets.length > 0 ? Math.round((onTrack / budgets.length) * 100) : 0,
      expenseStability:
        summary.totalIncome > 0
          ? Math.round((summary.totalExpenses / summary.totalIncome) * 100)
          : 0,
      savingsGoalProgress,
      incomeToExpenseRatio:
        summary.totalExpenses > 0
          ? Math.round((summary.totalIncome / summary.totalExpenses) * 100)
          : 100,
    },
    updatedAt: new Date().toISOString(),
  };
}
