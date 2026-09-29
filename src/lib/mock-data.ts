import type {
  Anomaly,
  Budget,
  DashboardSummary,
  ExpensePrediction,
  AIInsight,
  Notification,
  SavingsGoal,
  Transaction,
} from "@/types";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "user1",
    type: "expense",
    amount: 3500,
    category: "Food",
    description: "Grocery shopping",
    date: "2026-09-28",
    createdAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    type: "expense",
    amount: 8000,
    category: "Shopping",
    description: "Electronics purchase",
    date: "2026-09-27",
    createdAt: "2026-09-27T14:30:00Z",
  },
  {
    id: "3",
    userId: "user1",
    type: "income",
    amount: 100000,
    category: "Salary",
    description: "Monthly salary",
    date: "2026-09-01",
    createdAt: "2026-09-01T09:00:00Z",
  },
  {
    id: "4",
    userId: "user1",
    type: "expense",
    amount: 25000,
    category: "Rent",
    description: "September rent",
    date: "2026-09-05",
    createdAt: "2026-09-05T11:00:00Z",
  },
  {
    id: "5",
    userId: "user1",
    type: "expense",
    amount: 1200,
    category: "Transport",
    description: "Fuel",
    date: "2026-09-26",
    createdAt: "2026-09-26T08:00:00Z",
  },
];

export const mockDashboardSummary: DashboardSummary = {
  totalIncome: 100000,
  totalExpenses: 70000,
  totalSavings: 30000,
  currentBalance: 30000,
  monthlyExpenses: 70000,
  financialHealthScore: 72,
  budgetStatus: { onTrack: 5, exceeded: 2 },
  recentTransactions: mockTransactions.slice(0, 5),
};

export const mockMonthlyExpenses = [
  { month: "Apr", amount: 64000 },
  { month: "May", amount: 67000 },
  { month: "Jun", amount: 65000 },
  { month: "Jul", amount: 68000 },
  { month: "Aug", amount: 69000 },
  { month: "Sep", amount: 70000 },
];

export const mockCategoryExpenses = [
  { category: "Food", amount: 15000 },
  { category: "Rent", amount: 25000 },
  { category: "Transport", amount: 8000 },
  { category: "Shopping", amount: 12000 },
  { category: "Bills", amount: 6000 },
  { category: "Other", amount: 4000 },
];

export const mockBudgets: Budget[] = [
  {
    id: "b1",
    userId: "user1",
    category: "Food",
    limit: 12000,
    spent: 15000,
    period: "monthly",
    startDate: "2026-09-01",
  },
  {
    id: "b2",
    userId: "user1",
    category: "Transport",
    limit: 10000,
    spent: 8000,
    period: "monthly",
    startDate: "2026-09-01",
  },
  {
    id: "b3",
    userId: "user1",
    category: "Shopping",
    limit: 8000,
    spent: 12000,
    period: "monthly",
    startDate: "2026-09-01",
  },
];

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: "s1",
    userId: "user1",
    name: "New Laptop",
    targetAmount: 150000,
    savedAmount: 80000,
    deadline: "2026-12-31",
    status: "active",
  },
  {
    id: "s2",
    userId: "user1",
    name: "Emergency Fund",
    targetAmount: 200000,
    savedAmount: 120000,
    status: "active",
  },
];

export const mockPredictions: ExpensePrediction[] = [
  {
    id: "p1",
    userId: "user1",
    predictedAmount: 74000,
    period: "October 2026",
    modelUsed: "XGBoost",
    confidence: 0.87,
    createdAt: "2026-09-29T00:00:00Z",
  },
  {
    id: "p2",
    userId: "user1",
    predictedAmount: 16000,
    category: "Food",
    period: "October 2026",
    modelUsed: "Random Forest",
    confidence: 0.82,
    createdAt: "2026-09-29T00:00:00Z",
  },
];

export const mockAnomalies: Anomaly[] = [
  {
    id: "a1",
    userId: "user1",
    transactionId: "2",
    amount: 8000,
    category: "Shopping",
    description: "Electronics purchase",
    expectedRange: { min: 1000, max: 3000 },
    severity: "high",
    detectedAt: "2026-09-27T14:35:00Z",
  },
];

export const mockInsights: AIInsight[] = [
  {
    id: "i1",
    userId: "user1",
    type: "pattern",
    title: "Food expenses increased",
    message:
      "Your food expenses increased by 12% compared with the previous month.",
    createdAt: "2026-09-29T00:00:00Z",
  },
  {
    id: "i2",
    userId: "user1",
    type: "recommendation",
    title: "Reduce discretionary spending",
    message:
      "Your projected expenses are higher than your current average. Consider reducing shopping expenses.",
    createdAt: "2026-09-29T00:00:00Z",
  },
  {
    id: "i3",
    userId: "user1",
    type: "warning",
    title: "Budget exceeded",
    message: "You have exceeded your Food and Shopping budgets this month.",
    createdAt: "2026-09-28T00:00:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "user1",
    title: "Budget Alert",
    message: "Food budget exceeded by Rs. 3,000",
    type: "warning",
    read: false,
    createdAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "n2",
    userId: "user1",
    title: "Prediction Ready",
    message: "Your October expense prediction is available",
    type: "info",
    read: false,
    createdAt: "2026-09-29T08:00:00Z",
  },
  {
    id: "n3",
    userId: "user1",
    title: "Unusual Spending",
    message: "An unusual shopping transaction was detected",
    type: "alert",
    read: true,
    createdAt: "2026-09-27T15:00:00Z",
  },
];
