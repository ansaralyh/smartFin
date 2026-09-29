import { isAuthError, requireAuth } from "@/lib/auth-request";
import { resetUserFinancialData } from "@/lib/services/seed";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { confirm } = await request.json();
  if (confirm !== "RESET") {
    return NextResponse.json(
      { error: 'Send { "confirm": "RESET" } to clear all financial data' },
      { status: 400 },
    );
  }

  await resetUserFinancialData(auth.userId);
  return NextResponse.json({ success: true, message: "All financial data cleared" });
}
