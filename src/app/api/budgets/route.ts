import { isAuthError, requireAuth } from "@/lib/auth-request";
import { createBudget } from "@/lib/services/finance-crud";
import { getBudgets } from "@/lib/services/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  return NextResponse.json(await getBudgets(auth.userId));
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const body = await request.json();
  if (!body.category || !body.limit) {
    return NextResponse.json({ error: "category and limit are required" }, { status: 400 });
  }
  const budget = await createBudget(auth.userId, body);
  return NextResponse.json(budget, { status: 201 });
}
