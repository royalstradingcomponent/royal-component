"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCcw, Search, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

const userStatuses = ["active", "inactive", "suspended"];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        search,
      });

      const data = await adminRequest(`/api/admin/customers?${params}`);

      setCustomers(data.users || []);
      setPages(data.pages || 1);
    } catch (error) {
      toast.error(error.message || "Customers load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page, search]);

  const updateStatus = async (customerId, status) => {
    try {
      setSavingId(customerId);

      await adminRequest(`/api/admin/users/${customerId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast.success("Customer status updated");
      await loadCustomers();
    } catch (error) {
      toast.error(error.message || "Status update failed");
    } finally {
      setSavingId("");
    }
  };

  const deleteCustomer = async (customerId) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      setDeletingId(customerId);

      await adminRequest(`/api/admin/users/${customerId}`, {
        method: "DELETE",
      });

      toast.success("Customer deleted");
      await loadCustomers();
    } catch (error) {
      toast.error(error.message || "Customer delete failed");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Customers</h1>
          <p className="text-sm text-slate-500">
            Manage registered customers, status and order history.
          </p>
        </div>

        <button
          onClick={loadCustomers}
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
            placeholder="Search name, email or phone..."
            className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left text-sm">
              <thead className="bg-[#f3f7fb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Addresses</th>
                  <th className="px-4 py-4">Wishlist</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Joined</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {customers.map((customer) => {
                  const customerId = customer._id || customer.id;

                  return (
                    <tr key={customerId} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4ff] text-[#2454b5]">
                            <UserRound size={22} />
                          </div>

                          <div>
                            <p className="font-bold text-[#102033]">
                              {customer.name || "Customer"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Role: {customer.role || "user"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold">{customer.email || "N/A"}</p>
                        <p className="text-xs text-slate-500">
                          {customer.phone || "No phone"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {customer.addresses?.length || 0} saved
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                          {customer.wishlist?.length || 0} products
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={customer.status || "active"}
                          disabled={savingId === customerId}
                          onChange={(e) =>
                            updateStatus(customerId, e.target.value)
                          }
                          className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#2454b5]"
                        >
                          {userStatuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/customers/${customerId}`}
                            className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            onClick={() => deleteCustomer(customerId)}
                            disabled={deletingId === customerId}
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