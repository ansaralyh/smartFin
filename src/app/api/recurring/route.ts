import { isAuthError, requireAuth } from "@/lib/auth-request";
import { createRecurring, getRecurring, processDueRecurring } from "@/lib/services/finance-crud";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await processDueRecurring(auth.userId);
  return NextResponse.json(await getRecurring(auth.userId));
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const body = await request.json();
  if (!body.description || !body.amount || !body.category || !body.type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const item = await createRecurring(auth.userId, body);
  return NextResponse.json(item, { status: 201 });
}
