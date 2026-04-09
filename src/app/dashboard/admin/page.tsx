"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";

type OrderItem = { _id: string; product: string; status: "pending" | "completed" };
type RefundItem = { _id: string; reason: string; status: "pending" | "approved" | "rejected" };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRefunds: 0 });
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [orderPage, setOrderPage] = useState(1);
  const [refundPage, setRefundPage] = useState(1);
  const [orderQ, setOrderQ] = useState("");
  const [refundQ, setRefundQ] = useState("");
  const [orderMeta, setOrderMeta] = useState({ total: 0, totalPages: 1 });
  const [refundMeta, setRefundMeta] = useState({ total: 0, totalPages: 1 });
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [refundsLoading, setRefundsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats({
          totalUsers: data.totalUsers ?? 0,
          totalOrders: data.totalOrders ?? 0,
          totalRefunds: data.totalRefunds ?? 0,
        });
      }
    };
    void run();
  }, []);

  useEffect(() => {
    const run = async () => {
      setOrdersLoading(true);
      const params = new URLSearchParams({ page: String(orderPage), limit: "8", q: orderQ });
      const res = await fetch(`/api/orders/admin?${params}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setOrderMeta({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
      }
      setOrdersLoading(false);
    };
    void run();
  }, [orderPage, orderQ]);

  useEffect(() => {
    const run = async () => {
      setRefundsLoading(true);
      const params = new URLSearchParams({ page: String(refundPage), limit: "8", q: refundQ });
      const res = await fetch(`/api/refunds/admin?${params}`);
      const data = await res.json();
      if (res.ok) {
        setRefunds(data.refunds || []);
        setRefundMeta({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
      }
      setRefundsLoading(false);
    };
    void run();
  }, [refundPage, refundQ]);

  const refreshStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    if (res.ok) {
      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalOrders: data.totalOrders ?? 0,
        totalRefunds: data.totalRefunds ?? 0,
      });
    }
  };

  const updateOrder = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const params = new URLSearchParams({ page: String(orderPage), limit: "8", q: orderQ });
    const res = await fetch(`/api/orders/admin?${params}`);
    const data = await res.json();
    if (res.ok) {
      setOrders(data.orders || []);
      setOrderMeta({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
    }
    await refreshStats();
  };

  const updateRefund = async (id: string, status: string) => {
    await fetch(`/api/refunds/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const params = new URLSearchParams({ page: String(refundPage), limit: "8", q: refundQ });
    const res = await fetch(`/api/refunds/admin?${params}`);
    const data = await res.json();
    if (res.ok) {
      setRefunds(data.refunds || []);
      setRefundMeta({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
    }
    await refreshStats();
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
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {[
          { label: "Total users", value: stats.totalUsers },
          { label: "Total orders", value: stats.totalOrders },
          { label: "Total refunds", value: stats.totalRefunds },
        ].map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-4"
          >
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="text-2xl font-semibold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Orders</h2>
        <input
          className="input-modern max-w-xs"
          placeholder="Search orders…"
          value={orderQ}
          onChange={(e) => {
            setOrderQ(e.target.value);
            setOrderPage(1);
          }}
        />
      </div>
      <div className="space-y-2">
        {ordersLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-zinc-500">No orders match your search.</p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="glass-card flex flex-wrap items-center justify-between p-3">
              <span>
                {o.product} ({o.status})
              </span>
              <button onClick={() => updateOrder(o._id, o.status === "pending" ? "completed" : "pending")} className="ghost-btn py-1 text-sm">
                Toggle
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Page {orderPage} of {orderMeta.totalPages} ({orderMeta.total} total)
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={orderPage <= 1} className="ghost-btn py-1 text-sm disabled:opacity-40" onClick={() => setOrderPage((p) => p - 1)}>
            Prev
          </button>
          <button
            type="button"
            disabled={orderPage >= orderMeta.totalPages}
            className="ghost-btn py-1 text-sm disabled:opacity-40"
            onClick={() => setOrderPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-4 mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Refunds</h2>
        <input
          className="input-modern max-w-xs"
          placeholder="Search refunds…"
          value={refundQ}
          onChange={(e) => {
            setRefundQ(e.target.value);
            setRefundPage(1);
          }}
        />
      </div>
      <div className="space-y-2">
        {refundsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50" />
            ))}
          </div>
        ) : refunds.length === 0 ? (
          <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-zinc-500">No refunds match your search.</p>
        ) : (
          refunds.map((r) => (
            <div key={r._id} className="glass-card flex flex-wrap items-center justify-between p-3">
              <span>
                {r.reason} ({r.status})
              </span>
              <div className="space-x-2">
                <button onClick={() => updateRefund(r._id, "approved")} className="ghost-btn py-1 text-sm">
                  Approve
                </button>
                <button onClick={() => updateRefund(r._id, "rejected")} className="ghost-btn py-1 text-sm">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Page {refundPage} of {refundMeta.totalPages} ({refundMeta.total} total)
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={refundPage <= 1} className="ghost-btn py-1 text-sm disabled:opacity-40" onClick={() => setRefundPage((p) => p - 1)}>
            Prev
          </button>
          <button
            type="button"
            disabled={refundPage >= refundMeta.totalPages}
            className="ghost-btn py-1 text-sm disabled:opacity-40"
            onClick={() => setRefundPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
