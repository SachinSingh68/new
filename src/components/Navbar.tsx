// components/Navbar.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
            DealSecure
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="gradient-btn rounded-xl px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}