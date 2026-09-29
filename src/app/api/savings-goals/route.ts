import { isAuthError, requireAuth } from "@/lib/auth-request";
import { createSavingsGoal } from "@/lib/services/finance-crud";
import { getSavingsGoals } from "@/lib/services/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  return NextResponse.json(await getSavingsGoals(auth.userId));
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const body = await request.json();
  if (!body.name || !body.targetAmount) {
    return NextResponse.json({ error: "name and targetAmount are required" }, { status: 400 });
  }
  const goal = await createSavingsGoal(auth.userId, body);
  return NextResponse.json(goal, { status: 201 });
}
