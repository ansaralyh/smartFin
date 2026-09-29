export const PAGE_TITLES: Record<string, { title: string; description?: string }> = {
  "/dashboard": {
    title: "Overview",
    description: "Your financial snapshot for September 2026",
  },
  "/income": { title: "Income", description: "Track and manage income sources" },
  "/expenses": { title: "Expenses", description: "Monitor all spending activity" },
  "/categories": { title: "Categories", description: "Organize transaction types" },
  "/recurring": { title: "Recurring", description: "Scheduled payments and income" },
  "/budgets": { title: "Budgets", description: "Spending limits by category" },
  "/savings": { title: "Savings", description: "Goals and progress tracking" },
  "/analytics": { title: "Analytics", description: "Trends and deep insights" },
  "/predictions": { title: "Forecasts", description: "ML-powered expense predictions" },
  "/anomalies": { title: "Alerts", description: "Unusual spending detection" },
  "/insights": { title: "Recommendations", description: "Personalized financial advice" },
  "/assistant": { title: "Assistant", description: "Ask about your finances" },
  "/notifications": { title: "Notifications", description: "Alerts and updates" },
  "/reports": { title: "Reports", description: "Downloadable summaries" },
  "/profile": { title: "Profile", description: "Account settings" },
  "/admin": { title: "Admin", description: "System administration" },
};

export function getPageMeta(pathname: string) {
  return (
    PAGE_TITLES[pathname] ?? {
      title: "Dashboard",
      description: "SmartFin portal",
    }
  );
}
