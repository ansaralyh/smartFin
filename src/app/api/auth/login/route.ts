import { sanitizeUser, signToken, verifyPassword } from "@/lib/auth";
import { setAuthCookie } from "@/lib/auth-cookie";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/services/core";
import { ensureUserSetup } from "@/lib/services/seed";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await ensureUserSetup(user._id.toString());
    await logActivity("user_login", `${user.email} signed in`, user._id.toString());
    const token = signToken(user);
    const response = NextResponse.json({ user: sanitizeUser(user) });
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
