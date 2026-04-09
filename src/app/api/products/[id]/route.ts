import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import Product from "@/models/Product";
import { productUpdateSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input");

    const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!product) return fail("Product not found", 404);
    return ok({ product });
  } catch {
    return fail("Failed to update product", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return fail("Product not found", 404);
    return ok({ success: true });
  } catch {
    return fail("Failed to delete product", 500);
  }
}
