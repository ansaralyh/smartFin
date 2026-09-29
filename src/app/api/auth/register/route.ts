import { hashPassword, sanitizeUser, signToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/auth-cookie";
import { connectDB } from "@/lib/db";
import { logActivity } from "@/lib/services/core";
import { ensureUserSetup } from "@/lib/services/seed";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await hashPassword(password),
    });

    await ensureUserSetup(user._id.toString());
    await logActivity("user_registered", `${user.email} created an account`, user._id.toString());
    const token = signToken(user);
    const response = NextResponse.json({ user: sanitizeUser(user) }, { status: 201 });
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
