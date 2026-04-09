"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";

type OrderItem = { _id: string; product: string; quantity: number; status: string };
type RefundItem = { _id: string; reason: string; amount: number; status: string };

export default function BuyerDashboard() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const [o, r] = await Promise.all([fetch("/api/orders/buyer"), fetch("/api/refunds/buyer")]);
      setOrders((await o.json()).orders || []);
      setRefunds((await r.json()).refunds || []);
      setLoading(false);
    };
    void run();
  }, []);

  return (
    <DashboardShell title="Buyer Dashboard" navItems={[{ href: "/dashboard/buyer", label: "Dashboard" }, { href: "/order-form", label: "Order Form" }, { href: "/refund-form", label: "Refund Form" }]}>
      <h1 className="mb-4 text-xl font-semibold">My Orders</h1>
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        {loading ? (
          [1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/50" />)
        ) : orders.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed px-4 py-10 text-center text-sm text-zinc-500">No orders yet. Place one from the order form.</p>
        ) : (
          orders.map((o, idx) => (
          <motion.div key={o._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="glass-card p-3">
            <p className="font-medium">{o.product}</p>
            <p className="text-sm">Qty: {o.quantity}</p>
            <p className="text-sm">Status: {o.status}</p>
          </motion.div>
          ))
        )}
      </div>
      <h2 className="mb-4 text-xl font-semibold">My Refunds</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {loading ? (
          [1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/50" />)
        ) : refunds.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed px-4 py-10 text-center text-sm text-zinc-500">No refund requests yet.</p>
        ) : (
          refunds.map((r, idx) => (
          <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="glass-card p-3">
            <p className="font-medium">{r.reason}</p>
            <p className="text-sm">Amount: {r.amount}</p>
            <p className="text-sm">Status: {r.status}</p>
          </motion.div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
