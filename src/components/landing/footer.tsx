import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Forecasts", href: "/predictions" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Profile", href: "/profile" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "KIU FYP", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-light bg-navy-dark text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold">
                S
              </span>
              <p className="text-lg font-bold">{APP_NAME}</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-teal-100/70">
              Personal finance management with expense tracking, budgets, and
              spending forecasts.
            </p>
            <p className="mt-6 text-xs text-teal-200/50">
              Ansar Ali · 2022-KIU-BS2272
              <br />
              Karakoram International University
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-brand-light">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-teal-100/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-teal-200/50 sm:flex-row sm:items-center">
          <p>© 2026 {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-teal-100">
              Privacy
            </Link>
            <Link href="#" className="hover:text-teal-100">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
