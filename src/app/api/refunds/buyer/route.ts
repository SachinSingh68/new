import { connectDB } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api";
import Refund from "@/models/Refund";

export async function GET() {
  const auth = await requireAuth(["buyer"]);
  if (auth.error) return auth.error;
  await connectDB();
  const refunds = await Refund.find({ buyerId: auth.user.id }).sort({ createdAt: -1 }).lean();
  return ok({ refunds });
}
