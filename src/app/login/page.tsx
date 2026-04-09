"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

function safeNext(next: string | null): string | null {
  if (!next) return null;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  return trimmed;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Login failed");
    toast.success("Login successful");
    const role = data.user.role;
    const next = safeNext(searchParams.get("next"));
    if (next) {
      router.push(next);
      return;
    }
    router.push(`/dashboard/${role}`);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="glass-card w-full max-w-md p-6"
    >
      <h1 className="mb-1 text-2xl font-bold">Welcome Back</h1>
      <p className="mb-6 text-sm text-zinc-500">Sign in to continue managing your deals.</p>
      <div className="relative mb-4">
        <input name="email" type="email" required className="floating-input input-modern" placeholder=" " />
        <label className="floating-label">Email</label>
      </div>
      <div className="relative mb-4">
        <input name="password" type="password" required className="floating-input input-modern" placeholder=" " />
        <label className="floating-label">Password</label>
      </div>
      <button disabled={loading} className="gradient-btn w-full disabled:opacity-60">
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="mt-4 text-sm">
        No account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </motion.form>
  );
}

export default function LoginPage() {
  return (
    <div className="saas-bg flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="glass-card w-full max-w-md p-6 text-center text-sm text-zinc-500">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
