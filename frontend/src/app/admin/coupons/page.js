"use client";

import { useEffect, useState } from "react";
import { Gift, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

const emptyForm = {
  code: "",
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxDiscount: "",
  isActive: true,
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminRequest("/api/admin/coupons");
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(error.message || "Coupons load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const filteredCoupons = coupons.filter((coupon) => {
    const q = search.toLowerCase();

    return (
      coupon.code?.toLowerCase().includes(q) ||
      coupon.title?.toLowerCase().includes(q) ||
      coupon.description?.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditId("");
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditId(coupon._id);

    setForm({
      code: coupon.code || "",
      title: coupon.title || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue ?? "",
      minOrderAmount: coupon.minOrderAmount ?? "",
      maxDiscount: coupon.maxDiscount ?? "",
      isActive: coupon.isActive !== false,
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
        : "",
    });

    setModalOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.code || !form.title || !form.discountValue) {
      toast.error("Code, title and discount value are required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        code: String(form.code).toUpperCase().trim(),
        title: form.title,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscount: Number(form.maxDiscount || 0),
        isActive: Boolean(form.isActive),
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
      };

      if (editId) {
        await adminRequest(`/api/admin/coupons/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        toast.success("Coupon updated successfully");
      } else {
        await adminRequest("/api/admin/coupons", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        toast.success("Coupon created successfully");
      }

      setModalOpen(false);
      await loadCoupons();
    } catch (error) {
      toast.error(error.message || "Coupon save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      setDeletingId(id);

      await adminRequest(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      toast.success("Coupon deleted");
      await loadCoupons();
    } catch (error) {
      toast.error(error.message || "Coupon delete failed");
    } finally {
      setDeletingId("");
    }
  };

  const isExpired = (coupon) => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt).getTime() < Date.now();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Coupons</h1>
          <p className="text-sm text-slate-500">
            Create and manage discount coupons for Royal Component.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2454b5] px-4 py-3 text-sm font-bold text-white hover:bg-[#1d469b]"
        >
          <Plus size={18} />
          Add Coupon
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon code, title..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading coupons...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No coupons found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Coupon</th>
                  <th className="px-4 py-4">Discount</th>
                  <th className="px-4 py-4">Min Order</th>
                  <th className="px-4 py-4">Max Discount</th>
                  <th className="px-4 py-4">Expiry</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredCoupons.map((coupon) => {
                  const expired = isExpired(coupon);

                  return (
                    <tr key={coupon._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2454b5]">
                            <Gift size={22} />
                          </div>

                          <div>
                            <p className="font-bold text-[#102033]">
                              {coupon.code}
                            </p>
                            <p className="text-sm font-semibold">
                              {coupon.title}
                            </p>
                            {coupon.description ? (
                              <p className="max-w-[320px] truncate text-xs text-slate-500">
                                {coupon.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹ ${Number(
                                coupon.discountValue || 0
                              ).toLocaleString("en-IN")}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          {coupon.discountType}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        ₹ {Number(coupon.minOrderAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-4">
                        {Number(coupon.maxDiscount || 0) > 0
                          ? `₹ ${Number(coupon.maxDiscount).toLocaleString("en-IN")}`
                          : "No limit"}
                      </td>

                      <td className="px-4 py-4">
                        {coupon.expiresAt ? (
                          <div>
                            <p className="font-semibold">
                              {new Date(coupon.expiresAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                            {expired && (
                              <p className="text-xs font-bold text-red-600">
                                Expired
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">No expiry</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            coupon.isActive && !expired
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {coupon.isActive && !expired ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(coupon)}
                            className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => deleteCoupon(coupon._id)}
                            disabled={deletingId === coupon._id}
                            className="rounded-lg border p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
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

      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#102033]">
                  {editId ? "Edit Coupon" : "Add Coupon"}
                </h2>
                <p className="text-sm text-slate-500">
                  Create coupon code for cart discount.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border p-2"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Coupon Code">
                  <input
                    className="input uppercase"
                    value={form.code}
                    onChange={(e) => updateForm("code", e.target.value)}
                    placeholder="WELCOME10"
                  />
                </Field>

                <Field label="Title">
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="Welcome Discount"
                  />
                </Field>

                <Field label="Discount Type">
                  <select
                    className="input"
                    value={form.discountType}
                    onChange={(e) =>
                      updateForm("discountType", e.target.value)
                    }
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </Field>

                <Field label="Discount Value">
                  <input
                    type="number"
                    className="input"
                    value={form.discountValue}
                    onChange={(e) =>
                      updateForm("discountValue", e.target.value)
                    }
                    placeholder="10"
                  />
                </Field>

                <Field label="Min Order Amount">
                  <input
                    type="number"
                    className="input"
                    value={form.minOrderAmount}
                    onChange={(e) =>
                      updateForm("minOrderAmount", e.target.value)
                    }
                    placeholder="1000"
                  />
                </Field>

                <Field label="Max Discount">
                  <input
                    type="number"
                    className="input"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      updateForm("maxDiscount", e.target.value)
                    }
                    placeholder="500"
                  />
                </Field>

                <Field label="Expiry Date">
                  <input
                    type="date"
                    className="input"
                    value={form.expiresAt}
                    onChange={(e) => updateForm("expiresAt", e.target.value)}
                  />
                </Field>

                <Field label="Status">
                  <label className="flex h-[46px] items-center gap-2 rounded-xl border px-4 text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        updateForm("isActive", e.target.checked)
                      }
                    />
                    Active Coupon
                  </label>
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Get discount on industrial components order."
                />
              </Field>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border px-5 py-3 text-sm font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>

            <style jsx>{`
              .input {
                width: 100%;
                border-radius: 12px;
                border: 1px solid #d8e1ec;
                padding: 12px 14px;
                font-size: 14px;
                outline: none;
                background: white;
              }
              .input:focus {
                border-color: #2454b5;
                box-shadow: 0 0 0 3px rgba(36, 84, 181, 0.12);
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}