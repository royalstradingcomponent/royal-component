export function getOrderStatusGroup(status) {
  const normalized = String(status || "").toLowerCase().trim();

  if (
    [
      "processing",
      "packed",
      "shipped",
      "out for delivery",
      "out_for_delivery",
    ].includes(normalized)
  ) {
    return "on-the-way";
  }

  if (normalized === "delivered") {
    return "delivered";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "cancelled";
  }

  return "processing";
}

export function getOrderStatusColor(status) {
  const group = getOrderStatusGroup(status);

  switch (group) {
    case "delivered":
      return "text-green-700 bg-green-50 border border-green-200";

    case "cancelled":
      return "text-red-700 bg-red-50 border border-red-200";

    case "on-the-way":
      return "text-blue-700 bg-blue-50 border border-blue-200";

    default:
      return "text-yellow-700 bg-yellow-50 border border-yellow-200";
  }
}

export function getOrderStatusLabel(status) {
  const normalized = String(status || "").toLowerCase().trim();

  const labels = {
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    "out for delivery": "Out for Delivery",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
  };

  return labels[normalized] || "Order Placed";
}

export function getPaymentStatusColor(status) {
  const value = String(status || "").toLowerCase().trim();

  if (value.includes("refunded")) {
    return "text-green-700 bg-green-50 border border-green-200";
  }

  if (value.includes("refund")) {
    return "text-sky-700 bg-sky-50 border border-sky-200";
  }

  if (value.includes("paid")) {
    return "text-green-700 bg-green-50 border border-green-200";
  }

  if (value.includes("failed")) {
    return "text-red-700 bg-red-50 border border-red-200";
  }

  return "text-yellow-700 bg-yellow-50 border border-yellow-200";
}