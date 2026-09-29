import { connectDB } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    getEnv();
    await connectDB();
    return NextResponse.json({
      status: "ok",
      service: "SmartFin AI",
      database: "connected",
      ai: process.env.OPENAI_API_KEY ? "configured" : "not configured",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 503 },
    );
  }
}
