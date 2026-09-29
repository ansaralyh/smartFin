"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";

export function AnomaliesView() {
  const [scanning, setScanning] = useState(false);
  const { data, loading, error, refetch } = useApiQuery(() => api.anomalies(), []);

  async function scan() {
    setScanning(true);
    try {
      await api.ml.scanAnomalies();
      refetch();
    } finally {
      setScanning(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <div>
      <PageHeader>
        <Button size="sm" onClick={scan} disabled={scanning}>
          {scanning ? "Scanning..." : "Scan transactions"}
        </Button>
      </PageHeader>
      <div className="space-y-4">
        {(data ?? []).map((anomaly) => (
          <div key={anomaly.id} className="rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-medium text-stone-900">{anomaly.description}</p>
                <p className="mt-1 text-sm text-stone-400">
                  {anomaly.category} · {formatDate(anomaly.detectedAt)} · {anomaly.severity}
                </p>
                <p className="mt-3 text-sm text-stone-400">
                  Usual range: {formatCurrency(anomaly.expectedRange.min)} – {formatCurrency(anomaly.expectedRange.max)}
                </p>
              </div>
              <p className="text-2xl font-semibold text-stone-900">{formatCurrency(anomaly.amount)}</p>
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <p className="rounded-2xl border border-stone-200/80 bg-white p-8 text-center text-stone-400">
            No anomalies detected. Run a scan to analyze recent transactions.
          </p>
        )}
      </div>
    </div>
  );
}
