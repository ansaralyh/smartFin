import { isAuthError, requireAuth } from "@/lib/auth-request";
import { markAllNotificationsRead } from "@/lib/services/finance-crud";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await markAllNotificationsRead(auth.userId);
  return NextResponse.json({ success: true });
}
