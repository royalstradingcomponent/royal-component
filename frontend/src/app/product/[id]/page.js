
import Link from "next/link";

import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { getProductImage } from "@/lib/getProductImage";
import { apiRequest, API_BASE } from "@/lib/api";
import {
  Star,
  Truck,
  ChevronRight,
  Info,
  Download,
  Cpu,
  ShieldCheck,
  Zap,
  Settings2,
  PackageCheck,
  FileText,
} from "lucide-react";

function getImageUrl(url) {
  if (!url) return "https://via.placeholder.com/800x800?text=No+Image";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

async function getProduct(id) {
  try {
    const data = await apiRequest(`/api/products/slug/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (data?.product) return data.product;
  } catch (error) {
    console.error("Product by slug fetch error:", error);
  }

  try {
    const data = await apiRequest(`/api/products/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    return data?.product || null;
  } catch (error) {
    console.error("Product by id fetch error:", error);
    return null;
  }
}

async function getSimilarProducts(product) {
  try {
    const query = new URLSearchParams();
    query.set("limit", "500");

    if (product?.category) {
      query.set("category", product.category);
    }

    const data = await apiRequest(`/api/products?${query.toString()}`, {
      cache: "no-store",
    });

    const items = data?.products || [];

    return items
      .filter(
        (item) =>
          String(item?._id) !== String(product?._id) &&
          String(item?.slug) !== String(product?.slug)
      )

  } catch (error) {
    console.error("Similar products fetch error:", error);
    return [];
  }
}

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStockMeta(stock) {
  const qty = Number(stock || 0);

  if (qty <= 0) {
    return {
      label: "Temporarily out of stock",
      className: "bg-[#ead9fb] text-[#4d1d95]",
      note: "Availability will be shared on request for bulk procurement.",
    };
  }

  if (qty <= 20) {
    return {
      label: "Limited stock available",
      className: "bg-[#fff3cd] text-[#7a5200]",
      note: `${qty} unit(s) ready for dispatch.`,
    };
  }

  return {
    label: "In stock",
    className: "bg-[#e2f5ea] text-[#067647]",
    note: `${qty} unit(s) available for immediate dispatch.`,
  };
}

function getPrimaryImage(product) {
  return (
    product?.thumbnail ||
    product?.images?.find((img) => img?.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    ""
  );
}

function getPerPiecePrice(product) {
  const price = Number(product?.price || 0);
  const moq = Number(product?.moq || 1);
  return moq > 1 ? price / moq : price;
}

function getIncGstPrice(value) {
  return value + value * 0.18;
}

function getBulkPricingRows(product) {
  const basePack = Number(product?.price || 0);
  const perPiece = getPerPiecePrice(product);
  const moq = Number(product?.moq || 1);

  return [
    {
      qty: `${moq} - ${moq * 19}`,
      unitPrice: perPiece,
      packPrice: basePack,
    },
    {
      qty: `${moq * 20} - ${moq * 74}`,
      unitPrice: perPiece * 0.96,
      packPrice: basePack * 0.96,
    },
    {
      qty: `${moq * 75} - ${moq * 299}`,
      unitPrice: perPiece * 0.92,
      packPrice: basePack * 0.92,
    },
    {
      qty: `${moq * 300} - ${moq * 599}`,
      unitPrice: perPiece * 0.88,
      packPrice: basePack * 0.88,
    },
    {
      qty: `${moq * 600}+`,
      unitPrice: perPiece * 0.84,
      packPrice: basePack * 0.84,
    },
  ];
}

function getFeatureCards(product) {
  return [
    {
      title: "Reliable Quality",
      desc: `${product?.brand || "Industrial"} grade component`,
      icon: ShieldCheck,
      iconWrap: "bg-[#eef4ff] text-[#2452c6]",
    },
    {
      title: "Bulk Ready",
      desc: `MOQ ${product?.moq || 1} pack ordering`,
      icon: PackageCheck,
      iconWrap: "bg-[#ecfdf3] text-[#067647]",
    },
    {
      title: "Fast Dispatch",
      desc: "Quick sourcing & shipment support",
      icon: Truck,
      iconWrap: "bg-[#fff7ed] text-[#c2410c]",
    },
    {
      title: "Technical Use",
      desc: "Ideal for PCB and industrial projects",
      icon: Cpu,
      iconWrap: "bg-[#f5f3ff] text-[#7c3aed]",
    },
  ];
}

function getQuickSpecs(product) {
  const fallbackSpecs = [
    { key: "Brand", value: product?.brand || "Generic" },
    {
      key: "Category",
      value: product?.subCategory || product?.category || "Electronic Component",
    },
    { key: "MOQ", value: `${product?.moq || 1}` },
    { key: "Unit", value: product?.unit || "piece" },
    { key: "Stock", value: `${product?.stock || 0} pcs` },
    {
      key: "Origin",
      value: product?.countryOfOrigin || "India / Imported",
    },
  ];

  if (product?.specifications?.length > 0) {
    return product.specifications.slice(0, 6);
  }

  return fallbackSpecs;
}

function getApplications(product) {
  const category = String(product?.category || "").toLowerCase();

  if (category.includes("semi")) {
    return [
      "Embedded systems and controller boards",
      "Signal communication and interface circuits",
      "Industrial automation projects",
      "Repair, maintenance and replacement sourcing",
    ];
  }

  if (category.includes("sensor")) {
    return [
      "Monitoring and detection systems",
      "Industrial automation control panels",
      "Smart electronics projects",
      "OEM and field replacement requirements",
    ];
  }

  if (category.includes("cable")) {
    return [
      "Panel wiring and industrial connections",
      "Power and signal routing applications",
      "Machine installation projects",
      "Maintenance and replacement sourcing",
    ];
  }

  return [
    "Industrial electronics and control systems",
    "PCB assembly and engineering projects",
    "OEM and institutional procurement",
    "Repair, replacement and recurring sourcing",
  ];
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams?.id);

  if (!product) {
    return {
      title: "Product Not Found | Royal Component",
    };
  }

  return {
    title: `${product.name} | Royal Component`,
    description:
      product.shortDescription ||
      product.description ||
      "Industrial and electronic component details.",
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams?.id);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product);

  const primaryImage = getPrimaryImage(product);
  const stockMeta = getStockMeta(product?.stock);

  const packPriceExGst = Number(product?.price || 0);
  const packPriceIncGst = getIncGstPrice(packPriceExGst);
  const unitPriceExGst = getPerPiecePrice(product);
  const unitPriceIncGst = getIncGstPrice(unitPriceExGst);

  const bulkRows = getBulkPricingRows(product);
  const featureCards = getFeatureCards(product);
  const quickSpecs = getQuickSpecs(product);
  const applications = getApplications(product);

  const specifications =
    product?.specifications?.length > 0
      ? product.specifications
      : [
        { key: "Brand", value: product?.brand || "Generic" },
        {
          key: "Product Type",
          value:
            product?.subCategory ||
            product?.category ||
            "Electronic Component",
        },
        { key: "Unit", value: product?.unit || "piece" },
        {
          key: "Country of Origin",
          value: product?.countryOfOrigin || "India / Imported",
        },
      ];

  const technicalDocs =
    product?.documents?.length > 0
      ? product.documents
      : [
        {
          label: "Product Datasheet",
          url: "#",
          type: "datasheet",
        },
        {
          label: "Technical Overview",
          url: "#",
          type: "document",
        },
      ];

  return (
    <div className="min-h-screen bg-[#f5fbff] text-[#1f2937]">
      <Navbar />

      <section className="mx-auto max-w-[1540px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-[#1d4ea5]">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-medium hover:underline"
          >
            <span className="text-lg">←</span>
            Back to results
          </Link>

          <span className="text-slate-300">|</span>

          <Link href="/" className="hover:underline">
            Home
          </Link>

          <ChevronRight size={16} className="text-slate-400" />
          <Link
            href={`/category/${product?.category || ""}`}
            className="hover:underline"
          >
            {product?.category || "Products"}
          </Link>

          {product?.subCategory ? (
            <>
              <ChevronRight size={16} className="text-slate-400" />
              <span>{product.subCategory}</span>
            </>
          ) : null}
        </div>

        <div className="mb-6 rounded-sm bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111827] md:text-[38px] lg:text-[42px]">
                {product?.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-[#111827]">
                <span>
                  <span className="font-bold">RS Stock No.:</span>{" "}
                  {product?.sku || product?._id?.slice?.(-6) || "RC-001"}
                </span>

                <span>
                  <span className="font-bold">Brand:</span>{" "}
                  <span className="text-[#1d4ed8]">
                    {product?.brand || "Generic"}
                  </span>
                </span>

                <span>
                  <span className="font-bold">Manufacturers Part No.:</span>{" "}
                  {product?.mpn || product?.slug || "N/A"}
                </span>
              </div>
            </div>

            <div className="text-right text-sm font-semibold text-slate-500">
              Royal Component
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_560px]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[90px_minmax(0,1fr)]">
              <div className="flex gap-4 md:flex-col">
                <div className="rounded-sm border-2 border-[#1d4ed8] bg-white p-2">
                  <img
                    src={getProductImage(product)}
                    alt={product?.name || "Product"}
                    className="h-[72px] w-[72px] object-contain"
                  />
                </div>
              </div>

              <div className="rounded-sm bg-white p-4 shadow-sm">
                <div className="flex items-center justify-center">
                  <img
                    src={getProductImage(product)}
                    alt={product?.name || "Product"}
                    className="h-[420px] w-full object-contain md:h-[560px]"
                  />
                </div>
              </div>
            </div>

            <section className="rounded-sm bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[#eef4ff] p-2 text-[#2452c6]">
                  <FileText size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[22px] font-extrabold text-[#111827]">
                    Product overview
                  </h2>
                  <p className="mt-3 text-[16px] leading-8 text-slate-700">
                    {product?.shortDescription ||
                      product?.description ||
                      "This product is suitable for industrial procurement, replacement requirements, PCB usage and bulk component sourcing. It is listed with pricing, stock visibility and technical support-ready information for faster purchasing decisions."}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {featureCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-sm border border-slate-200 bg-[#fcfcfc] p-4"
                    >
                      <div
                        className={`mb-3 inline-flex rounded-full p-3 ${item.iconWrap}`}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 className="text-[16px] font-bold text-[#111827]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-6 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <h3 className="flex items-center gap-2 text-[18px] font-extrabold text-[#2452c6]">
                    <Settings2 size={18} />
                    Quick specifications
                  </h3>

                  <div className="mt-4 overflow-hidden rounded-sm border border-slate-200">
                    {quickSpecs.map((item, index) => (
                      <div
                        key={`${item?.key}-${index}`}
                        className="grid grid-cols-2 border-t border-slate-200 first:border-t-0"
                      >
                        <div className="bg-[#fafafa] px-4 py-3 text-[15px] font-semibold text-[#111827]">
                          {item?.key}
                        </div>
                        <div className="bg-white px-4 py-3 text-[15px] text-[#111827]">
                          {item?.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-[18px] font-extrabold text-[#2452c6]">
                    <Zap size={18} />
                    Typical applications
                  </h3>

                  <div className="mt-4 rounded-sm border border-slate-200 bg-[#fcfcfc] p-4">
                    <ul className="space-y-3 text-[15px] leading-7 text-slate-700">
                      {applications.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-[18px] font-extrabold text-[#2452c6]">
                  Documents & resources
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {technicalDocs.slice(0, 4).map((doc, index) => (
                    <a
                      key={`${doc?.label}-${index}`}
                      href={doc?.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-between rounded-sm border border-slate-200 bg-white px-4 py-4 text-[15px] font-medium text-[#2452c6] transition hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-3">
                        <Download size={18} />
                        {doc?.label || "Technical Document"}
                      </span>
                      <span className="text-xs uppercase text-slate-400">
                        {doc?.type || "file"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <div className="rounded-sm bg-white p-5 shadow-sm">
              <div
                className={`inline-flex items-center rounded-full px-4 py-2 text-[15px] font-bold ${stockMeta.className}`}
              >
                <span className="mr-2 inline-block h-4 w-4 rounded-full bg-current opacity-90" />
                {stockMeta.label}
              </div>

              <ul className="mt-5 space-y-3 text-[16px] leading-7 text-[#1f2937]">
                <li>• {stockMeta.note}</li>
                <li>• Bulk quantity pricing available on request.</li>
                <li>• Dispatch timelines may vary based on stock and pack size.</li>
              </ul>

              <div className="mt-5 flex items-start gap-3 rounded-sm bg-[#f8fafc] p-3 text-[15px] text-[#065f73]">
                <Info className="mt-0.5 shrink-0" size={18} />
                <p>
                  Stock levels and delivery timelines refer to current wholesale
                  procurement availability.
                </p>
              </div>

              <button
                type="button"
                className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-2 border-2 border-[#2452c6] bg-white px-5 text-[18px] font-semibold text-[#2452c6] transition hover:bg-[#eff6ff]"
              >
                <Truck size={20} />
                Check delivery dates
              </button>
            </div>

            <div className="rounded-sm bg-white p-5 shadow-sm">
              <div className="space-y-3">
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-[28px] font-extrabold text-[#111827]">
                      {formatCurrency(packPriceExGst)}
                    </span>
                    <span className="text-[15px] text-[#111827]">
                      {formatCurrency(unitPriceExGst)} Each (In a Pack of{" "}
                      {product?.moq || 1}) (Exc. GST)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-[28px] font-bold text-slate-500">
                      {formatCurrency(packPriceIncGst)}
                    </span>
                    <span className="text-[15px] text-[#111827]">
                      {formatCurrency(unitPriceIncGst)} Each (In a Pack of{" "}
                      {product?.moq || 1}) (Inc. GST)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <AddToCartButton
                  productId={product?._id}
                  moq={product?.moq || 1}
                  showQuantity={true}
                />
              </div>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 text-[18px] font-medium text-[#2452c6] transition hover:underline"
              >
                <Star size={22} />
                Add to parts list
              </button>

              <div className="mt-6 border-t border-slate-200 pt-5 text-[15px] leading-7 text-[#111827]">
                <p>
                  <span className="font-semibold">Imported by:</span>{" "}
                  Royal Component Industrial Supplies Pvt. Ltd
                </p>
                <p className="mt-1 text-slate-700">
                  Distribution hub - Sector 67, Noida, Gautam Budh Nagar,
                  Uttar Pradesh, India
                </p>
              </div>
            </div>

            <div className="rounded-sm bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-[20px] font-extrabold text-[#111827]">
                Bulk pricing
              </h3>

              <div className="overflow-hidden rounded-sm border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-[#fafafa]">
                    <tr className="text-[17px] font-bold text-[#111827]">
                      <th className="px-5 py-4">Quantity</th>
                      <th className="px-5 py-4">Unit price</th>
                      <th className="px-5 py-4">Per Pack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-200 text-[16px] text-[#111827]"
                      >
                        <td className="px-5 py-4 font-semibold">{row.qty}</td>
                        <td className="px-5 py-4 font-semibold">
                          {formatCurrency(row.unitPrice)}
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {formatCurrency(row.packPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex h-[56px] items-center justify-center border-2 border-[#2452c6] bg-white px-5 text-[18px] font-semibold text-[#2452c6] transition hover:bg-[#eff6ff]"
              >
                View all in this category
              </button>

              <button
                type="button"
                className="inline-flex h-[56px] items-center justify-center border-2 border-[#2452c6] bg-white px-5 text-[18px] font-semibold text-[#2452c6] transition hover:bg-[#eff6ff]"
              >
                Search for similar products
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <section className="rounded-sm bg-white p-6 shadow-sm">
                <h2 className="text-[22px] font-extrabold text-[#111827]">
                  Technical Document
                </h2>

                <div className="mt-5 grid gap-3">
                  {technicalDocs.map((doc, index) => (
                    <a
                      key={`${doc?.label}-${index}`}
                      href={doc?.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-between rounded-sm border border-slate-200 px-4 py-4 text-[16px] font-medium text-[#2452c6] transition hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-3">
                        <Download size={18} />
                        {doc?.label || "Technical Document"}
                      </span>
                      <span className="text-sm uppercase text-slate-400">
                        {doc?.type || "file"}
                      </span>
                    </a>
                  ))}
                </div>
              </section>

              <section className="rounded-sm bg-white p-6 shadow-sm">
                <h2 className="text-[22px] font-extrabold text-[#111827]">
                  Specifications
                </h2>

                <div className="mt-5 overflow-hidden rounded-sm border border-slate-200">
                  {specifications.map((item, index) => (
                    <div
                      key={`${item?.key}-${index}`}
                      className="grid grid-cols-2 border-t border-slate-200 first:border-t-0"
                    >
                      <div className="bg-white px-5 py-4 text-[17px] text-[#111827]">
                        {item?.key}
                      </div>
                      <div className="bg-white px-5 py-4 text-[17px] text-[#111827]">
                        {item?.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-sm bg-white p-6 shadow-sm">
                <h2 className="text-[22px] font-extrabold text-[#111827]">
                  Product details
                </h2>

                <div className="mt-5 text-[17px] leading-9 text-[#111827]">
                  <p className="font-bold">{product?.name}</p>

                  <p className="mt-3">
                    {product?.description ||
                      product?.shortDescription ||
                      "Reliable electronic component suitable for industrial, repair, wholesale and project procurement requirements."}
                  </p>

                  <div className="mt-5 space-y-2">
                    <p>• Suitable for wholesale and repeat procurement.</p>
                    <p>• Can be used in industrial, PCB and electronics projects.</p>
                    <p>• Available in bulk quantity packs.</p>
                    <p>• Technical sourcing support available on request.</p>
                  </div>
                </div>
              </section>

              </div>

              {similarProducts.length > 0 ? (
                <section className="lg:col-span-2 rounded-sm bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-[22px] font-extrabold text-[#111827]">
                        Similar products
                      </h2>
                      <p className="mt-2 text-[16px] text-slate-600">
                        You may also be interested in these related items.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {similarProducts.slice(0, 10).map((item) => (
                      <ProductCard
                        key={item?._id || item?.slug}
                        product={item}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="rounded-sm bg-[#7f0c19] p-6 text-white shadow-sm">
                <h3 className="text-[18px] font-extrabold uppercase tracking-wide">
                  Royal Procurement Plus
                </h3>

                <p className="mt-4 text-[30px] font-extrabold leading-tight">
                  Bulk sourcing support
                </p>

                <p className="mt-3 text-[16px] leading-8 text-white/95">
                  Get quotation, BOM support, technical sourcing assistance and
                  procurement help for semiconductors, connectors, modules and
                  industrial components.
                </p>

                <ul className="mt-5 space-y-3 text-[16px] leading-7">
                  <li>• Bulk pricing for repeat buyers</li>
                  <li>• Technical document support</li>
                  <li>• Fast quotation for urgent requirements</li>
                </ul>

                <button
                  type="button"
                  className="mt-6 inline-flex h-[54px] w-full items-center justify-center bg-white px-5 text-[18px] font-bold text-[#111827] transition hover:bg-slate-100"
                >
                  Click here to find out more
                </button>
              </div>

              <div className="rounded-sm bg-white p-6 shadow-sm">
                <h3 className="text-[20px] font-extrabold text-[#111827]">
                  Need a custom quote?
                </h3>
                <p className="mt-3 text-[16px] leading-8 text-slate-600">
                  For OEM, reseller, institution and distributor requirements,
                  request custom pricing based on quantity and delivery schedule.
                </p>

                <button
                  type="button"
                  className="mt-5 inline-flex h-[52px] w-full items-center justify-center bg-[#2452c6] px-5 text-[18px] font-semibold text-white transition hover:bg-[#1e40af]"
                >
                  Request bulk quotation
                </button>
              </div>
            </div>
          </div>
      </section>

      <Footer />
    </div>
  );
}