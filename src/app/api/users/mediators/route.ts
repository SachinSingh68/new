import { connectDB } from "@/lib/db";
import { fail, ok, requireAuth } from "@/lib/api";
import User from "@/models/User";

export async function GET() {
  const auth = await requireAuth(["buyer"]);
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const mediators = await User.find({ role: "mediator" }).select("_id name email").lean();
    return ok({ mediators });
  } catch {
    return fail("Failed to load mediators", 500);
  }
}
