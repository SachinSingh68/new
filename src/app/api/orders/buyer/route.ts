import { connectDB } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api";
import Order from "@/models/Order";

export async function GET() {
  const auth = await requireAuth(["buyer"]);
  if (auth.error) return auth.error;
  await connectDB();
  const orders = await Order.find({ buyerId: auth.user.id }).sort({ createdAt: -1 }).lean();
  return ok({ orders });
}
