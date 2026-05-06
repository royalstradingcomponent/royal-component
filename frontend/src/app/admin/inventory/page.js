"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src}`;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [changes, setChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadInventory = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
        keyword: search,
      });

      const data = await adminRequest(`/api/admin/inventory?${params}`);

      setInventory(data.inventory || []);
      setPages(data.pages || 1);
      setChanges({});
    } catch (error) {
      toast.error(error.message || "Inventory load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [page, search]);

  const updateChange = (id, key, value) => {
    setChanges((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: value,
      },
    }));
  };

  const getValue = (item, key) => {
    if (changes[item._id]?.[key] !== undefined) {
      return changes[item._id][key];
    }
    return item[key] ?? "";
  };

  const resetRow = (id) => {
    setChanges((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const saveRow = async (item) => {
    const payload = changes[item._id];

    if (!payload || Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      setSavingId(item._id);

      await adminRequest(`/api/admin/inventory/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success("Inventory updated");
      await loadInventory();
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Inventory</h1>
          <p className="text-sm text-slate-500">
            Update stock, price, MOQ, SKU, MPN and lead time.
          </p>
        </div>

        <button
          onClick={loadInventory}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold hover:bg-slate-50"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
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
            placeholder="Search product, SKU, MPN, brand..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No inventory found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1250px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">SKU</th>
                  <th className="px-4 py-4">MPN</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">MRP</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4">MOQ</th>
                  <th className="px-4 py-4">Lead Time</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {inventory.map((item) => {
                  const hasChanges = Boolean(changes[item._id]);

                  return (
                    <tr
                      key={item._id}
                      className={hasChanges ? "bg-blue-50/40" : "hover:bg-slate-50"}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-xl border bg-slate-100">
                            {item.image ? (
                              <img
                                src={resolveImage(item.image)}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                No Img
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate font-bold text-[#102033]">
                              {item.productName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.brand || "Generic"} • {item.category || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <input
                          value={getValue(item, "sku")}
                          onChange={(e) =>
                            updateChange(item._id, "sku", e.target.value)
                          }
                          className="input w-[150px]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          value={getValue(item, "mpn")}
                          onChange={(e) =>
                            updateChange(item._id, "mpn", e.target.value)
                          }
                          className="input w-[140px]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={getValue(item, "price")}
                          onChange={(e) =>
                            updateChange(item._id, "price", e.target.value)
                          }
                          className="input w-[110px]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={getValue(item, "mrp")}
                          onChange={(e) =>
                            updateChange(item._id, "mrp", e.target.value)
                          }
                          className="input w-[110px]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={getValue(item, "stock")}
                          onChange={(e) =>
                            updateChange(item._id, "stock", e.target.value)
                          }
                          className={`input w-[100px] ${
                            Number(getValue(item, "stock")) <= 10
                              ? "border-red-300 bg-red-50"
                              : ""
                          }`}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={getValue(item, "moq")}
                          onChange={(e) =>
                            updateChange(item._id, "moq", e.target.value)
                          }
                          className="input w-[90px]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="number"
                          value={getValue(item, "leadTimeDays")}
                          onChange={(e) =>
                            updateChange(item._id, "leadTimeDays", e.target.value)
                          }
                          className="input w-[100px]"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={getValue(item, "status")}
                          onChange={(e) =>
                            updateChange(item._id, "status", e.target.value)
                          }
                          className="input w-[130px]"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => resetRow(item._id)}
                            disabled={!hasChanges}
                            className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-40"
                          >
                            Reset
                          </button>

                          <button
                            onClick={() => saveRow(item)}
                            disabled={!hasChanges || savingId === item._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#2454b5] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            <Save size={14} />
                            {savingId === item._id ? "Saving..." : "Save"}
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

      <style jsx>{`
        .input {
          border-radius: 10px;
          border: 1px solid #d8e1ec;
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
          background: white;
        }

        .input:focus {
          border-color: #2454b5;
          box-shadow: 0 0 0 3px rgba(36, 84, 181, 0.12);
        }
      `}</style>
    </div>
  );
}