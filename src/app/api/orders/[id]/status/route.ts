import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  if (!["pending", "completed"].includes(body.status)) return fail("Invalid status");
  const order = await Order.findById(id);
  if (!order) return fail("Order not found", 404);
  const prev = order.status;
  if (prev === body.status) return ok({ order });
  const actorId = new mongoose.Types.ObjectId(auth.user.id);
  order.status = body.status;
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({ status: body.status, at: new Date(), actorId });
  await order.save();
  return ok({ order });
}
