import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { fail, ok } from "@/lib/api";
import { registerSchema } from "@/lib/validations";
import { setAuthCookie, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to DB");
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    console.log("Parsed data:", parsed);
    if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid input");

    const exists = await User.findOne({ email: parsed.data.email });
    if (exists) return fail("Email already registered", 409);

    const password = parsed.data.password;
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      role: "admin",
    });
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });
    await setAuthCookie(token);
    return ok({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return fail(message, 500);
  }
}
