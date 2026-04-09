"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

const testimonials = [
  { name: "Aarav Mehta", quote: "Super smooth buying experience and transparent refunds." },
  { name: "Priya Sharma", quote: "The mediator workflow is fast and genuinely reliable." },
  { name: "Rohan Verma", quote: "Premium UX and surprisingly quick order handling." },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/products/public");
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-violet-300/25 to-pink-300/30 dark:from-cyan-700/20 dark:via-violet-700/20 dark:to-pink-700/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl"
          >
            Premium Deals Platform for Smarter Orders and Safer Refunds
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-5 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300"
          >
            Discover products, place orders with trusted mediators, and track your refund journey with a modern role-based experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/register" className="gradient-btn inline-block px-6 py-3">
              Get Started
            </Link>
            <Link href="/login" className="rounded-xl border border-zinc-300 bg-white/70 px-5 py-3 backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured Deals</h2>
          <span className="text-sm text-zinc-500">Live from API</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-44 animate-pulse rounded-2xl border bg-zinc-100 dark:bg-zinc-900" />
              ))
            : products.length === 0 ? (
                <p className="col-span-full rounded-2xl border border-dashed py-12 text-center text-zinc-500">No deals yet. Check back soon.</p>
              ) : (
                products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    className="glass-card flex flex-col overflow-hidden p-0 transition hover:-translate-y-1"
                  >
                    <div className="aspect-video w-full bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Curated deal with verified support.</p>
                      <p className="mt-3 text-xl font-bold text-violet-600 dark:text-violet-400">INR {product.price}</p>
                      <Link
                        href={`/order-form?productId=${product._id}`}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-zinc-100 dark:text-black"
                      >
                        Buy now
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-semibold">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "1. Place Order", text: "Buyer selects product and preferred mediator for secure handling." },
            { title: "2. Track Progress", text: "Mediator and buyer dashboards provide real-time order/refund visibility." },
            { title: "3. Resolve Fast", text: "Admin can monitor, manage statuses, and ensure trusted outcomes." },
          ].map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="rounded-2xl border bg-gradient-to-b from-white to-zinc-50 p-5 dark:from-zinc-900 dark:to-zinc-950"
            >
              <p className="text-lg font-semibold">{step.title}</p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-semibold">What Customers Say</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-zinc-900"
            >
              <blockquote className="text-zinc-700 dark:text-zinc-200">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-medium text-zinc-500">{item.name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/70 py-8 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-zinc-600 sm:flex-row sm:px-6 lg:px-8 dark:text-zinc-300">
          <p>© {new Date().getFullYear()} Deals Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white">
              Login
            </Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
