"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

const testimonials = [
  { name: "Aarav Mehta", role: "Tech Entrepreneur", quote: "Super smooth buying experience and transparent refunds. The mediator system gives me complete peace of mind." },
  { name: "Priya Sharma", role: "Product Designer", quote: "The mediator workflow is fast and genuinely reliable. Best platform for premium deals I've used." },
  { name: "Rohan Verma", role: "E-commerce Founder", quote: "Premium UX and surprisingly quick order handling. The dashboard is incredibly intuitive." },
  { name: "Neha Gupta", role: "Freelancer", quote: "Finally a platform that prioritizes buyer safety. The refund process is seamless." },
];

const steps = [
  { title: "Place Order", text: "Browse curated deals and select your preferred mediator for secure transaction handling.", icon: "🛒", color: "from-cyan-500 to-blue-500" },
  { title: "Track Progress", text: "Real-time order and refund visibility through dedicated buyer and mediator dashboards.", icon: "📊", color: "from-violet-500 to-purple-500" },
  { title: "Resolve Fast", text: "Admin oversight ensures smooth status management and trusted outcomes every time.", icon: "⚡", color: "from-pink-500 to-rose-500" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/products/public");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    void load();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-5 py-5">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left column: text and buttons (existing) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >

              <motion.h1 variants={fadeInUp} className="max-w-4xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent">
                Premium Deals Platform for Smarter Orders
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 mx-auto lg:mx-0">
                Discover products, place orders with trusted mediators, and track your refund journey with a modern role-based experience.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/register" className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105">
                  Start Shopping
                  <motion.span 
                    animate={{ x: [0, 4, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-xl"
                  >
                    →
                  </motion.span>
                </Link>
                <Link href="#featured" className="rounded-xl border border-zinc-300 bg-white/80 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:bg-zinc-900">
                  Explore Deals
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                {[
                  { label: "Active Deals", value: "500+", color: "text-cyan-600" },
                  { label: "Happy Customers", value: "10k+", color: "text-violet-600" },
                  { label: "Success Rate", value: "99.9%", color: "text-pink-600" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right column: animated visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative perspective-1000">
                {/* Floating card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="glass-card rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-3xl shadow-lg">
                      🎧
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Premium Wireless Headphones</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-2xl font-bold text-violet-600">INR 2,499</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">-40%</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-zinc-500">(128 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-emerald-600">✓</span> Mediator verified
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-emerald-600">✓</span> 7-day refund
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge 1 */}
                <motion.div
                  initial={{ x: -20, y: 20, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -left-8 top-24 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm dark:bg-zinc-800/90"
                >
                  ⚡ Fast delivery
                </motion.div>

                {/* Floating badge 2 */}
                <motion.div
                  initial={{ x: 20, y: -20, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -right-6 bottom-20 rounded-full bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 shadow-lg dark:bg-violet-900/40 dark:text-violet-300"
                >
                  🔒 Buyer protection
                </motion.div>

                {/* Animated pulse ring behind */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center">
                  <div className="h-72 w-72 rounded-full bg-gradient-to-r from-cyan-400/20 to-violet-400/20 blur-3xl animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* Featured Products Section */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <span className="text-sm font-semibold text-violet-600 uppercase tracking-wider">Curated Collection</span>
            <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              Featured Deals
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Hand-picked premium products with verified support</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 animate-pulse"
                  >
                    <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                      <div className="h-4 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                      <div className="h-6 w-1/3 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                  </motion.div>
                ))
              : products.length === 0 ? (
                <motion.p variants={fadeInUp} className="col-span-full rounded-2xl border-2 border-dashed border-zinc-300 py-16 text-center text-zinc-500 dark:border-zinc-700">
                  No deals yet. Check back soon.
                </motion.p>
              ) : (
                products.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    variants={fadeInUp}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-zinc-200/50 transition-all hover:shadow-2xl hover:shadow-violet-200/30 dark:bg-zinc-900 dark:shadow-zinc-800/50 dark:hover:shadow-violet-900/20"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-cyan-100 to-violet-100 dark:from-cyan-900/30 dark:to-violet-900/30">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl">🎁</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold line-clamp-1">{product.name}</h3>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Curated deal with verified support & buyer protection</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
                          INR {product.price.toLocaleString()}
                        </p>
                        <Link
                          href={`/order-form?productId=${product._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition-all hover:gap-3 hover:shadow-lg dark:from-zinc-100 dark:to-zinc-200 dark:text-black"
                        >
                          Buy now
                          <span className="text-lg">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-50/50 to-violet-50/50 dark:from-cyan-950/20 dark:to-violet-950/20 rounded-3xl my-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.span variants={fadeInUp} className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Simple Process</motion.span>
          <motion.h2 variants={fadeInUp} className="mt-2 text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            How It Works
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Three simple steps to secure and premium shopping experience
          </motion.p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl bg-white/80 p-8 backdrop-blur-sm shadow-lg transition-all hover:shadow-xl dark:bg-zinc-900/80"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                <div className="relative">
                  <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-4xl shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              What Customers Say
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Join thousands of satisfied buyers</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((item, idx) => (
              <motion.figure
                key={item.name}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-zinc-900"
              >
                <div className="mb-4 text-4xl">“</div>
                <blockquote className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-semibold text-zinc-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-zinc-500">{item.role}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 p-8 text-center shadow-2xl sm:p-12">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Start Your Journey?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              Join thousands of users who trust our platform for secure and premium deals
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-violet-600 transition-all hover:gap-3 hover:shadow-xl"
            >
              Get Started Now
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 p-3 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .gradient-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
        }
      `}</style>
    </div>
  );
}