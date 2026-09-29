"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0891b2", "#0e7490", "#155e75", "#64748b", "#94a3b8", "#cbd5e1"];

interface CategoryChartProps {
  data: { category: string; amount: number }[];
  title?: string;
}

export function CategoryChart({ data, title = "By category" }: CategoryChartProps) {
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} strokeWidth={0}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-text-secondary">Total</span>
              <span className="text-sm font-semibold text-text">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="w-full flex-1 space-y-2.5">
            {data.map((item, i) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-text">{item.category}</span>
                </div>
                <span className="text-text-secondary">{Math.round((item.amount / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
