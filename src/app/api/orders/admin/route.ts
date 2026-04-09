import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import Order from "@/models/Order";

export async function GET(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const q = (searchParams.get("q") || "").trim();
    const filter = q
      ? {
          $or: [
            { product: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
            { name: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
          ],
        }
      : {};
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    return ok({ orders, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
  } catch {
    return fail("Failed to load orders", 500);
  }
}
