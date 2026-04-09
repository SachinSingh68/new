import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import { orderSchema } from "@/lib/validations";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function POST(req: Request) {
  const auth = await requireAuth(["buyer"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input");

    const mediator = await User.findOne({ _id: parsed.data.mediatorId, role: "mediator" });
    if (!mediator) return fail("Invalid mediator");

    let productName = parsed.data.product?.trim() ?? "";
    let productObjectId: mongoose.Types.ObjectId | undefined;

    if (parsed.data.productId) {
      if (!mongoose.Types.ObjectId.isValid(parsed.data.productId)) {
        return fail("Invalid productId", 400);
      }
      const productDoc = await Product.findOne({ _id: parsed.data.productId, isActive: true }).lean();
      if (!productDoc) return fail("Product not found or inactive", 404);
      productName = productDoc.name;
      productObjectId = new mongoose.Types.ObjectId(parsed.data.productId);
    }

    if (!productName) return fail("Product is required", 400);

    const buyerObjectId = new mongoose.Types.ObjectId(auth.user.id);

    const order = await Order.create({
      buyerId: buyerObjectId,
      mediatorId: parsed.data.mediatorId,
      productId: productObjectId,
      name: parsed.data.name,
      phone: parsed.data.phone,
      product: productName,
      quantity: parsed.data.quantity,
      address: parsed.data.address,
      notes: parsed.data.notes ?? "",
      statusHistory: [{ status: "pending", at: new Date(), actorId: buyerObjectId }],
    });
    return ok({ order }, 201);
  } catch {
    return fail("Order creation failed", 500);
  }
}
