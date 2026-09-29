"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Download } from "lucide-react";
import { useState } from "react";

const REPORT_TYPES = [
  { type: "monthly-summary" as const, label: "Monthly summary" },
  { type: "category-breakdown" as const, label: "Category breakdown" },
  { type: "budget-performance" as const, label: "Budget performance" },
  { type: "forecast" as const, label: "Forecast report" },
];

export function ReportsView() {
  const [generating, setGenerating] = useState(false);
  const { data, loading, error, refetch } = useApiQuery(() => api.reports.list(), []);

  async function generate(type: (typeof REPORT_TYPES)[number]["type"]) {
    setGenerating(true);
    try {
      await api.reports.generate(type);
      refetch();
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <div>
      <PageHeader>
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((item) => (
            <Button key={item.type} size="sm" disabled={generating} onClick={() => generate(item.type)}>
              {item.label}
            </Button>
          ))}
        </div>
      </PageHeader>

      <div className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
        {(data ?? []).map((report) => (
          <div
            key={report.id}
            className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6"
          >
            <div>
              <p className="text-base font-medium text-stone-900">{report.title}</p>
              <p className="mt-1 text-sm text-stone-400">
                {report.period} · Generated {formatDate(report.createdAt)}
              </p>
            </div>
            <a href={api.reports.downloadUrl(report.id)} download>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-stone-400">
            No reports yet. Generate one using the buttons above.
          </p>
        )}
      </div>
    </div>
  );
}
