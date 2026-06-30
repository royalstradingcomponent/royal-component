"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ImageIcon,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Truck,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest, API_BASE } from "@/lib/api";

const statuses = [
  "ALL",
  "Requested",
  "Approved",
  "Rejected",
  "Pickup Scheduled",
  "Picked Up",
  "Quality Checking",
  "Refund Approved",
  "Completed",
];

const adminStatuses = statuses.filter((status) => status !== "ALL");

function resolveAsset(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
 return `${API_BASE}/${String(path).replace(/^\/+/, "")}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status) {
  if (status === "Completed") return "border-green-200 bg-green-100 text-green-700";
  if (status === "Rejected") return "border-red-200 bg-red-100 text-red-700";
  if (status === "Requested") return "border-amber-200 bg-amber-100 text-amber-700";
  if (status === "Refund Approved") return "border-emerald-200 bg-emerald-100 text-emerald-700";
  return "border-blue-200 bg-blue-100 text-[#2454b5]";
}

function getReturnItem(order) {
  const itemId = order?.returnRequest?.itemId;
  return (
    order?.products?.find((product) => String(product._id) === String(itemId)) ||
    order?.products?.[0] ||
    {}
  );
}

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
  status: "Approved",
  adminRemark: "",
  customerMessage: "",
});

  const loadRequests = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (status !== "ALL") query.set("status", status);

      const data = await adminRequest(`/api/orders/admin/returns?${query.toString()}`);
      setRequests(data.requests || []);
    } catch (error) {
      toast.error(error.message || "Return requests load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [status]);

 const openRequest = (order) => {
  const itemId =
    order?.returnRequest?.itemId ||
    order?.products?.[0]?._id;

 window.location.href = `/admin/returns/${order._id}?itemId=${itemId}`;
};
  const saveReturn = async () => {
    if (!selected?._id) return;

    try {
      setSaving(true);

      const data = await adminRequest(`/api/orders/admin/returns/status/${selected._id}`, {
        method: "PUT",
      body: JSON.stringify({
  status: form.status,
  adminRemark: form.adminRemark,
  customerMessage: form.customerMessage,
}),
      });

      toast.success(data.message || "Return updated");
      setSelected(data.order || selected);
      await loadRequests();
    } catch (error) {
      toast.error(error.message || "Return update failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredRequests = useMemo(() => requests, [requests]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-orange-700">
            <RotateCcw size={15} />
            Return Control
          </div>
          <h1 className="mt-3 text-3xl font-black text-[#102033]">Return Requests</h1>
          <p className="mt-2 text-sm font-semibold text-[#607287]">
            Customer return reason, proof, approval, pickup, quality check and refund status control.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#2454b5] px-5 text-sm font-black text-white shadow-lg"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      <div className="rounded-[22px] border border-[#dbe7f3] bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px_120px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#607287]" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") loadRequests();
              }}
              placeholder="Search order, customer, phone, product or reason"
              className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#2454b5]"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-12 rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-black text-[#102033] outline-none focus:border-[#2454b5]"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadRequests}
            className="h-12 rounded-[14px] border border-[#2454b5] bg-white text-sm font-black text-[#2454b5]"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="space-y-4">
          {loading ? (
            <div className="rounded-[22px] border border-[#dbe7f3] bg-white p-8 text-center font-bold text-[#607287]">
              Loading return requests...
            </div>
          ) : null}

          {!loading && !filteredRequests.length ? (
            <div className="rounded-[22px] border border-dashed border-[#b8cce4] bg-white p-10 text-center">
              <RotateCcw className="mx-auto text-[#2454b5]" size={42} />
              <h2 className="mt-4 text-xl font-black text-[#102033]">No return requests</h2>
              <p className="mt-2 text-sm font-semibold text-[#607287]">
                New return requests will appear here.
              </p>
            </div>
          ) : null}

          {filteredRequests.map((order) => {
            const item = getReturnItem(order);
            const photos = order.returnRequest?.evidence?.photos || order.returnRequest?.photos || [];
            const videos = order.returnRequest?.evidence?.videos || order.returnRequest?.videos || [];

            return (
              <button
                type="button"
                key={order._id}
                onClick={() => openRequest(order)}
                className={`block w-full overflow-hidden rounded-[22px] border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${
                  selected?._id === order._id ? "border-[#2454b5]" : "border-[#dbe7f3]"
                }`}
              >
                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#dbe7f3] bg-[#f8fbff] p-2">
                    {item?.img ? (
                      <img src={resolveAsset(item.img)} alt={item.name} className="h-full w-full object-contain" />
                    ) : (
                      <PackageCheck className="text-[#94a3b8]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-[#102033]">{order.orderNumber}</p>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusClass(order.returnRequest?.status)}`}>
                        {order.returnRequest?.status}
                      </span>
                    </div>
                    <h3 className="mt-2 line-clamp-1 text-lg font-black text-[#102033]">
                      {item?.name || "Industrial Component"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#607287]">
                      {order.userInfo?.name} | {order.userInfo?.phone}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                        {order.returnRequest?.reasonTitle || "Return Requested"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {photos.length} photos | {videos.length} videos
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-[#607287] lg:text-right">
                    <p>Requested</p>
                    <p className="mt-1 font-black text-[#102033]">
                      {formatDate(order.returnRequest?.requestedAt)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <aside className="xl:sticky xl:top-20 xl:self-start">
          {!selected ? (
            <div className="rounded-[24px] border border-[#dbe7f3] bg-white p-8 text-center shadow-sm">
              <ShieldCheck className="mx-auto text-[#2454b5]" size={42} />
              <h2 className="mt-4 text-xl font-black text-[#102033]">Select a return request</h2>
              <p className="mt-2 text-sm font-semibold text-[#607287]">
                Customer details, uploaded proof and admin controls will open here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-[#dbe7f3] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-3 border-b border-[#e2ebf6] bg-gradient-to-r from-[#fff7ed] to-white p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-orange-700">
                    Return Control
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#102033]">
                    {selected.orderNumber}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa]"
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[calc(100vh-170px)] space-y-5 overflow-y-auto p-5">
                <InfoBlock title="Customer">
                  <p className="font-black text-[#102033]">{selected.userInfo?.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#607287]">
                    {selected.userInfo?.phone} | {selected.userInfo?.email || "-"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#607287]">
                    {[
                      selected.userInfo?.addressLine1,
                      selected.userInfo?.addressLine2,
                      selected.userInfo?.city,
                      selected.userInfo?.state,
                      selected.userInfo?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </InfoBlock>

                <InfoBlock title="Return Reason">
                  <p className="font-black text-[#102033]">
                    {selected.returnRequest?.reasonTitle || "-"}
                  </p>
                  {selected.returnRequest?.subReason ? (
                    <p className="mt-1 text-sm font-bold text-[#2454b5]">
                      {selected.returnRequest.subReason}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-[#607287]">
                    {selected.returnRequest?.description ||
                      selected.returnRequest?.comment ||
                      "No description"}
                  </p>
                </InfoBlock>

                <InfoBlock title="Uploaded Evidence">
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      selected.returnRequest?.evidence?.photos ||
                      selected.returnRequest?.photos ||
                      []
                    ).map((photo, index) => (
                      <a
                        key={`${photo}-${index}`}
                        href={resolveAsset(photo)}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff]"
                      >
                        <img
                          src={resolveAsset(photo)}
                          alt={`Return evidence ${index + 1}`}
                          className="h-28 w-full object-cover transition group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>

                  {(selected.returnRequest?.evidence?.photos || selected.returnRequest?.photos || []).length === 0 ? (
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#607287]">
                      <ImageIcon size={17} />
                      No photos uploaded
                    </p>
                  ) : null}

                  <div className="mt-3 space-y-3">
                    {(
                      selected.returnRequest?.evidence?.videos ||
                      selected.returnRequest?.videos ||
                      []
                    ).map((video, index) => (
                      <video key={`${video}-${index}`} controls className="w-full rounded-[14px] border border-[#dbe7f3]">
                        <source src={resolveAsset(video)} />
                      </video>
                    ))}
                  </div>

                  {(selected.returnRequest?.evidence?.videos || selected.returnRequest?.videos || []).length === 0 ? (
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#607287]">
                      <Video size={17} />
                      No video uploaded
                    </p>
                  ) : null}
                </InfoBlock>

                <InfoBlock title="Refund Method">
  <p className="font-black text-[#102033]">
    {selected.returnRequest?.refundPreference?.method || "-"}
  </p>

  {selected.returnRequest?.refundPreference?.method === "BANK" ? (
    <div className="mt-3 grid gap-2 text-sm font-semibold text-[#607287]">
      <p>
        Account Holder:{" "}
        {selected.returnRequest.refundPreference.accountHolder || "-"}
      </p>
      <p>
        Bank Name: {selected.returnRequest.refundPreference.bankName || "-"}
      </p>
      <p>
        Account Number:{" "}
        {selected.returnRequest.refundPreference.accountNumber || "-"}
      </p>
      <p>IFSC: {selected.returnRequest.refundPreference.ifsc || "-"}</p>
      <p>UPI: {selected.returnRequest.refundPreference.upi || "-"}</p>
    </div>
  ) : null}

  {selected.returnRequest?.refundPreference?.method === "WALLET" ? (
    <div className="mt-3 rounded-[14px] border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-700">
      Royal Trading Wallet selected. Validity:{" "}
      {selected.returnRequest.refundPreference.walletValidityMonths || 12} months.
    </div>
  ) : null}
</InfoBlock>

                <InfoBlock title="Admin Update">
                  <div className="space-y-3">
                    <Field label="Return Status">
                      <select
                        value={form.status}
                        onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                        className="h-12 w-full rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 text-sm font-black outline-none focus:border-[#2454b5]"
                      >
                        {adminStatuses.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Admin Note">
                      <textarea
                        rows={4}
                        value={form.adminRemark}
                        onChange={(event) => setForm((prev) => ({ ...prev, adminRemark: event.target.value }))}
                        placeholder="Approval, rejection, pickup, quality check or refund note"
                        className="w-full resize-none rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                      />
                    </Field>

                    <Field label="Message to Customer">
  <textarea
    rows={4}
    value={form.customerMessage}
    onChange={(event) =>
      setForm((prev) => ({
        ...prev,
        customerMessage: event.target.value,
      }))
    }
    placeholder="Example: Your return pickup will be completed in 1-2 days."
    className="w-full resize-none rounded-[14px] border border-[#d8e3f0] bg-[#f8fbff] px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
  />
</Field>
                  </div>
                </InfoBlock>

                <InfoBlock title="Return Timeline">
                  <div className="space-y-3">
                    {[
                      { label: "Requested", date: selected.returnRequest?.requestedAt, icon: Clock3 },
                      { label: "Approved", date: selected.returnRequest?.approvedAt, icon: CheckCircle2 },
                      { label: "Pickup Scheduled", date: selected.returnRequest?.pickupScheduledAt, icon: Truck },
                      { label: "Picked Up", date: selected.returnRequest?.pickedUpAt, icon: PackageCheck },
                      { label: "Quality Checking", date: selected.returnRequest?.qualityCheckedAt, icon: ShieldCheck },
                      { label: "Completed", date: selected.returnRequest?.completedAt, icon: CheckCircle2 },
                    ].map((step) => {
                      const Icon = step.icon;

                      return (
                        <div key={step.label} className="flex items-center gap-3 rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${step.date ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                            <Icon size={17} />
                          </span>
                          <div>
                            <p className="text-sm font-black text-[#102033]">{step.label}</p>
                            <p className="text-xs font-bold text-[#607287]">{formatDate(step.date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </InfoBlock>

                <InfoBlock title="Status History">
                  <div className="space-y-3">
                    {(selected.returnRequest?.history || []).length ? (
                      selected.returnRequest.history.map((entry, index) => (
                        <div key={`${entry.status}-${index}`} className="rounded-[14px] border border-[#dbe7f3] bg-[#f8fbff] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-black text-[#102033]">{entry.status}</p>
                            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#607287]">
                              {entry.by || "Admin"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-[#607287]">
                            {entry.message}
                          </p>
                          <p className="mt-2 text-xs font-bold text-[#94a3b8]">
                            {formatDate(entry.date)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#607287]">
                        <AlertCircle size={17} />
                        No history yet
                      </p>
                    )}
                  </div>
                </InfoBlock>

                <button
                  type="button"
                  onClick={saveReturn}
                  disabled={saving}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-orange-600 to-[#2454b5] text-sm font-black text-white shadow-[0_12px_28px_rgba(36,84,181,0.25)] disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Return Update"}
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <section className="rounded-[18px] border border-[#dbe7f3] bg-white p-4">
      <h3 className="mb-3 text-xs font-black uppercase tracking-wide text-[#607287]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#607287]">
        {label}
      </span>
      {children}
    </label>
  );
}