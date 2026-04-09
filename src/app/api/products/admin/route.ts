import { connectDB } from "@/lib/db";
import { ok, requireAuth } from "@/lib/api";
import Product from "@/models/Product";

export async function GET() {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return ok({ products });
}
