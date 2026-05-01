const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getProductImage(product) {
  const firstImage = Array.isArray(product?.images)
    ? product.images.find((img) => img?.isPrimary) || product.images[0]
    : null;

  const raw =
    product?.thumbnail ||
    product?.image ||
    product?.imageUrl ||
    product?.mainImage ||
    firstImage?.url ||
    firstImage?.image ||
    firstImage ||
    "";

  if (!raw) {
    return `${API_BASE}/uploads/new-products/LM358.jpg`;
  }

  const clean = String(raw).trim();

  if (clean.startsWith("http")) return clean;

  if (clean.startsWith("/uploads")) {
    return `${API_BASE}${clean}`;
  }

  return `${API_BASE}/uploads/new-products/${clean}`;
}