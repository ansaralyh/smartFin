import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bell,
  LineChart,
  PiggyBank,
  Repeat,
  Shield,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "12+", label: "Finance modules", icon: Wallet },
  { value: "3", label: "Forecast models", icon: LineChart },
  { value: "100%", label: "Your data, private", icon: Shield },
];

const features = [
  {
    icon: TrendingUp,
    color: "bg-emerald-100 text-income",
    title: "Income & expenses",
    description:
      "Log every transaction with categories, dates, and notes. Filter and search your full history anytime.",
  },
  {
    icon: PiggyBank,
    color: "bg-amber-100 text-gold",
    title: "Budgets & savings",
    description:
      "Set monthly limits per category and savings goals with a clear view of how much is left.",
  },
  {
    icon: Repeat,
    color: "bg-sky-100 text-navy",
    title: "Recurring payments",
    description:
      "Track rent, salary, subscriptions, and bills that repeat — never miss a due date.",
  },
  {
    icon: BarChart3,
    color: "bg-teal-100 text-brand",
    title: "Analytics",
    description:
      "See monthly trends, category breakdowns, and income vs expense charts on one screen.",
  },
  {
    icon: LineChart,
    color: "bg-violet-100 text-violet-700",
    title: "Spending forecasts",
    description:
      "Machine learning models estimate next month's expenses from your actual spending history.",
  },
  {
    icon: Bell,
    color: "bg-rose-100 text-expense",
    title: "Alerts & insights",
    description:
      "Get notified when spending is unusual, budgets are exceeded, or patterns change.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your account",
    text: "Sign up in under a minute. Set your currency and monthly income to get started.",
  },
  {
    step: "02",
    title: "Add your transactions",
    text: "Record income and expenses as they happen. Use categories and recurring entries to stay organized.",
  },
  {
    step: "03",
    title: "Review and plan",
    text: "Check your dashboard, track budgets, and use forecasts to plan the month ahead.",
  },
];

const faqs = [
  {
    q: "Is SmartFin free to use?",
    a: "Yes. This is a student final-year project built for personal finance management. There is no payment required.",
  },
  {
    q: "How do spending forecasts work?",
    a: "The system analyses your past transactions and runs them through regression models (Linear Regression, Random Forest, XGBoost) to estimate future spending.",
  },
  {
    q: "Is my financial data secure?",
    a: "Each user can only access their own records. Authentication and data isolation are built into the system architecture.",
  },
  {
    q: "Can I try it without signing up?",
    a: "Yes. Click Open dashboard on the homepage to explore the demo with sample data.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient border-b border-brand-light/60">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-14 md:pb-28 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="section-label">Personal finance app</span>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-brand-darker md:text-5xl lg:text-[3.25rem]">
                Know where your money goes.
                <span className="text-brand"> Plan where it should.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted md:text-xl">
                SmartFin helps you track spending, stay on budget, and forecast
                next month&apos;s expenses — all from one simple dashboard.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg">
                    Create free account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Open demo dashboard
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted">
                <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-brand-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-brand-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Browser-based
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-brand-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-income" />
                  KIU FYP Project
                </span>
              </div>
            </div>
            <div className="relative lg:pl-2">
              <div className="absolute -inset-4 rounded-3xl bg-brand/10 blur-2xl" />
              <div className="relative">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-dark">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center py-12 text-center md:py-14"
            >
              <item.icon className="mb-3 h-6 w-6 text-brand-light" />
              <p className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-medium text-teal-100/70">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">Features</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-darker md:text-4xl">
              Everything you need to manage money well
            </h2>
            <p className="mt-4 text-lg text-muted">
              From daily tracking to long-term planning — one app, no clutter.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="finance-card p-8">
                <div
                  className={`inline-flex rounded-xl p-3 ${f.color}`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-brand-darker">
                  {f.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-brand-light bg-brand-subtle py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-darker md:text-4xl">
              Up and running in three steps
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-brand-light bg-white p-8 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-brand-darker">
                  {s.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="section-label">Dashboard</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-darker md:text-4xl">
                A clear view of your finances, every day
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Your overview shows income, expenses, savings, and balance at a
                glance. Charts break down spending by month and category.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Monthly expense bar chart",
                  "Category breakdown donut chart",
                  "Financial health score",
                  "Budget status and forecasts",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-base text-brand-darker"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light">
                      <span className="h-2 w-2 rounded-full bg-brand" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="mt-10 inline-block">
                <Button>
                  Explore the dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ML */}
      <section className="bg-gradient-to-br from-navy-dark via-navy to-brand-darker py-24 text-white md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-brand-light">
                Smart forecasting
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Predictions based on your real data
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-teal-100/70">
                SmartFin compares Linear Regression, Random Forest, and XGBoost
                on your transaction history and picks the best model.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: "Linear Regression", tag: "Baseline", accent: "border-brand-light" },
                { name: "Random Forest", tag: "Ensemble", accent: "border-gold/50" },
                { name: "XGBoost", tag: "Best fit", accent: "border-brand ring-2 ring-brand/40" },
              ].map((m) => (
                <div
                  key={m.name}
                  className={`rounded-2xl border bg-white/5 p-6 backdrop-blur-sm ${m.accent}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
                    {m.tag}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{m.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="section-label">FAQ</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-darker md:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-brand-light bg-brand-subtle/30 p-8"
              >
                <h3 className="text-lg font-semibold text-brand-darker">
                  {faq.q}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-brand-light bg-gradient-to-r from-brand-subtle via-white to-gold-light/30 py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-darker md:text-4xl">
            Start managing your money today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Create an account or jump straight into the demo dashboard with
            sample data.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Create account</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
