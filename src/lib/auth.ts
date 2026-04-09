import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "dev-secret" : "");
const COOKIE_NAME = "auth_token";

export type JWTPayload = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

export function signToken(payload: JWTPayload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured for production.");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured for production.");
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getAuthUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  (await cookies()).delete(COOKIE_NAME);
}
