import { isAuthError, requireAuth } from "@/lib/auth-request";
import { getHealthScore } from "@/lib/services/finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  const data = await getHealthScore(auth.userId);
  return NextResponse.json(data);
}
