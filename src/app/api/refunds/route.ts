import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import { refundSchema } from "@/lib/validations";
import Refund from "@/models/Refund";
import Order from "@/models/Order";

export async function POST(req: Request) {
  const auth = await requireAuth(["buyer"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const body = await req.json();
    const parsed = refundSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input");

    const order = await Order.findOne({ _id: parsed.data.orderId, buyerId: auth.user.id });
    if (!order) return fail("Order not found or not yours", 404);

    const buyerObjectId = order.buyerId;
    const refund = await Refund.create({
      orderId: order._id,
      buyerId: buyerObjectId,
      mediatorId: order.mediatorId,
      reason: parsed.data.reason,
      amount: parsed.data.amount,
      description: parsed.data.description ?? "",
      statusHistory: [{ status: "pending", at: new Date(), actorId: buyerObjectId }],
    });
    return ok({ refund }, 201);
  } catch {
    return fail("Refund creation failed", 500);
  }
}
