import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fail, ok, requireAuth } from "@/lib/api";
import { z } from "zod";

const adminCreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["mediator", "admin"]),
});

export async function POST(req: Request) {
  const auth = await requireAuth(["admin"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const body = await req.json();
    const parsed = adminCreateUserSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input", 400);

    const exists = await User.findOne({ email: parsed.data.email.toLowerCase().trim() });
    if (exists) return fail("Email already registered", 409);

    const password = await bcrypt.hash(parsed.data.password, 10);
    const user = await User.create({
      name: parsed.data.name.trim(),
      email: parsed.data.email.toLowerCase().trim(),
      password,
      role: parsed.data.role,
    });

    return ok(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return fail(message, 500);
  }
}
