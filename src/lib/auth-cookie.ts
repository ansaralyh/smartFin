import { getEnv } from "@/lib/env";
import { NextResponse } from "next/server";

const COOKIE_NAME = "token";

function maxAgeSeconds() {
  const expiresIn = getEnv().JWT_EXPIRES_IN;
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60;
  const value = Number(match[1]);
  const unit = match[2];
  if (unit === "d") return value * 24 * 60 * 60;
  if (unit === "h") return value * 60 * 60;
  if (unit === "m") return value * 60;
  return value;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds(),
  });
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export { COOKIE_NAME };
