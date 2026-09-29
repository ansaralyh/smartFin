export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  currency: string;
  phone?: string;
  monthlyIncome?: number;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  monthlyIncome?: number;
  financialGoals?: string[];
  preferences?: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense" | "both";
  color?: string;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDueDate: string;
  isActive: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  status: "active" | "completed" | "paused";
}

export interface ExpensePrediction {
  id: string;
  userId: string;
  predictedAmount: number;
  category?: string;
  period: string;
  modelUsed: string;
  confidence?: number;
  createdAt: string;
}

export interface Anomaly {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  category: string;
  description: string;
  expectedRange: { min: number; max: number };
  severity: "low" | "medium" | "high";
  detectedAt: string;
}

export interface FinancialHealthScore {
  userId: string;
  score: number;
  breakdown: {
    savingsRate: number;
    budgetAdherence: number;
    expenseStability: number;
    savingsGoalProgress: number;
    incomeToExpenseRatio: number;
  };
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  type: "pattern" | "recommendation" | "warning";
  title: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  title: string;
  period: string;
  type: "monthly-summary" | "category-breakdown" | "budget-performance" | "forecast";
  data: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  userId?: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  currentBalance: number;
  monthlyExpenses: number;
  financialHealthScore: number;
  budgetStatus: { onTrack: number; exceeded: number };
  recentTransactions: Transaction[];
}
