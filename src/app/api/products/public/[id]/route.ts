import { connectDB } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return fail("Invalid id", 400);
    const product = await Product.findOne({ _id: id, isActive: true }).select("_id name price image").lean();
    if (!product) return fail("Product not found", 404);
    return ok({ product });
  } catch {
    return fail("Failed to load product", 500);
  }
}
