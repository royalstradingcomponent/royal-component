"use client";

import { API_BASE } from "@/lib/api";
import { PackageCheck, Boxes } from "lucide-react";

function getImageUrl(url) {
  if (!url) return "";

  const cleanUrl = String(url).trim();

  if (cleanUrl.startsWith("http")) return cleanUrl;
  if (cleanUrl.startsWith("/")) return `${API_BASE}${cleanUrl}`;

  return `${API_BASE}/${cleanUrl}`;
}

function getItemName(item) {
  return (
    item?.name ||
    item?.productName ||
    item?.title ||
    item?.productTitle ||
    item?.nameSnapshot ||
    item?.product?.name ||
    item?.product?.title ||
    "Industrial Component"
  );
}

function getItemImage(item) {
  return (
    item?.image ||
    item?.img ||
    item?.thumbnail ||
    item?.productImage ||
    item?.imageUrl ||
    item?.thumbnailSnapshot ||
    item?.product?.thumbnail ||
    item?.product?.image ||
    item?.product?.img ||
    item?.product?.images?.find((img) => img?.isPrimary)?.url ||
    item?.product?.images?.[0]?.url ||
    item?.images?.find((img) => img?.isPrimary)?.url ||
    item?.images?.[0]?.url ||
    ""
  );
}

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getItemPrice(item) {
  return (
    item?.lineTotal ||
    item?.lineSubtotal ||
    item?.total ||
    item?.price ||
    item?.sellingPrice ||
    item?.unitPrice ||
    0
  );
}

function getItemQty(item) {
  return item?.qty || item?.quantity || 1;
}

export default function OrderSupportCard({ order }) {
  if (!order) return null;

  const items = order?.items || order?.products || [];

  return (
    <div className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <PackageCheck size={20} className="text-[#2454b5]" />
        <div>
          <p className="font-black text-[#102033]">
            Order #{order?.orderNumber || order?.orderId || order?._id}
          </p>
          <p className="text-xs text-[#607287]">
            {order?.orderStatus || order?.status || "Order Placed"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl bg-[#f8fbff] p-3 text-sm font-semibold text-[#607287]">
            Product details are not available.
          </p>
        ) : (
          items.map((item, index) => {
            const image = getItemImage(item);
            const qty = getItemQty(item);
            const price = getItemPrice(item);

            return (
              <div
                key={item?._id || item?.id || index}
                className="flex gap-3 rounded-xl bg-[#f8fbff] p-3"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                  {image ? (
                    <img
                      src={getImageUrl(image)}
                      alt={getItemName(item)}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <Boxes size={26} className="text-[#2454b5]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-black text-[#102033]">
                    {getItemName(item)}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#607287]">
                    {item?.brand ? <span>Brand: {item.brand}</span> : null}
                    {item?.sku ? <span>SKU: {item.sku}</span> : null}
                    {item?.mpn ? <span>MPN: {item.mpn}</span> : null}
                    <span>Qty: {qty}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#eaf3ff] px-3 py-1 text-xs font-extrabold text-[#2454b5]">
                      {item?.itemStatus ||
                        item?.status ||
                        order?.orderStatus ||
                        order?.status ||
                        "Order Placed"}
                    </span>

                    {price ? (
                      <span className="text-sm font-black text-[#102033]">
                        {formatCurrency(price)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}