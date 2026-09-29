"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { useAuth } from "@/components/providers/auth-provider";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export function AdminView() {
  const { user } = useAuth();
  const statsQuery = useApiQuery(() => api.admin.stats(), []);
  const logQuery = useApiQuery(() => api.admin.activityLog(), []);

  if (user?.role !== "admin") {
    return <PageError message="You do not have permission to access the admin panel." />;
  }

  if (statsQuery.loading || logQuery.loading) return <PageLoading />;
  if (statsQuery.error) return <PageError message={statsQuery.error} />;

  const stats = statsQuery.data!;

  return (
    <div>
      <PageHeader />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Users" value={stats.users} format="number" />
        <StatCard title="Active sessions" value={stats.activeSessions} format="number" />
        <StatCard title="Transactions" value={stats.transactions} format="number" />
        <StatCard title="Uptime" value={stats.uptime} format="percent" />
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
        <div className="border-b border-stone-100 px-6 py-4 md:px-8">
          <h2 className="text-lg font-medium text-stone-900">Activity log</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {(logQuery.data ?? []).map((log) => (
            <p key={log.id} className="px-6 py-4 text-base text-stone-600 md:px-8">
              {log.details} · {formatDate(log.createdAt)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
