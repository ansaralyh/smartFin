"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export function NotificationsView() {
  const { data, loading, error, refetch } = useApiQuery(() => api.notifications.list(), []);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <div>
      <PageHeader>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await api.notifications.markAllRead();
            refetch();
          }}
        >
          Mark all read
        </Button>
      </PageHeader>
      <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
        {(data ?? []).map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={async () => {
              if (!n.read) {
                await api.notifications.markRead(n.id);
                refetch();
              }
            }}
            className={`w-full px-6 py-5 text-left md:px-8 md:py-6 ${n.read ? "opacity-60" : "bg-brand-soft/30"}`}
          >
            <p className="text-base font-medium text-stone-900">{n.title}</p>
            <p className="mt-1 text-base text-stone-500">{n.message}</p>
            <p className="mt-2 text-sm text-stone-400">{formatDate(n.createdAt)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
