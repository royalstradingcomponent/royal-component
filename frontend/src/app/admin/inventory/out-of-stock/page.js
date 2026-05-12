"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, RotateCcw, Edit, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, adminRequest } from "@/lib/api";

function getImage(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
}

export default function OutOfStockPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: "1",
        limit: "100",
        keyword: search,
      });

      const data = await adminRequest(
        `/api/admin/inventory/out-of-stock?${params.toString()}`
      );

      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message || "Out of stock products load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const markInStock = async (product) => {
    try {
      setUpdatingId(product._id);

      await adminRequest(`/api/admin/inventory/${product._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          stock: Math.max(Number(product.stock || 0), 1),
          stockStatus: "in_stock",
          isOutOfStock: false,
        }),
      });

      toast.success("Product marked as in stock");
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#102033]">
                  Out Of Stock Products
                </h1>
                <p className="text-sm text-slate-500">
                  Manage unavailable components and mark them back in stock.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d469b]"
          >
            All Products
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, MPN, brand..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No out of stock products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">SKU / MPN</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Backorder</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => {
                  const image =
                    product.thumbnail || product.images?.[0]?.url || "";

                  return (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-xl border bg-slate-100">
                            {image ? (
                              <img
                                src={getImage(image)}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                No Img
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="max-w-[300px] truncate font-bold text-[#102033]">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.brand || "Generic"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold">{product.sku || "-"}</p>
                        <p className="text-xs text-slate-500">
                          {product.mpn || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p>{product.category || "-"}</p>
                        <p className="text-xs text-slate-500">
                          {product.subCategory || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-4 font-bold text-red-600">
                        {Number(product.stock || 0)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          Out Of Stock
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {product.allowBackorder ? (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            Allowed
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-[#2454b5] hover:bg-[#eef4ff]"
                          >
                            <Edit size={14} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={updatingId === product._id}
                            onClick={() => markInStock(product)}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            <RotateCcw size={14} />
                            {updatingId === product._id
                              ? "Updating..."
                              : "Mark In Stock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}