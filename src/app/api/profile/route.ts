import { sanitizeUser } from "@/lib/auth";
import { isAuthError, requireAuth } from "@/lib/auth-request";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  await connectDB();
  const user = await User.findById(auth.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: sanitizeUser(user) });
}

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.name?.trim()) updates.name = body.name.trim();
  if (body.currency?.trim()) updates.currency = body.currency.trim();
  if (body.phone !== undefined) updates.phone = String(body.phone).trim();
  if (body.monthlyIncome !== undefined) {
    updates.monthlyIncome = Number(body.monthlyIncome);
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(auth.userId, updates, { new: true });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: sanitizeUser(user) });
}
