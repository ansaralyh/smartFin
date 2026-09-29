"use client";

import { HealthScore } from "@/components/dashboard/health-score";
import { PageHeader } from "@/components/layout/page-header";
import { PageError, PageLoading } from "@/components/ui/page-state";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { useState } from "react";

export function InsightsView() {
  const [generating, setGenerating] = useState(false);
  const insightsQuery = useApiQuery(() => api.insights(), []);
  const healthQuery = useApiQuery(() => api.ml.healthScore(), []);

  async function regenerate() {
    setGenerating(true);
    try {
      await api.ml.generateInsights();
      insightsQuery.refetch();
    } finally {
      setGenerating(false);
    }
  }

  if (insightsQuery.loading || healthQuery.loading) return <PageLoading />;
  if (insightsQuery.error) return <PageError message={insightsQuery.error} />;

  const health = healthQuery.data;

  return (
    <div>
      <PageHeader>
        <Button size="sm" onClick={regenerate} disabled={generating}>
          {generating ? "Generating..." : "Refresh insights"}
        </Button>
      </PageHeader>

      <div className="mb-8">
        <HealthScore
          score={health?.score ?? 0}
          breakdown={
            health
              ? [
                  { label: "Savings rate", value: health.breakdown.savingsRate },
                  { label: "Budget adherence", value: health.breakdown.budgetAdherence },
                  { label: "Expense stability", value: health.breakdown.expenseStability },
                  { label: "Goal progress", value: health.breakdown.savingsGoalProgress },
                ]
              : []
          }
        />
      </div>

      <div className="space-y-4">
        {(insightsQuery.data ?? []).map((insight) => (
          <div key={insight.id} className="rounded-2xl border border-stone-200/80 bg-white p-6 md:p-8">
            <p className="text-lg font-medium text-stone-900">{insight.title}</p>
            <p className="mt-2 text-base leading-relaxed text-stone-500">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
