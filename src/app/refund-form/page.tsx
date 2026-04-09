"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type OrderItem = { _id: string; product: string; status: string };

export default function RefundFormPage() {
  const [step, setStep] = useState(1);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [form, setForm] = useState({
    orderId: "",
    reason: "",
    amount: 0,
    description: "",
  });

  useEffect(() => {
    const run = async () => {
      const r = await fetch("/api/orders/buyer");
      setOrders((await r.json()).orders || []);
    };
    void run();
  }, []);

  const progress = Math.round((step / 2) * 100);
  const submit = async () => {
    const res = await fetch("/api/refunds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    toast.success("Refund request created");
    setStep(1);
  };

  return (
    <DashboardShell title="Buyer Dashboard" navItems={[{ href: "/dashboard/buyer", label: "Dashboard" }, { href: "/order-form", label: "Order Form" }, { href: "/refund-form", label: "Refund Form" }]}>
      <h1 className="mb-4 text-xl font-semibold">Refund Form</h1>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-700/60">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="glass-card space-y-3 p-4">
        {step === 1 && (
          <select className="input-modern" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })}>
            <option value="">Select order</option>
            {orders.map((o) => <option key={o._id} value={o._id}>{o.product} - {o.status}</option>)}
          </select>
        )}
        {step === 2 && (
          <>
            <input className="input-modern" placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <input type="number" min={0} className="input-modern" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            <textarea className="input-modern min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </>
        )}
      </motion.div>
      <div className="mt-4 flex gap-2">
        <button disabled={step === 1} onClick={() => setStep(1)} className="ghost-btn disabled:opacity-50">Back</button>
        {step === 1 ? (
          <button onClick={() => setStep(2)} className="gradient-btn">Next</button>
        ) : (
          <button onClick={submit} className="gradient-btn">Submit</button>
        )}
      </div>
    </DashboardShell>
  );
}
