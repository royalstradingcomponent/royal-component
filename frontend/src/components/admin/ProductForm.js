"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

const emptyProduct = {
  name: "",
  sku: "",
  mpn: "",
  brand: "",
  category: "",
  subCategory: "",
  shortDescription: "",
  description: "",
  thumbnail: "",
  price: "",
  mrp: "",
  stock: "",
  moq: "1",
  unit: "piece",
  leadTimeDays: "0",
  countryOfOrigin: "India",
  warranty: "",
  status: "published",
  isFeatured: false,
  isBestSeller: false,
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export function ProductForm({ mode = "add", productId = "" }) {
  const router = useRouter();

  const [form, setForm] = useState(emptyProduct);
  const [images, setImages] = useState([{ url: "", altText: "", isPrimary: true }]);
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [documents, setDocuments] = useState([
    { label: "Datasheet", url: "", type: "datasheet" },
  ]);

  const [highlights, setHighlights] = useState([
  { title: "", description: "", icon: "ShieldCheck", order: 0, isActive: true },
]);

const [applications, setApplications] = useState([
  { text: "", order: 0, isActive: true },
]);

const [customSections, setCustomSections] = useState([
  {
    title: "",
    content: "",
    image: "",
    buttonText: "",
    buttonLink: "",
    type: "text",
    order: 0,
    isActive: true,
  },
]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");

  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadAdminFile = async (file, type = "products") => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const data = await adminRequest("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    return data.file?.url || "";
  };

  const uploadProductImage = async (index, file) => {
    try {
      setUploadingImage(true);

      const url = await uploadAdminFile(file, "products");

      if (!url) {
        toast.error("Image upload failed");
        return;
      }

      updateImage(index, "url", url);

      if (!form.thumbnail || images[index]?.isPrimary) {
        updateForm("thumbnail", url);
      }

      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadProduct = async () => {
    if (mode !== "edit" || !productId) return;

    try {
      setLoading(true);
      const data = await adminRequest(`/api/admin/products?limit=1&keyword=${productId}`);
      let product = data.products?.find((p) => p._id === productId);

      if (!product) {
        const all = await adminRequest(`/api/admin/products?limit=200`);
        product = all.products?.find((p) => p._id === productId);
      }

      if (!product) {
        toast.error("Product not found");
        return;
      }

      setForm({
        name: product.name || "",
        sku: product.sku || "",
        mpn: product.mpn || "",
        brand: product.brand || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        thumbnail: product.thumbnail || "",
        price: product.price ?? "",
        mrp: product.mrp ?? "",
        stock: product.stock ?? "",
        moq: product.moq ?? "1",
        unit: product.unit || "piece",
        leadTimeDays: product.leadTimeDays ?? "0",
        countryOfOrigin: product.countryOfOrigin || "India",
        warranty: product.warranty || "",
        status: product.status || "published",
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),
        isActive: product.isActive !== false,
        metaTitle: product.seo?.metaTitle || "",
        metaDescription: product.seo?.metaDescription || "",
        metaKeywords: product.seo?.metaKeywords?.join(", ") || "",
      });

      setImages(
        product.images?.length
          ? product.images
          : [{ url: product.thumbnail || "", altText: "", isPrimary: true }]
      );

      setSpecifications(
        product.specifications?.length
          ? product.specifications
          : [{ key: "", value: "" }]
      );

      setDocuments(
        product.documents?.length
          ? product.documents
          : [{ label: "Datasheet", url: "", type: "datasheet" }]
      );

      setHighlights(
  product.highlights?.length
    ? product.highlights
    : [{ title: "", description: "", icon: "ShieldCheck", order: 0, isActive: true }]
);

setApplications(
  product.applications?.length
    ? product.applications
    : [{ text: "", order: 0, isActive: true }]
);

setCustomSections(
  product.customSections?.length
    ? product.customSections
    : [
        {
          title: "",
          content: "",
          image: "",
          buttonText: "",
          buttonLink: "",
          type: "text",
          order: 0,
          isActive: true,
        },
      ]
);

    } catch (error) {
      toast.error(error.message || "Product load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const addImage = () => {
    setImages((prev) => [...prev, { url: "", altText: "", isPrimary: false }]);
  };

  const updateImage = (index, key, value) => {
    setImages((prev) =>
      prev.map((item, i) => {
        if (key === "isPrimary") {
          return { ...item, isPrimary: i === index };
        }
        return i === index ? { ...item, [key]: value } : item;
      })
    );
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateSpec = (index, key, value) => {
    setSpecifications((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeSpec = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const addDocument = () => {
    setDocuments((prev) => [...prev, { label: "", url: "", type: "other" }]);
  };

  const updateDocument = (index, key, value) => {
    setDocuments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
  setHighlights((prev) => [
    ...prev,
    { title: "", description: "", icon: "ShieldCheck", order: prev.length, isActive: true },
  ]);
};

const updateHighlight = (index, key, value) => {
  setHighlights((prev) =>
    prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
  );
};

const removeHighlight = (index) => {
  setHighlights((prev) => prev.filter((_, i) => i !== index));
};

const addApplication = () => {
  setApplications((prev) => [
    ...prev,
    { text: "", order: prev.length, isActive: true },
  ]);
};

const updateApplication = (index, key, value) => {
  setApplications((prev) =>
    prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
  );
};

const removeApplication = (index) => {
  setApplications((prev) => prev.filter((_, i) => i !== index));
};

const addCustomSection = () => {
  setCustomSections((prev) => [
    ...prev,
    {
      title: "",
      content: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      type: "text",
      order: prev.length,
      isActive: true,
    },
  ]);
};

const updateCustomSection = (index, key, value) => {
  setCustomSections((prev) =>
    prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
  );
};

const removeCustomSection = (index) => {
  setCustomSections((prev) => prev.filter((_, i) => i !== index));
};

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      toast.error("Product name and category required");
      return;
    }

    try {
      setSaving(true);

      const cleanImages = images
        .filter((img) => img.url)
        .map((img, index) => ({
          url: img.url,
          altText: img.altText || form.name,
          isPrimary: Boolean(img.isPrimary),
          order: index,
        }));

      const payload = {
        ...form,
        images: cleanImages,
        thumbnail:
          form.thumbnail ||
          cleanImages.find((img) => img.isPrimary)?.url ||
          cleanImages[0]?.url ||
          "",
        specifications: specifications.filter((s) => s.key && s.value),
        documents: documents.filter((d) => d.label && d.url),

        highlights: highlights
  .filter((h) => h.title || h.description)
  .map((h, index) => ({
    ...h,
    order: Number(h.order || index),
    isActive: h.isActive !== false,
  })),

applications: applications
  .filter((a) => a.text)
  .map((a, index) => ({
    ...a,
    order: Number(a.order || index),
    isActive: a.isActive !== false,
  })),

customSections: customSections
  .filter((s) => s.title || s.content || s.image)
  .map((s, index) => ({
    ...s,
    order: Number(s.order || index),
    isActive: s.isActive !== false,
  })),

        metaKeywords: form.metaKeywords,
      };

      if (mode === "edit") {
        await adminRequest(`/api/admin/products/${productId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        toast.success("Product updated successfully");
      } else {
        await adminRequest("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        toast.success("Product created successfully");
      }

      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6">Loading product...</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#102033]">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-sm text-slate-500">
          Manage industrial components, pricing, stock, specifications and datasheets.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Basic Information</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product Name">
            <input className="input" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
          </Field>

          <Field label="Brand">
            <input className="input" value={form.brand} onChange={(e) => updateForm("brand", e.target.value)} />
          </Field>

          <Field label="SKU">
            <input className="input" value={form.sku} onChange={(e) => updateForm("sku", e.target.value)} />
          </Field>

          <Field label="MPN">
            <input className="input" value={form.mpn} onChange={(e) => updateForm("mpn", e.target.value)} />
          </Field>

          <Field label="Category">
            <input className="input" value={form.category} onChange={(e) => updateForm("category", e.target.value)} placeholder="semiconductors" />
          </Field>

          <Field label="Sub Category">
            <input className="input" value={form.subCategory} onChange={(e) => updateForm("subCategory", e.target.value)} placeholder="amplifierscomparators" />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Pricing & Inventory</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Price">
            <input type="number" className="input" value={form.price} onChange={(e) => updateForm("price", e.target.value)} />
          </Field>

          <Field label="MRP">
            <input type="number" className="input" value={form.mrp} onChange={(e) => updateForm("mrp", e.target.value)} />
          </Field>

          <Field label="Stock">
            <input type="number" className="input" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} />
          </Field>

          <Field label="MOQ">
            <input type="number" className="input" value={form.moq} onChange={(e) => updateForm("moq", e.target.value)} />
          </Field>

          <Field label="Unit">
            <input className="input" value={form.unit} onChange={(e) => updateForm("unit", e.target.value)} />
          </Field>

          <Field label="Lead Time Days">
            <input type="number" className="input" value={form.leadTimeDays} onChange={(e) => updateForm("leadTimeDays", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Description</h2>

        <div className="grid gap-4">
          <Field label="Short Description">
            <textarea className="input min-h-[90px]" value={form.shortDescription} onChange={(e) => updateForm("shortDescription", e.target.value)} />
          </Field>

          <Field label="Full Description">
            <textarea className="input min-h-[150px]" value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Images</h2>
          <button type="button" onClick={addImage} className="btn-muted">
            <Plus size={16} /> Add Image
          </button>
        </div>

        <Field label="Thumbnail URL">
          <input className="input" value={form.thumbnail} onChange={(e) => updateForm("thumbnail", e.target.value)} />
        </Field>

        <div className="mt-4 space-y-3">
          {images.map((img, index) => (
            <div key={index} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_auto_auto]">
              <div className="space-y-2">
                <input
                  className="input"
                  placeholder="Image URL"
                  value={img.url}
                  onChange={(e) => updateImage(index, "url", e.target.value)}
                />

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">
                  <UploadCloud size={15} />
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingImage}
                    onChange={(e) => uploadProductImage(index, e.target.files?.[0])}
                  />
                </label>
              </div>              <input className="input" placeholder="Alt text" value={img.altText || ""} onChange={(e) => updateImage(index, "altText", e.target.value)} />

              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="radio" checked={Boolean(img.isPrimary)} onChange={() => updateImage(index, "isPrimary", true)} />
                Primary
              </label>

              <button type="button" onClick={() => removeImage(index)} className="rounded-lg border p-2 text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Specifications</h2>
          <button type="button" onClick={addSpec} className="btn-muted">
            <Plus size={16} /> Add Spec
          </button>
        </div>

        <div className="space-y-3">
          {specifications.map((spec, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input className="input" placeholder="Key e.g. Voltage" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} />
              <input className="input" placeholder="Value e.g. 5V" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} />
              <button type="button" onClick={() => removeSpec(index)} className="rounded-lg border p-2 text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Documents</h2>
          <button type="button" onClick={addDocument} className="btn-muted">
            <Plus size={16} /> Add Document
          </button>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_160px_auto]">
              <input className="input" placeholder="Label" value={doc.label} onChange={(e) => updateDocument(index, "label", e.target.value)} />
              <input className="input" placeholder="Document URL" value={doc.url} onChange={(e) => updateDocument(index, "url", e.target.value)} />
              <select className="input" value={doc.type} onChange={(e) => updateDocument(index, "type", e.target.value)}>
                <option value="datasheet">Datasheet</option>
                <option value="manual">Manual</option>
                <option value="catalog">Catalog</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
              <button type="button" onClick={() => removeDocument(index)} className="rounded-lg border p-2 text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-bold">Product Feature Cards</h2>
    <button type="button" onClick={addHighlight} className="btn-muted">
      <Plus size={16} /> Add Card
    </button>
  </div>

  <div className="space-y-3">
    {highlights.map((item, index) => (
      <div key={index} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_120px_100px_auto]">
        <input className="input" placeholder="Title" value={item.title} onChange={(e) => updateHighlight(index, "title", e.target.value)} />
        <input className="input" placeholder="Description" value={item.description} onChange={(e) => updateHighlight(index, "description", e.target.value)} />
        <input className="input" placeholder="Icon" value={item.icon} onChange={(e) => updateHighlight(index, "icon", e.target.value)} />
        <input type="number" className="input" value={item.order} onChange={(e) => updateHighlight(index, "order", Number(e.target.value))} />
        <button type="button" onClick={() => removeHighlight(index)} className="rounded-lg border p-2 text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
</div>

<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-bold">Applications</h2>
    <button type="button" onClick={addApplication} className="btn-muted">
      <Plus size={16} /> Add Application
    </button>
  </div>

  <div className="space-y-3">
    {applications.map((item, index) => (
      <div key={index} className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
        <input className="input" placeholder="Application text" value={item.text} onChange={(e) => updateApplication(index, "text", e.target.value)} />
        <input type="number" className="input" value={item.order} onChange={(e) => updateApplication(index, "order", Number(e.target.value))} />
        <button type="button" onClick={() => removeApplication(index)} className="rounded-lg border p-2 text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
</div>

<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-bold">Custom Product Page Sections</h2>
    <button type="button" onClick={addCustomSection} className="btn-muted">
      <Plus size={16} /> Add Section
    </button>
  </div>

  <div className="space-y-4">
    {customSections.map((section, index) => (
      <div key={index} className="rounded-xl border p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Section Title" value={section.title} onChange={(e) => updateCustomSection(index, "title", e.target.value)} />
          <select className="input" value={section.type} onChange={(e) => updateCustomSection(index, "type", e.target.value)}>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="card">Card</option>
            <option value="banner">Banner</option>
          </select>
          <input className="input" placeholder="Image URL" value={section.image} onChange={(e) => updateCustomSection(index, "image", e.target.value)} />
          <input type="number" className="input" placeholder="Order" value={section.order} onChange={(e) => updateCustomSection(index, "order", Number(e.target.value))} />
          <input className="input" placeholder="Button Text" value={section.buttonText} onChange={(e) => updateCustomSection(index, "buttonText", e.target.value)} />
          <input className="input" placeholder="Button Link" value={section.buttonLink} onChange={(e) => updateCustomSection(index, "buttonLink", e.target.value)} />
        </div>

        <textarea className="input mt-3 min-h-[100px]" placeholder="Section Content" value={section.content} onChange={(e) => updateCustomSection(index, "content", e.target.value)} />

        <div className="mt-3 flex justify-between">
          <CheckBox label="Active Section" checked={section.isActive !== false} onChange={(v) => updateCustomSection(index, "isActive", v)} />
          <button type="button" onClick={() => removeCustomSection(index)} className="rounded-lg border px-4 py-2 text-red-600">
            Remove Section
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">SEO & Visibility</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Meta Title">
            <input className="input" value={form.metaTitle} onChange={(e) => updateForm("metaTitle", e.target.value)} />
          </Field>

          <Field label="Meta Keywords">
            <input className="input" value={form.metaKeywords} onChange={(e) => updateForm("metaKeywords", e.target.value)} placeholder="ic, transistor, sensor" />
          </Field>

          <Field label="Meta Description">
            <textarea className="input min-h-[90px]" value={form.metaDescription} onChange={(e) => updateForm("metaDescription", e.target.value)} />
          </Field>

          <Field label="Status">
            <select className="input" value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-4">
          <CheckBox label="Active" checked={form.isActive} onChange={(v) => updateForm("isActive", v)} />
          <CheckBox label="Featured" checked={form.isFeatured} onChange={(v) => updateForm("isFeatured", v)} />
          <CheckBox label="Best Seller" checked={form.isBestSeller} onChange={(v) => updateForm("isBestSeller", v)} />
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-[#f3f7fb] py-4">
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-xl border bg-white px-5 py-3 text-sm font-bold">
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Saving..." : mode === "edit" ? "Update Product" : "Create Product"}
        </button>
      </div>

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
        .btn-muted {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 12px;
          border: 1px solid #d8e1ec;
          background: white;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>
    </form>
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

function CheckBox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}