"use client";

import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export function PredictionsView() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, error, refetch } = useApiQuery(() => api.ml.predict(), []);

  async function regenerate() {
    setRefreshing(true);
    try {
      await api.ml.regeneratePredictions();
      refetch();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const predictions = data?.predictions ?? [];
  const models = data?.models ?? [];

  return (
    <div>
      <PageHeader>
        <Button size="sm" onClick={regenerate} disabled={refreshing}>
          {refreshing ? "Regenerating..." : "Refresh forecasts"}
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8">
            <p className="text-sm text-stone-400">
              {prediction.category ?? "Overall"} · {prediction.period}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
              {formatCurrency(prediction.predictedAmount)}
            </p>
            <p className="mt-2 text-sm text-stone-400">{prediction.modelUsed} model</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
        <div className="border-b border-stone-100 px-6 py-4 md:px-8">
          <h2 className="text-lg font-medium text-stone-900">Model comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-stone-100">
                {["Model", "MAE", "RMSE", "MAPE", "R²"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-medium text-stone-400 md:px-8">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={String(model.name)} className="border-b border-stone-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-stone-900 md:px-8">
                    {String(model.name)}
                    {model.best ? <span className="ml-2 text-sm font-normal text-stone-400">selected</span> : null}
                  </td>
                  <td className="px-6 py-4 text-stone-600 md:px-8">{formatCurrency(Number(model.mae))}</td>
                  <td className="px-6 py-4 text-stone-600 md:px-8">{formatCurrency(Number(model.rmse))}</td>
                  <td className="px-6 py-4 text-stone-600 md:px-8">{String(model.mape)}%</td>
                  <td className="px-6 py-4 text-stone-600 md:px-8">{String(model.r2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
