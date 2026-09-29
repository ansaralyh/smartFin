import { connectDB } from "@/lib/db";
import { serializeDoc, serializeDocs } from "@/lib/serialize";
import { Report } from "@/models/Report";
import { currentMonthPrefix, logActivity, userObjectId } from "@/lib/services/core";
import { getBudgets, getDashboard } from "@/lib/services/finance";
import { generatePredictions } from "@/lib/services/intelligence";
import type { Report as ReportType } from "@/types";

function periodLabel() {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export async function getReports(userId: string) {
  await connectDB();
  const docs = await Report.find({ userId: userObjectId(userId) }).sort({ createdAt: -1 });
  return serializeDocs<ReportType>(docs);
}

export async function generateReport(
  userId: string,
  type: ReportType["type"],
) {
  await connectDB();
  const dashboard = await getDashboard(userId);
  const period = periodLabel();
  let title = "";
  let data: Record<string, unknown> = {};

  switch (type) {
    case "monthly-summary":
      title = "Monthly summary";
      data = { summary: dashboard.summary, monthlyExpenses: dashboard.monthlyExpenses };
      break;
    case "category-breakdown":
      title = "Expenses by category";
      data = { categories: dashboard.categoryExpenses };
      break;
    case "budget-performance":
      title = "Budget performance";
      data = { budgets: await getBudgets(userId) };
      break;
    case "forecast":
      title = "Forecast report";
      data = { predictions: await generatePredictions(userId) };
      break;
  }

  const doc = await Report.create({
    userId: userObjectId(userId),
    title,
    period,
    type,
    data,
  });

  await logActivity("report_generated", `${title} for ${period}`, userId);
  return serializeDoc<ReportType>(doc);
}

export async function getReportById(userId: string, reportId: string) {
  await connectDB();
  const doc = await Report.findOne({ _id: reportId, userId: userObjectId(userId) });
  if (!doc) return null;
  return serializeDoc<ReportType>(doc);
}
