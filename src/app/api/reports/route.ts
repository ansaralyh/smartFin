import { isAuthError, requireAuth } from "@/lib/auth-request";
import { generateReport, getReports } from "@/lib/services/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  return NextResponse.json(await getReports(auth.userId));
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { type } = await request.json();
  const valid = ["monthly-summary", "category-breakdown", "budget-performance", "forecast"];
  if (!valid.includes(type)) {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }
  const report = await generateReport(auth.userId, type);
  return NextResponse.json(report, { status: 201 });
}
