import { requireAuth, ok } from "@/lib/api";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  return ok({ user: auth.user });
}
