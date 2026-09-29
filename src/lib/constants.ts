import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Tags,
  Repeat,
  PiggyBank,
  BarChart3,
  LineChart,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Bell,
  FileText,
  User,
  Shield,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "SmartFin";
export const APP_DESCRIPTION =
  "Personal finance management with expense tracking and forecasts";

export const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Rent",
  "Bills",
  "Education",
  "Healthcare",
  "Entertainment",
  "Travel",
  "Other",
] as const;

export type CategoryName = (typeof DEFAULT_CATEGORIES)[number];

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Income", href: "/income", icon: TrendingUp },
  { label: "Expenses", href: "/expenses", icon: TrendingDown },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "Recurring", href: "/recurring", icon: Repeat },
  { label: "Budgets", href: "/budgets", icon: PiggyBank },
  { label: "Savings", href: "/savings", icon: PiggyBank },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const AI_NAV: NavItem[] = [
  { label: "Forecasts", href: "/predictions", icon: LineChart },
  { label: "Alerts", href: "/anomalies", icon: AlertCircle },
  { label: "Recommendations", href: "/insights", icon: Lightbulb },
  { label: "Assistant", href: "/assistant", icon: MessageSquare },
];

export const OTHER_NAV: NavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Admin", href: "/admin", icon: Shield },
];
