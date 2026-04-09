import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import Refund from "@/models/Refund";
import mongoose from "mongoose";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  if (!["pending", "approved", "rejected"].includes(body.status)) return fail("Invalid status");
  const refund = await Refund.findById(id);
  if (!refund) return fail("Refund not found", 404);
  if (refund.status === body.status) return ok({ refund });
  const actorId = new mongoose.Types.ObjectId(auth.user.id);
  refund.status = body.status;
  refund.statusHistory = refund.statusHistory || [];
  refund.statusHistory.push({ status: body.status, at: new Date(), actorId });
  await refund.save();
  return ok({ refund });
}
