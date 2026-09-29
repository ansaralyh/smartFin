import { clearAuthCookie } from "@/lib/auth-cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  return clearAuthCookie(response);
}
