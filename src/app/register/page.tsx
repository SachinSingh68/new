"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Register failed");
    toast.success("Account created");
    router.push("/dashboard/buyer");
  };

  return (
    <div className="saas-bg flex min-h-screen items-center justify-center p-4">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="glass-card w-full max-w-md p-6"
      >
        <h1 className="mb-1 text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-sm text-zinc-500">Buyer accounts only. Mediators and admins are created by an administrator.</p>
        <div className="relative mb-4">
          <input name="name" required className="floating-input input-modern" placeholder=" " />
          <label className="floating-label">Name</label>
        </div>
        <div className="relative mb-4">
          <input name="email" type="email" required className="floating-input input-modern" placeholder=" " />
          <label className="floating-label">Email</label>
        </div>
        <div className="relative mb-4">
          <input name="password" type="password" required className="floating-input input-modern" placeholder=" " />
          <label className="floating-label">Password</label>
        </div>
        <button disabled={loading} className="gradient-btn w-full disabled:opacity-60">
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="mt-4 text-sm">
          Already have account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
