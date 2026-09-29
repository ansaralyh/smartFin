"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AI_NAV, APP_NAME, MAIN_NAV, OTHER_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-brand-soft text-brand-hover"
          : "text-text-secondary hover:bg-slate-50 hover:text-text",
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", active ? "text-brand" : "text-slate-400")} />
      {label}
    </Link>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const otherNav =
    user?.role === "admin"
      ? OTHER_NAV
      : OTHER_NAV.filter((item) => item.href !== "/admin");

  const sections = [
    { label: "Menu", items: MAIN_NAV },
    { label: "Insights", items: AI_NAV },
    { label: "Settings", items: otherNav },
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-surface lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full transition-transform duration-200",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
              S
            </div>
            <span className="text-[15px] font-semibold text-text">{APP_NAME}</span>
          </Link>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname === item.href}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
              {user ? initials(user.name) : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{user?.name ?? "Guest"}</p>
              <p className="truncate text-xs text-text-secondary">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
