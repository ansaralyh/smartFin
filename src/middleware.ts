import { COOKIE_NAME } from "@/lib/auth-cookie";
import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/register"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/expenses",
  "/income",
  "/budgets",
  "/savings",
  "/predictions",
  "/anomalies",
  "/insights",
  "/notifications",
  "/assistant",
  "/analytics",
  "/categories",
  "/recurring",
  "/reports",
  "/profile",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthPage = AUTH_PATHS.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (token) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/:path*",
    "/expenses",
    "/expenses/:path*",
    "/income",
    "/income/:path*",
    "/budgets",
    "/budgets/:path*",
    "/savings",
    "/savings/:path*",
    "/predictions",
    "/predictions/:path*",
    "/anomalies",
    "/anomalies/:path*",
    "/insights",
    "/insights/:path*",
    "/notifications",
    "/notifications/:path*",
    "/assistant",
    "/assistant/:path*",
    "/analytics",
    "/analytics/:path*",
    "/categories",
    "/categories/:path*",
    "/recurring",
    "/recurring/:path*",
    "/reports",
    "/reports/:path*",
    "/profile",
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
