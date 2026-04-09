"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

type NavItem = { href: string; label: string };

export function DashboardShell({
  title,
  navItems,
  children,
}: {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <div className="saas-bg relative min-h-screen overflow-hidden dark:text-zinc-100">
      <div className="pointer-events-none absolute -top-20 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10" />
      <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/10" />
      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-[240px_1fr]">
        <motion.aside initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
          <h2 className="mb-4 text-lg font-semibold">{title}</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2 transition ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-400/20"
                    : "hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="ghost-btn">
              Logout
            </button>
          </div>
        </motion.aside>
        <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
