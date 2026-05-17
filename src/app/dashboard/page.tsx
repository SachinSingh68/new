import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default async function DashboardIndex() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "admin":
      redirect("/admin/dashboard");

    case "buyer":
      redirect("/buyer/dashboard");

    case "mediator":
      redirect("/mediator/dashboard");

    default:
      redirect("/");
  }
}