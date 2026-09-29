import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { getEnv } from "@/lib/env";
import type { IUser } from "@/models/User";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: Pick<IUser, "_id" | "email" | "role">) {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv();
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload {
  const { JWT_SECRET } = getEnv();
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function sanitizeUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    currency: user.currency,
    phone: user.phone ?? "",
    monthlyIncome: user.monthlyIncome ?? 0,
    createdAt: user.createdAt.toISOString(),
  };
}
