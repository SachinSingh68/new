"use client";

import { motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  isActive: boolean;
};

type EditState = {
  id: string;
  name: string;
  price: string;
  image: string;
  isActive: boolean;
} | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState>(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "", isActive: true });

  const activeCount = useMemo(() => products.filter((p) => p.isActive).length, [products]);

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products/admin");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to load products");
      setLoading(false);
      return;
    }
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/products/admin");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to load products");
        setLoading(false);
        return;
      }
      setProducts(data.products || []);
      setLoading(false);
    };
    void run();
  }, []);

  const addProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: newProduct.name.trim(),
      price: Number(newProduct.price),
      image: newProduct.image.trim(),
      isActive: newProduct.isActive,
    };
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed to add product");
    toast.success("Product added");
    setNewProduct({ name: "", price: "", image: "", isActive: true });
    await loadProducts();
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Delete failed");
    toast.success("Product deleted");
    await loadProducts();
  };

  const toggleActive = async (product: Product) => {
    const res = await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Status update failed");
    toast.success(`Product ${!product.isActive ? "activated" : "deactivated"}`);
    await loadProducts();
  };

  const saveEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editState) return;
    const res = await fetch(`/api/products/${editState.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editState.name.trim(),
        price: Number(editState.price),
        image: editState.image.trim(),
        isActive: editState.isActive,
      }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Edit failed");
    toast.success("Product updated");
    setEditState(null);
    await loadProducts();
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <p className="text-sm text-zinc-500">Total Products</p>
          <p className="text-2xl font-semibold">{products.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
          <p className="text-sm text-zinc-500">Active</p>
          <p className="text-2xl font-semibold">{activeCount}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <p className="text-sm text-zinc-500">Inactive</p>
          <p className="text-2xl font-semibold">{products.length - activeCount}</p>
        </motion.div>
      </div>

      <div className="glass-card mb-6 p-4">
        <h1 className="mb-4 text-xl font-semibold">Add Product</h1>
        <form onSubmit={addProduct} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="input-modern"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="number"
              min={0}
              step="0.01"
              className="input-modern"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>
          <input
            className="input-modern"
            placeholder="Image URL (optional)"
            value={newProduct.image}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, image: e.target.value }))}
          />
          <div className="flex flex-wrap gap-3">
            <select
              className="input-modern max-w-xs"
              value={newProduct.isActive ? "active" : "inactive"}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, isActive: e.target.value === "active" }))}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit" className="gradient-btn">
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-zinc-100/70 text-left dark:bg-zinc-900/70">
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="table-row-hover border-t">
                    <td className="px-4 py-3">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">INR {product.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            setEditState({
                              id: product._id,
                              name: product.name,
                              price: String(product.price),
                              image: product.image ?? "",
                              isActive: product.isActive,
                            })
                          }
                          className="ghost-btn py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button onClick={() => void toggleActive(product)} className="ghost-btn py-1 text-sm">
                          {product.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => void deleteProduct(product._id)}
                          className="rounded-xl border border-red-300/70 bg-red-50/60 px-3 py-1 text-sm text-red-600 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="glass-card w-full max-w-lg p-5 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold">Edit Product</h3>
            <form onSubmit={saveEdit} className="space-y-3">
              <input
                className="input-modern"
                value={editState.name}
                onChange={(e) => setEditState((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                required
              />
              <input
                type="number"
                min={0}
                step="0.01"
                className="input-modern"
                value={editState.price}
                onChange={(e) => setEditState((prev) => (prev ? { ...prev, price: e.target.value } : prev))}
                required
              />
              <input
                className="input-modern"
                placeholder="Image URL"
                value={editState.image}
                onChange={(e) => setEditState((prev) => (prev ? { ...prev, image: e.target.value } : prev))}
              />
              <select
                className="input-modern"
                value={editState.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  setEditState((prev) => (prev ? { ...prev, isActive: e.target.value === "active" } : prev))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditState(null)}
                  className="ghost-btn"
                >
                  Cancel
                </button>
                <button className="gradient-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardShell>
  );
}
