import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import User from "@/models/User";
import Order from "@/models/Order";
import Refund from "@/models/Refund";

export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const [totalUsers, totalOrders, totalRefunds] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Refund.countDocuments(),
    ]);
    return ok({ totalUsers, totalOrders, totalRefunds });
  } catch {
    return fail("Failed to load stats", 500);
  }
}
