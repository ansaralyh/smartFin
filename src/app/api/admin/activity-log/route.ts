import { isAuthError, requireAdmin } from "@/lib/auth-request";
import { getActivityLog } from "@/lib/services/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (isAuthError(auth)) return auth;
  return NextResponse.json(await getActivityLog());
}
