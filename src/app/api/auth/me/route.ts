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
