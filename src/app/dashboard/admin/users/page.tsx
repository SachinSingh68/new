"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mediator" as "mediator" | "admin",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error || "Failed to create user");
    toast.success(`User created (${data.user.role})`);
    setForm({ name: "", email: "", password: "", role: "mediator" });
  };

  return (
    <DashboardShell
      title="Admin Dashboard"
      navItems={[
        { href: "/dashboard/admin", label: "Dashboard" },
        { href: "/dashboard/admin/products", label: "Products" },
        { href: "/dashboard/admin/users", label: "Users" },
      ]}
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-xl p-6">
        <h1 className="mb-1 text-xl font-semibold">Create staff user</h1>
        <p className="mb-6 text-sm text-zinc-500">Only mediators and admins can be created here. Buyers register publicly.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="input-modern"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            type="email"
            className="input-modern"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="password"
            className="input-modern"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            minLength={6}
          />
          <select className="input-modern" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "mediator" | "admin" }))}>
            <option value="mediator">Mediator</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={loading} className="gradient-btn disabled:opacity-60">
            {loading ? "Creating…" : "Create user"}
          </button>
        </form>
      </motion.div>
    </DashboardShell>
  );
}
