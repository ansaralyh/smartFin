import { isAuthError, requireAuth } from "@/lib/auth-request";
import { getAnomalies } from "@/lib/services/finance";
import { detectAnomalies } from "@/lib/services/intelligence";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const anomalies = await getAnomalies(auth.userId);
  return NextResponse.json({ anomalies, model: "Isolation Forest", status: "ready" });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await detectAnomalies(auth.userId);
  const anomalies = await getAnomalies(auth.userId);
  return NextResponse.json({ anomalies, count: anomalies.length, status: "scanned" });
}
