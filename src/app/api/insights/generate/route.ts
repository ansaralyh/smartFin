import { isAuthError, requireAuth } from "@/lib/auth-request";
import { getInsights } from "@/lib/services/finance";
import { generateInsights } from "@/lib/services/intelligence";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await generateInsights(auth.userId);
  const insights = await getInsights(auth.userId);
  return NextResponse.json({ insights, count: insights.length });
}
