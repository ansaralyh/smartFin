import { verifyToken, type JWTPayload } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/auth-cookie";
import { NextRequest, NextResponse } from "next/server";

export function getTokenFromRequest(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

export function getAuthPayload(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest): JWTPayload | NextResponse {
  const payload = getAuthPayload(request);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return payload;
}

export function isAuthError(result: JWTPayload | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

export function requireAdmin(request: NextRequest): JWTPayload | NextResponse {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return auth;
}
