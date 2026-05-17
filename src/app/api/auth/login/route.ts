import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fail, ok } from "@/lib/api";
import { loginSchema } from "@/lib/validations";
import { setAuthCookie, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input");
    const user = await User.findOne({ email: parsed.data.email });
    if (!user) return fail("Invalid credentials", 401);
    const isMatch = parsed.data.password==user.password;
    if (!isMatch) return fail("Invalid credentials", 401);

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });
    await setAuthCookie(token);
    return ok({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return fail(message, 500);
  }
}
