import { NextResponse } from "next/server";
import { getAuthUser, JWTPayload } from "@/lib/auth";
import { Role } from "@/models/User";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuth(roles?: Role[]): Promise<
  | { user: JWTPayload; error?: never }
  | { error: NextResponse; user?: never }
> {
  const user = await getAuthUser();
  if (!user) return { error: fail("Unauthorized", 401) };
  if (roles && !roles.includes(user.role)) return { error: fail("Forbidden", 403) };
  return { user };
}
