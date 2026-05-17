// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">DealSecure</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Your trusted platform for premium deals and secure transactions.</p>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/about" className="hover:text-zinc-900 dark:hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-zinc-900 dark:hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Follow Us</h4>
            <div className="mt-2 flex gap-4">
              <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Twitter</a>
              <a href="#" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} DealSecure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}