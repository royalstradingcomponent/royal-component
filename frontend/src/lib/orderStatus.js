export function getOrderStatusGroup(status) {
  const normalized = String(status || "").toLowerCase().trim();

  if (
    ["processing", "packed", "shipped", "out for delivery"].includes(normalized)
  ) {
    return "on-the-way";
  }

  if (normalized === "delivered") return "delivered";
  if (normalized === "cancelled") return "cancelled";

  return "processing";
}

export function getOrderStatusColor(status) {
  const group = getOrderStatusGroup(status);

  switch (group) {
    case "delivered":
      return "text-green-700 bg-green-50 border-green-200";
    case "cancelled":
      return "text-red-700 bg-red-50 border-red-200";
    case "on-the-way":
      return "text-blue-700 bg-blue-50 border-blue-200";
    default:
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
  }
}

export function getOrderStatusLabel(status) {
  return status || "Order Placed";
}