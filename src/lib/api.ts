import type { User } from "@/types";

const API_BASE = "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.error || res.statusText || "Request failed");
  }

  return data as T;
}

export const api = {
  health: () => fetchAPI<{ status: string; database: string }>("/health"),

  auth: {
    me: () => fetchAPI<{ user: User }>("/auth/me"),
    login: (email: string, password: string) =>
      fetchAPI<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { name: string; email: string; password: string }) =>
      fetchAPI<{ user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => fetchAPI<{ success: boolean }>("/auth/logout", { method: "POST" }),
  },

  profile: {
    get: () => fetchAPI<{ user: User }>("/profile"),
    update: (data: Partial<User>) =>
      fetchAPI<{ user: User }>("/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  user: {
    resetData: () =>
      fetchAPI<{ success: boolean; message: string }>("/user/reset-data", {
        method: "POST",
        body: JSON.stringify({ confirm: "RESET" }),
      }),
  },

  dashboard: () => fetchAPI<{
    summary: import("@/types").DashboardSummary;
    monthlyExpenses: { month: string; amount: number }[];
    categoryExpenses: { category: string; amount: number }[];
    insights: import("@/types").AIInsight[];
    budgets: import("@/types").Budget[];
  }>("/dashboard"),

  transactions: {
    list: (type?: "income" | "expense") =>
      fetchAPI<import("@/types").Transaction[]>(
        `/transactions${type ? `?type=${type}` : ""}`,
      ),
    create: (data: {
      type: "income" | "expense";
      amount: number;
      category: string;
      description: string;
      date?: string;
    }) =>
      fetchAPI<import("@/types").Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchAPI<import("@/types").Transaction>(`/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{ success: boolean }>(`/transactions/${id}`, { method: "DELETE" }),
  },

  budgets: {
    list: () => fetchAPI<import("@/types").Budget[]>("/budgets"),
    create: (data: { category: string; limit: number; period?: string }) =>
      fetchAPI<import("@/types").Budget>("/budgets", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchAPI<import("@/types").Budget>(`/budgets/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{ success: boolean }>(`/budgets/${id}`, { method: "DELETE" }),
  },

  savings: {
    list: () => fetchAPI<import("@/types").SavingsGoal[]>("/savings-goals"),
    create: (data: { name: string; targetAmount: number; deadline?: string }) =>
      fetchAPI<import("@/types").SavingsGoal>("/savings-goals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchAPI<import("@/types").SavingsGoal>(`/savings-goals/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    contribute: (id: string, amount: number) =>
      fetchAPI<import("@/types").SavingsGoal>(`/savings-goals/${id}/contribute`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    delete: (id: string) =>
      fetchAPI<{ success: boolean }>(`/savings-goals/${id}`, { method: "DELETE" }),
  },

  categories: {
    list: () => fetchAPI<import("@/types").Category[]>("/categories"),
    create: (data: { name: string; type?: string }) =>
      fetchAPI<import("@/types").Category>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }),
  },

  recurring: {
    list: () => fetchAPI<import("@/types").RecurringTransaction[]>("/recurring"),
    create: (data: Record<string, unknown>) =>
      fetchAPI<import("@/types").RecurringTransaction>("/recurring", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchAPI<import("@/types").RecurringTransaction>(`/recurring/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{ success: boolean }>(`/recurring/${id}`, { method: "DELETE" }),
  },

  predictions: () => fetchAPI<import("@/types").ExpensePrediction[]>("/predictions"),
  anomalies: () => fetchAPI<import("@/types").Anomaly[]>("/anomalies"),
  insights: () => fetchAPI<import("@/types").AIInsight[]>("/insights"),

  notifications: {
    list: () => fetchAPI<import("@/types").Notification[]>("/notifications"),
    markRead: (id: string) =>
      fetchAPI<import("@/types").Notification>(`/notifications/${id}`, { method: "PATCH" }),
    markAllRead: () =>
      fetchAPI<{ success: boolean }>("/notifications/mark-all-read", { method: "PATCH" }),
    delete: (id: string) =>
      fetchAPI<{ success: boolean }>(`/notifications/${id}`, { method: "DELETE" }),
  },

  reports: {
    list: () => fetchAPI<import("@/types").Report[]>("/reports"),
    generate: (type: import("@/types").Report["type"]) =>
      fetchAPI<import("@/types").Report>("/reports", {
        method: "POST",
        body: JSON.stringify({ type }),
      }),
    downloadUrl: (id: string) => `/api/reports/${id}/download`,
  },

  admin: {
    stats: () =>
      fetchAPI<{ users: number; activeSessions: number; transactions: number; uptime: number }>(
        "/admin/stats",
      ),
    activityLog: () => fetchAPI<import("@/types").ActivityLogEntry[]>("/admin/activity-log"),
  },

  assistant: {
    chat: (message: string) =>
      fetchAPI<{ reply: string }>("/assistant", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
  },

  ml: {
    predict: () =>
      fetchAPI<{
        predictions: import("@/types").ExpensePrediction[];
        models: Array<Record<string, unknown>>;
      }>("/ml/predict"),
    regeneratePredictions: () =>
      fetchAPI<{ predictions: import("@/types").ExpensePrediction[] }>("/ml/predict", {
        method: "POST",
      }),
    anomalies: () =>
      fetchAPI<{ anomalies: import("@/types").Anomaly[] }>("/ml/anomalies"),
    scanAnomalies: () =>
      fetchAPI<{ anomalies: import("@/types").Anomaly[]; count: number }>("/ml/anomalies", {
        method: "POST",
      }),
    healthScore: () =>
      fetchAPI<{
        score: number;
        breakdown: import("@/types").FinancialHealthScore["breakdown"];
      }>("/ml/health-score"),
    generateInsights: () =>
      fetchAPI<{ insights: import("@/types").AIInsight[]; count: number }>(
        "/insights/generate",
        { method: "POST" },
      ),
  },
};
