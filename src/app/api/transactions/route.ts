import { isAuthError, requireAuth } from "@/lib/auth-request";
import { createTransaction, getTransactions } from "@/lib/services/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  const type = request.nextUrl.searchParams.get("type") as "income" | "expense" | null;
  const data = await getTransactions(auth.userId, type ?? undefined);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json();
  if (!body.type || !body.amount || !body.category || !body.description) {
    return NextResponse.json(
      { error: "type, amount, category, and description are required" },
      { status: 400 },
    );
  }

  const transaction = await createTransaction(auth.userId, {
    type: body.type,
    amount: Number(body.amount),
    category: body.category,
    description: body.description,
    date: body.date,
  });

  return NextResponse.json(transaction, { status: 201 });
}
