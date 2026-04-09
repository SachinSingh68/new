"use client";

import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";

type ProductItem = { _id: string; name: string };
type MediatorItem = { _id: string; name: string };

function OrderFormInner() {
  const searchParams = useSearchParams();
  const productIdFromUrl = searchParams.get("productId");

  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [mediators, setMediators] = useState<MediatorItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    product: "",
    productId: "",
    quantity: 1,
    address: "",
    notes: "",
    mediatorId: "",
  });

  useEffect(() => {
    const run = async () => {
      const [p, m] = await Promise.all([fetch("/api/products"), fetch("/api/users/mediators")]);
      setProducts((await p.json()).products || []);
      setMediators((await m.json()).mediators || []);
    };
    void run();
  }, []);

  useEffect(() => {
    if (!productIdFromUrl) return;
    const run = async () => {
      const res = await fetch(`/api/products/public/${productIdFromUrl}`);
      const data = await res.json();
      if (!res.ok) return;
      setForm((f) => ({
        ...f,
        productId: productIdFromUrl,
        product: data.product?.name ?? "",
      }));
    };
    void run();
  }, [productIdFromUrl]);

  const progress = Math.round((step / 3) * 100);

  const submit = async () => {
    const payload: Record<string, unknown> = {
      name: form.name,
      phone: form.phone,
      quantity: Number(form.quantity),
      address: form.address,
      notes: form.notes ?? "",
      mediatorId: form.mediatorId,
    };
    if (form.productId) {
      payload.productId = form.productId;
    } else {
      payload.product = form.product;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed");
    toast.success("Order created");
    setStep(1);
    setForm({
      name: "",
      phone: "",
      product: "",
      productId: "",
      quantity: 1,
      address: "",
      notes: "",
      mediatorId: "",
    });
  };

  return (
    <DashboardShell
      title="Buyer Dashboard"
      navItems={[
        { href: "/dashboard/buyer", label: "Dashboard" },
        { href: "/order-form", label: "Order Form" },
        { href: "/refund-form", label: "Refund Form" },
      ]}
    >
      <h1 className="mb-4 text-xl font-semibold">Order Form</h1>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-700/60">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="glass-card space-y-3 p-4">
        {step === 1 && (
          <>
            <input className="input-modern" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-modern" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </>
        )}
        {step === 2 && (
          <>
            {form.productId ? (
              <div className="rounded-xl border border-cyan-200/60 bg-cyan-50/50 px-3 py-2 text-sm dark:border-cyan-900/50 dark:bg-cyan-950/30">
                Product: <span className="font-semibold">{form.product}</span>
              </div>
            ) : (
              <select className="input-modern" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value, productId: "" })}>
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p._id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            <input type="number" min={1} className="input-modern" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            <select className="input-modern" value={form.mediatorId} onChange={(e) => setForm({ ...form, mediatorId: e.target.value })}>
              <option value="">Select mediator</option>
              {mediators.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </>
        )}
        {step === 3 && (
          <>
            <input className="input-modern" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <textarea className="input-modern min-h-28" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </>
        )}
      </motion.div>
      <div className="mt-4 flex gap-2">
        <button disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="ghost-btn disabled:opacity-50">
          Back
        </button>
        {step < 3 ? (
          <button onClick={() => setStep((s) => s + 1)} className="gradient-btn">
            Next
          </button>
        ) : (
          <button onClick={submit} className="gradient-btn">
            Submit
          </button>
        )}
      </div>
    </DashboardShell>
  );
}

export default function OrderFormPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Loading form…</div>}>
      <OrderFormInner />
    </Suspense>
  );
}
