"use client";

import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { getPageMeta } from "@/lib/portal-meta";
import { Bell, Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const meta = getPageMeta(pathname);
  const { data: notifications } = useApiQuery(() => api.notifications.list(), []);
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-text-secondary hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-text lg:text-lg">
            {meta.title}
          </h1>
          {meta.description && (
            <p className="hidden truncate text-xs text-text-secondary sm:block">
              {meta.description}
            </p>
          )}
        </div>

        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-56 rounded-lg border border-border bg-bg pl-9 pr-3 text-sm text-text placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        <Link href="/expenses" className="hidden sm:block">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </Link>

        <Link
          href="/notifications"
          className="relative rounded-lg p-2 text-text-secondary hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-danger text-[10px] font-bold leading-4 text-white text-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
