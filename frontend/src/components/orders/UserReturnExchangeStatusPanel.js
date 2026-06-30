"use client";

import {
  AlertCircle,
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ImageIcon,
  Landmark,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Truck,
  Video,
  Wallet,
} from "lucide-react";
import { API_BASE } from "@/lib/api";

const RETURN_STEPS = [
  ["Requested", "requestedAt"],
  ["Approved", "approvedAt"],
  ["Pickup Scheduled", "pickupScheduledAt"],
  ["Picked Up", "pickedUpAt"],
  ["Quality Checking", "qualityCheckedAt"],
  ["Refund Approved", "refundApprovedAt"],
  ["Completed", "completedAt"],
];

const EXCHANGE_STEPS = [
  ["Requested", "requestedAt"],
  ["Approved", "approvedAt"],
  ["Pickup Scheduled", "pickupScheduledAt"],
  ["Picked Up", "pickedUpAt"],
  ["Quality Checking", "qualityCheckedAt"],
  ["Replacement Packed", "replacementPackedAt"],
  ["Replacement Shipped", "replacementShippedAt"],
  ["Completed", "completedAt"],
];

function cleanStatus(status) {
  return status || "Not Requested";
}

function hasRequest(request) {
  return Boolean(request?.status && request.status !== "Not Requested");
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

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function resolveAsset(path) {
  if (!path) return "";
  if (String(path).startsWith("http")) return path;

  const apiRoot = String(API_BASE || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const cleanPath = String(path).replace(/^\/+/, "");

  return encodeURI(`${apiRoot}/${cleanPath}`);
}

function statusIndex(status, steps) {
  const index = steps.findIndex(([label]) => label === status);
  return index < 0 ? 0 : index;
}

function findRequestItem(order, request) {
  return (
    order?.products?.find((item) => String(item._id) === String(request?.itemId)) ||
    order?.products?.[0] ||
    {}
  );
}

function addressText(source = {}) {
  return [
    source.name,
    source.phone,
    source.addressLine1,
    source.addressLine2,
    source.city,
    source.state,
    source.pincode,
    source.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function statusPill(status, tone) {
  if (status === "Not Requested") {
    return tone === "orange"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "Rejected") return "border-red-200 bg-red-50 text-red-700";
  if (status === "Completed" || status === "Refund Approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return tone === "orange"
    ? "border-orange-200 bg-orange-50 text-orange-700"
    : "border-blue-200 bg-blue-50 text-blue-700";
}

function getRefundMessage(returnRequest) {
  if (!hasRequest(returnRequest)) return "Return request has not been submitted for this order.";

  if (returnRequest.status === "Completed") return "Return completed. Refund process is finished.";
  if (returnRequest.status === "Refund Approved") {
    return returnRequest.refundPreference?.method === "WALLET"
      ? "Refund approved. Amount will be credited to Royal Wallet."
      : "Refund approved. Bank refund usually takes 2-5 business days.";
  }
  if (["Picked Up", "Quality Checking"].includes(returnRequest.status)) {
    return "Refund will start after quality check approval.";
  }

  return "Refund will be processed after pickup and quality checking.";
}

export default function UserReturnExchangeStatusPanel({ order }) {
  if (!order) return null;

  const returnRequest = order.returnRequest || {};
  const exchangeRequest = order.exchange || {};
  const returnItem = findRequestItem(order, returnRequest);
  const exchangeItem = findRequestItem(order, exchangeRequest);
  const returnStatus = cleanStatus(returnRequest.status);
  const exchangeStatus = cleanStatus(exchangeRequest.status);

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dbe7f3] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
      <div className="border-b border-[#e5edf6] bg-gradient-to-r from-white via-[#f8fbff] to-white px-5 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#102033] md:text-3xl">
              Return & Exchange Management
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#607287]">
              Complete return and exchange information, full status timeline, uploaded evidence,
              refund preference, account details and order history.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryStatus icon={RotateCcw} label="Return Status" status={returnStatus} tone="orange" />
            <SummaryStatus icon={RefreshCcw} label="Exchange Status" status={exchangeStatus} tone="blue" />
          </div>
        </div>

        <div className="mt-5 flex gap-2 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800">
          <AlertCircle className="mt-0.5 shrink-0" size={17} />
          Only one request, return or exchange, can be active for an item at a time.
        </div>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-2">
        <RequestPanel
          type="return"
          title="Return Request"
          request={returnRequest}
          status={returnStatus}
          steps={RETURN_STEPS}
          item={returnItem}
          order={order}
        />

        <RequestPanel
          type="exchange"
          title="Exchange Request"
          request={exchangeRequest}
          status={exchangeStatus}
          steps={EXCHANGE_STEPS}
          item={exchangeItem}
          order={order}
        />
      </div>

      <div className="grid gap-5 border-t border-[#e5edf6] bg-[#fbfdff] p-5 xl:grid-cols-[1.4fr_1fr]">
        <ActionInfo returnRequest={returnRequest} exchangeRequest={exchangeRequest} />
        <OrderQuickInfo order={order} />
      </div>

      <div className="border-t border-[#dbeafe] bg-[#eff6ff] px-5 py-4 text-center text-sm font-black text-[#2454b5]">
        100% secure • All actions are logged • Real-time status updates • Complete transparency
      </div>
    </section>
  );
}

function SummaryStatus({ icon: Icon, label, status, tone }) {
  return (
    <div className={`flex min-w-[210px] items-center gap-3 rounded-[18px] border px-4 py-3 ${statusPill(status, tone)}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-wide opacity-80">{label}</p>
        <p className="mt-0.5 text-sm font-black">{status}</p>
      </div>
    </div>
  );
}

function RequestPanel({ type, title, request, status, steps, item, order }) {
  const isReturn = type === "return";
  const tone = isReturn ? "orange" : "blue";
  const Icon = isReturn ? RotateCcw : RefreshCcw;
  const active = hasRequest(request);
  const photos = request?.evidence?.photos || request?.photos || [];
  console.log("PHOTOS =>", photos);
  console.log("PHOTOS =>", photos);
  const videos = request?.evidence?.videos || request?.videos || [];

  return (
    <div className={`rounded-[22px] border bg-white ${isReturn ? "border-orange-200" : "border-blue-200"}`}>
      <div className="flex flex-col gap-3 border-b border-[#edf2f7] px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Icon className={isReturn ? "text-orange-600" : "text-blue-600"} size={22} />
          <h3 className={`text-lg font-black ${isReturn ? "text-orange-700" : "text-blue-700"}`}>
            {title}
          </h3>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${statusPill(status, tone)}`}>
          {status}
        </span>
      </div>

      <div className="space-y-4 p-4">
        <HorizontalSteps status={status} steps={steps} tone={tone} />

        {!active ? (
          <div className="rounded-[18px] border border-dashed border-[#cbd5e1] bg-[#f8fbff] p-6 text-center">
            <Icon className="mx-auto text-[#94a3b8]" size={36} />
            <h4 className="mt-3 text-lg font-black text-[#102033]">{title} not submitted</h4>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#607287]">
              When customer submits this request, complete reason, evidence, admin reply and timeline will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <DetailsCard type={type} request={request} item={item} order={order} />
              <EvidenceCard photos={photos} videos={videos} tone={tone} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {isReturn ? (
                <>
                  <RefundCard request={request} item={item} />
                  <WalletCard request={request} item={item} />
                </>
              ) : (
                <>
                  <PickupAddressCard request={request} order={order} />
                  <ReplacementShippingCard request={request} />
                </>
              )}
            </div>

            <AdminReplyCard request={request} tone={tone} />
            <HistoryCard title={`${isReturn ? "Return" : "Exchange"} History`} history={request.history || []} tone={tone} />
          </>
        )}
      </div>
    </div>
  );
}

function HorizontalSteps({ status, steps, tone }) {
  const currentIndex = status === "Not Requested" ? -1 : statusIndex(status, steps);
  const color = tone === "orange" ? "text-orange-600" : "text-blue-600";
  const activeBg = tone === "orange" ? "bg-orange-600" : "bg-blue-600";

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[680px] items-start">
        {steps.map(([label, key], index) => {
          const done = index <= currentIndex;
          const current = index === currentIndex;

          return (
            <div key={label} className="flex flex-1 items-start">
              <div className="flex min-w-[76px] flex-col items-center text-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black ${
                    done
                      ? `${activeBg} border-transparent text-white`
                      : "border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  {done ? <CheckCircle2 size={16} /> : index + 1}
                </span>
                <p className={`mt-2 text-[11px] font-black leading-4 ${current ? color : "text-slate-600"}`}>
                  {label}
                </p>
              </div>
              {index !== steps.length - 1 ? (
                <div className={`mt-4 h-[2px] flex-1 ${done ? activeBg : "bg-slate-200"}`} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoxCard({ title, icon: Icon, children, tone = "blue" }) {
  return (
    <div className="rounded-[18px] border border-[#e2e8f0] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {Icon ? (
          <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${tone === "orange" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
            <Icon size={17} />
          </span>
        ) : null}
        <h4 className="text-sm font-black uppercase tracking-wide text-[#102033]">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_10px_1fr] gap-2 text-sm leading-6">
      <span className="font-semibold text-[#607287]">{label}</span>
      <span className="font-bold text-slate-400">:</span>
      <span className="break-words font-bold text-[#102033]">{value || "-"}</span>
    </div>
  );
}

function DetailsCard({ type, request, item, order }) {
  const isReturn = type === "return";

  return (
    <BoxCard title={`${isReturn ? "Return" : "Exchange"} Details`} icon={ShieldCheck} tone={isReturn ? "orange" : "blue"}>
      <div className="space-y-1">
        <Row label="Reason Title" value={request.reasonTitle} />
        <Row label="Sub Reason" value={request.subReason} />
        <Row label="Description" value={request.description || request.comment} />
        <Row label="Item ID" value={request.itemId || item?._id} />
        {!isReturn ? <Row label="Replacement SKU" value={request.replacementSku} /> : null}
        {!isReturn ? <Row label="Replacement" value={request.replacementProductName} /> : null}
        <Row label="Quantity" value={item?.quantity || 1} />
        <Row label="Item Status" value={item?.itemStatus || order?.orderStatus} />
      </div>
    </BoxCard>
  );
}

function EvidenceCard({ photos = [], videos = [], tone }) {
  return (
    <BoxCard title="Uploaded Evidence" icon={ImageIcon} tone={tone}>
      <p className="text-sm font-bold text-[#102033]">Photos ({photos.length})</p>
      {photos.length ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {photos.slice(0, 6).map((photo, index) => (
            <a
              key={`${photo}-${index}`}
              href={resolveAsset(photo)}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-[12px] border border-[#dbe7f3] bg-[#f8fbff]"
            >
              <img
                src={resolveAsset(photo)}
                alt={`Evidence ${index + 1}`}
                className="h-20 w-full object-cover transition group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-[12px] bg-slate-50 p-3 text-sm font-semibold text-[#607287]">No photos uploaded</p>
      )}

      <p className="mt-4 text-sm font-bold text-[#102033]">Videos ({videos.length})</p>
      {videos.length ? (
        <div className="mt-2 space-y-2">
          {videos.map((video, index) => (
            <a
              key={`${video}-${index}`}
              href={resolveAsset(video)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-[12px] border border-[#dbe7f3] bg-[#f8fbff] p-3 text-sm font-bold text-[#2454b5]"
            >
              <Video size={17} />
              Open Video {index + 1}
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-[12px] bg-slate-50 p-3 text-sm font-semibold text-[#607287]">No videos uploaded</p>
      )}
    </BoxCard>
  );
}

function RefundCard({ request, item }) {
  const refund = request.refundPreference || {};

  return (
    <BoxCard title="Refund Preference" icon={Landmark} tone="orange">
      <div className="space-y-1">
        <Row label="Method" value={refund.method} />
        <Row label="Account Holder" value={refund.accountHolder} />
        <Row label="Bank Name" value={refund.bankName} />
        <Row label="Account Number" value={refund.accountNumber} />
        <Row label="IFSC Code" value={refund.ifsc} />
        <Row label="UPI ID" value={refund.upi} />
        <Row label="Refund Amount" value={money(item?.lineTotal || item?.price)} />
      </div>
      <div className="mt-3 rounded-[12px] bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">
        {getRefundMessage(request)}
      </div>
    </BoxCard>
  );
}

function WalletCard({ request, item }) {
  const refund = request.refundPreference || {};
  const selected = refund.method === "WALLET";

  return (
    <BoxCard title="Royal Wallet Option" icon={Wallet} tone="orange">
      <div className="space-y-1">
        <Row label="Wallet Balance" value={selected ? money(item?.lineTotal || item?.price) : "-"} />
        <Row label="Wallet Validity" value={selected ? `${refund.walletValidityMonths || 12} Months` : "-"} />
        <Row label="Wallet Status" value={selected ? "Active after approval" : "Not selected"} />
      </div>
      <div className={`mt-3 rounded-[12px] px-3 py-2 text-sm font-bold ${selected ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-[#607287]"}`}>
        {selected ? "Instant refund after approval in Royal Wallet." : "Customer selected bank transfer or refund method is pending."}
      </div>
    </BoxCard>
  );
}

function PickupAddressCard({ request, order }) {
  return (
    <BoxCard title="Pickup Address" icon={ShieldCheck} tone="blue">
      <p className="text-sm font-bold leading-7 text-[#102033]">
        {addressText(request.pickupAddress) || addressText(order.userInfo) || "-"}
      </p>
    </BoxCard>
  );
}

function ReplacementShippingCard({ request }) {
  const shipment = request.replacementShipment || {};

  return (
    <BoxCard title="Replacement Shipping" icon={Truck} tone="blue">
      <div className="space-y-1">
        <Row label="Courier" value={shipment.courier} />
        <Row label="Tracking ID" value={shipment.trackingId} />
        <Row label="Delivery" value={formatDate(shipment.estimatedDelivery)} />
        <Row label="Status" value={request.status} />
      </div>
      {shipment.trackingUrl ? (
        <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#2454b5]">
          Open tracking <ExternalLink size={14} />
        </a>
      ) : null}
    </BoxCard>
  );
}

function AdminReplyCard({ request, tone }) {
  const latest = request.history?.[request.history.length - 1];
  const message = request.customerMessage || request.adminRemark || latest?.message;

  if (!message) return null;

  return (
    <div className={`rounded-[18px] border p-4 ${tone === "orange" ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}`}>
      <div className="flex gap-3">
        <MessageCircle className={tone === "orange" ? "text-orange-700" : "text-blue-700"} size={22} />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#607287]">Admin Reply</p>
          <p className="mt-2 text-sm font-bold leading-7 text-[#102033]">{message}</p>
          <p className="mt-1 text-xs font-black text-[#607287]">
            Last update: {formatDate(request.updatedAt || latest?.date)}
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ title, history = [], tone }) {
  return (
    <BoxCard title={title} icon={Clock3} tone={tone}>
      {history.length ? (
        <div className="space-y-3">
          {history.map((entry, index) => (
            <div key={`${entry.status}-${index}`} className="grid gap-2 rounded-[14px] bg-[#f8fbff] p-3 text-sm md:grid-cols-[160px_1fr_90px]">
              <p className="font-black text-[#102033]">{formatDate(entry.date)}</p>
              <div>
                <p className="font-black text-[#102033]">{entry.status}</p>
                <p className="mt-1 font-semibold leading-6 text-[#607287]">{entry.message || "-"}</p>
              </div>
              <p className="font-bold text-[#607287]">{entry.by || "System"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-[12px] bg-slate-50 p-3 text-sm font-semibold text-[#607287]">No history available.</p>
      )}
    </BoxCard>
  );
}

function ActionInfo({ returnRequest, exchangeRequest }) {
  const returnActive = hasRequest(returnRequest);
  const exchangeActive = hasRequest(exchangeRequest);

  return (
    <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <PackageCheck size={22} />
            </span>
            <div>
              <h3 className="font-black text-emerald-800">Request Status</h3>
              <p className="mt-1 text-sm font-semibold text-emerald-700">
                {returnActive || exchangeActive
                  ? "Admin updates will appear here after every status change."
                  : "No active return or exchange request for this order."}
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <MiniBadge label="Return" value={cleanStatus(returnRequest?.status)} />
          <MiniBadge label="Exchange" value={cleanStatus(exchangeRequest?.status)} />
        </div>
      </div>
    </div>
  );
}

function MiniBadge({ label, value }) {
  return (
    <div className="rounded-[14px] border border-white bg-white px-4 py-3">
      <p className="text-xs font-black uppercase text-[#607287]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#102033]">{value}</p>
    </div>
  );
}

function OrderQuickInfo({ order }) {
  return (
    <div className="rounded-[18px] border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700">
        <BadgeIndianRupee size={17} />
        Order Quick Info
      </div>
      <div className="mt-3 grid gap-2 text-sm font-bold text-[#102033] md:grid-cols-2">
        <p>Order ID: {order.orderNumber || order._id}</p>
        <p>Order Date: {formatDate(order.createdAt)}</p>
        <p>Payment: {order.payment?.status || "-"}</p>
        <p>Customer: {order.userInfo?.name || "-"}</p>
        <p>Phone: {order.userInfo?.phone || "-"}</p>
        <p>Email: {order.userInfo?.email || "-"}</p>
      </div>
    </div>
  );
}
