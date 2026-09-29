import { isAuthError, requireAuth } from "@/lib/auth-request";
import { contributeToSavings } from "@/lib/services/finance-crud";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const { amount } = await request.json();
  if (!amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
  }
  try {
    const goal = await contributeToSavings(auth.userId, id, Number(amount));
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Contribution failed" },
      { status: 404 },
    );
  }
}
