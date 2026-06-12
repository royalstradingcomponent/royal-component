"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, adminRequest } from "@/lib/api";

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] =
    useState(0);

  const [inventoryStats, setInventoryStats] =
    useState({
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      inventoryValue: 0,
    });
  const [deletingId, setDeletingId] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "100",
        keyword: search,
      });

      const data = await adminRequest(`/api/admin/products?${params}`);

      setProducts(data.products || []);
      setPages(data.pages || 1);

      setTotalProductsCount(
        data.total || 0
      );

      setInventoryStats({
        inStock: data.inStockProducts || 0,

        lowStock: data.lowStockProducts || 0,

        outOfStock: data.outOfStockProducts || 0,

        inventoryValue: data.totalInventoryValue || 0,
      });

    } catch (error) {
      toast.error(error.message || "Products load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to archive this product?")) return;

    try {
      setDeletingId(id);
      await adminRequest(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      toast.success("Product archived successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    } finally {
      setDeletingId("");
    }
  };

  const totalProducts =
    totalProductsCount;

  const inStockProducts =
    inventoryStats.inStock;

  const lowStockProducts =
    inventoryStats.lowStock;

  const outOfStockProducts =
    inventoryStats.outOfStock;

  const totalInventoryValue =
    inventoryStats.inventoryValue;


  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-2xl bg-white p-5 shadow-sm border">
          <p className="text-xs font-bold uppercase text-slate-500">
            Total Products
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#102033]">
            {totalProducts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border">
          <p className="text-xs font-bold uppercase text-slate-500">
            In Stock
          </p>

          <h2 className="mt-2 text-3xl font-black text-green-600">
            {inStockProducts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border">
          <p className="text-xs font-bold uppercase text-slate-500">
            Low Stock
          </p>

          <h2 className="mt-2 text-3xl font-black text-yellow-600">
            {lowStockProducts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border">
          <p className="text-xs font-bold uppercase text-slate-500">
            Out Of Stock
          </p>

          <h2 className="mt-2 text-3xl font-black text-red-600">
            {outOfStockProducts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border">
          <p className="text-xs font-bold uppercase text-slate-500">
            Inventory Value
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#7c3aed]">
            ₹{" "}
            {Number(
              totalInventoryValue || 0
            ).toLocaleString("en-IN")}
          </h2>
        </div>

      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Products</h1>
          <p className="text-sm text-slate-500">
            Manage Royal Component product catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2454b5] px-4 py-3 text-sm font-bold !text-white hover:bg-[#1d469b]"
        >
          <Plus size={18} className="!text-white" />
          <span className="!text-white">
            Add Product
          </span>
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name, SKU, MPN, brand..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">SKU / MPN</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border bg-slate-100">
                          {product.thumbnail || product.images?.[0]?.url ? (
                            <img
                              src={resolveImage(
                                product.thumbnail || product.images?.[0]?.url,
                              )}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[280px] truncate font-bold text-[#102033]">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.brand || "Generic"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold">{product.sku || "N/A"}</p>
                      <p className="text-xs text-slate-500">
                        MPN: {product.mpn || "N/A"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold">{product.category}</p>
                      <p className="text-xs text-slate-500">
                        {product.subCategory || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-bold">
                        ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-500">
                        MRP ₹ {Number(product.mrp || 0).toLocaleString("en-IN")}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${product.stockStatus === "out_of_stock"
                            ? "bg-red-100 text-red-600"
                            : product.stockStatus === "low_stock"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-600"
                            }`}
                        >
                          {Number(product.stock || 0).toLocaleString("en-IN")}{" "}
                          in stock
                        </span>

                        {product.stockStatus === "low_stock" && (
                          <span
                            className="rounded-full bg-yellow-100 px-2  py-1 text-[10px] font-bold text-yellow-700 " >
                            low stock
                          </span>
                        )}

                        {product.stockStatus === "out_of_stock" && (
                          <span
                            className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600 ">
                            out of stock
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                        {product.status || "published"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          disabled={deletingId === product._id}
                          className="rounded-lg border p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t px-4 py-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-sm text-slate-500">
            Page <b>{page}</b> of <b>{pages}</b>
          </p>

          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>

  );
}
