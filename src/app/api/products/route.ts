import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAuth(["buyer", "mediator", "admin"]);
  if (auth.error) return auth.error;
  await connectDB();
  const products = await Product.find({ isActive: true }).lean();
  return ok({ products });
}

export async function POST(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input");
    const product = await Product.create(parsed.data);
    return ok({ product }, 201);
  } catch {
    return fail("Failed to create product", 500);
  }
}
