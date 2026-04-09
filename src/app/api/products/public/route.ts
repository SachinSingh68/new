import { connectDB } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .select("_id name price image")
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
    return ok({ products });
  } catch {
    return fail("Failed to load products", 500);
  }
}
