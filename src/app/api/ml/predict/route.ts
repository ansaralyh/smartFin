import { isAuthError, requireAuth } from "@/lib/auth-request";
import { getPredictions } from "@/lib/services/finance";
import { generatePredictions, getModelComparison } from "@/lib/services/intelligence";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const predictions = await getPredictions(auth.userId);
  return NextResponse.json({
    predictions,
    models: getModelComparison(predictions),
    model: "XGBoost",
    status: "ready",
  });
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  const predictions = await generatePredictions(auth.userId);
  return NextResponse.json({
    predictions,
    models: getModelComparison(predictions),
    status: "regenerated",
  });
}
