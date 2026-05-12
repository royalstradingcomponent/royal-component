"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const emptyFaq = { question: "", answer: "" };
const emptySection = { heading: "", content: "", image: "" };

export default function CreateBlogPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    bannerImage: "",
    featuredImage: "",
    category: "semiconductors",
    tagsText:
      "electronics components, semiconductor supplier, industrial automation, Royal Trading Component",
    authorName: "Royal Trading Component",
    authorRole: "Industrial Electronics Procurement Team",
    metaTitle: "",
    metaDescription: "",
    metaKeywordsText:
      "buy electronic components online, industrial components supplier India, semiconductor distributor, automation parts",
    canonicalUrl: "",
    status: "draft",
    isFeatured: false,
    isTrending: false,
    relatedProductSlugsText: "",
    relatedCategorySlugsText: "semiconductors, sensors, connectors",
  });

  const [sections, setSections] = useState([
    {
      heading: "What is this component used for in industrial electronics?",
      content:
        "Explain the component usage in automation panels, PCB assemblies, control systems, repair projects, industrial machines, testing equipment and electronics manufacturing.",
      image: "",
    },
  ]);

  const [faqs, setFaqs] = useState([
    {
      question: "Can I request bulk quantity or MOQ pricing?",
      answer:
        "Yes, Royal Trading Component supports bulk quantity, MOQ based pricing, part number sourcing and industrial procurement assistance.",
    },
  ]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file, field, sectionIndex = null) => {
    if (!file) return;

    try {
      setUploading(field);

      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(`${API_BASE}/api/blog-upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Image upload failed");
        return;
      }

      if (field === "sectionImage" && sectionIndex !== null) {
        setSections((prev) =>
          prev.map((s, i) =>
            i === sectionIndex ? { ...s, image: data.imageUrl } : s
          )
        );
      } else {
        updateForm(field, data.imageUrl);
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading("");
    }
  };

  const addSection = () => {
    setSections((prev) => [...prev, { ...emptySection }]);
  };

  const updateSection = (index, key, value) => {
    setSections((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { ...emptyFaq }]);
  };

  const updateFaq = (index, key, value) => {
    setFaqs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const removeFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const splitText = (text) =>
    text
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const submitBlog = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Blog title required");
      return;
    }

    if (!form.category.trim()) {
      toast.error("Blog category required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        bannerImage: form.bannerImage,
        featuredImage: form.featuredImage,
        category: form.category,
        tags: splitText(form.tagsText),
        authorName: form.authorName,
        authorRole: form.authorRole,
        sections,
        faqs,
        relatedProductSlugs: splitText(form.relatedProductSlugsText),
        relatedCategorySlugs: splitText(form.relatedCategorySlugsText),
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.excerpt,
        metaKeywords: splitText(form.metaKeywordsText),
        canonicalUrl: form.canonicalUrl,
        status: form.status,
        isFeatured: form.isFeatured,
        isTrending: form.isTrending,
      };

      const res = await fetch(`${API_BASE}/api/blogs/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Blog create failed");
        return;
      }

      toast.success("Blog created successfully");
      router.push("/admin/blogs");
    } catch (error) {
     toast.error("Blog create failed");
    } finally {
      setSaving(false);
    }
  };

  const imagePreview = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE}${url}`;
  };

  return (
    <div className="min-h-screen bg-[#f4f8ff] px-4 py-8">
      <form onSubmit={submitBlog} className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <Link
              href="/admin/blogs"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Blogs
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-900">
              Create SEO Blog
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Add keyword-rich industrial electronics blog for Google ranking,
              indexing and organic leads.
            </p>
          </div>

          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-800 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Blog"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Box title="Main Blog Content">
              <Label>Blog Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Best Industrial Electronic Components Supplier in India"
              />

              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                placeholder="best-industrial-electronic-components-supplier-india"
              />

              <Label>Short Excerpt</Label>
              <Textarea
                rows={4}
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
                placeholder="Write SEO friendly summary..."
              />

              <Label>Main Content / Introduction</Label>
              <Textarea
                rows={10}
                value={form.content}
                onChange={(e) => updateForm("content", e.target.value)}
                placeholder="Write detailed keyword-rich blog introduction..."
              />
            </Box>

            <Box title="Dynamic Blog Sections">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>

              <div className="space-y-5">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex justify-between gap-3">
                      <p className="font-bold text-slate-800">
                        Section {index + 1}
                      </p>

                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>

                    <Label>Section Heading</Label>
                    <Input
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(index, "heading", e.target.value)
                      }
                      placeholder="Applications in Industrial Automation"
                    />

                    <Label>Section Content</Label>
                    <Textarea
                      rows={7}
                      value={section.content}
                      onChange={(e) =>
                        updateSection(index, "content", e.target.value)
                      }
                      placeholder="Write detailed paragraph..."
                    />

                    <Label>Section Image</Label>
                    <ImageUpload
                      value={section.image}
                      preview={imagePreview(section.image)}
                      uploading={uploading === "sectionImage"}
                      onFile={(file) => uploadImage(file, "sectionImage", index)}
                    />
                  </div>
                ))}
              </div>
            </Box>

            <Box title="FAQ Section">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  <Plus size={16} />
                  Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex justify-between">
                      <p className="font-bold text-slate-800">
                        FAQ {index + 1}
                      </p>

                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>

                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) =>
                        updateFaq(index, "question", e.target.value)
                      }
                      placeholder="Where can I buy this component in bulk?"
                    />

                    <Label>Answer</Label>
                    <Textarea
                      rows={4}
                      value={faq.answer}
                      onChange={(e) =>
                        updateFaq(index, "answer", e.target.value)
                      }
                      placeholder="Write helpful FAQ answer..."
                    />
                  </div>
                ))}
              </div>
            </Box>
          </div>

          <div className="space-y-6">
            <Box title="Publish Settings">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <div className="mt-4 space-y-3">
                <CheckBox
                  checked={form.isFeatured}
                  onChange={(v) => updateForm("isFeatured", v)}
                  label="Show as Featured Blog"
                />

                <CheckBox
                  checked={form.isTrending}
                  onChange={(v) => updateForm("isTrending", v)}
                  label="Show as Trending Blog"
                />
              </div>
            </Box>

            <Box title="Category & Tags">
              <Label>Category Slug *</Label>
              <Input
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                placeholder="semiconductors"
              />

              <Label>Tags comma separated</Label>
              <Textarea
                rows={4}
                value={form.tagsText}
                onChange={(e) => updateForm("tagsText", e.target.value)}
              />
            </Box>

            <Box title="Images">
              <Label>Banner Image</Label>
              <ImageUpload
                value={form.bannerImage}
                preview={imagePreview(form.bannerImage)}
                uploading={uploading === "bannerImage"}
                onFile={(file) => uploadImage(file, "bannerImage")}
              />

              <Label>Featured Image</Label>
              <ImageUpload
                value={form.featuredImage}
                preview={imagePreview(form.featuredImage)}
                uploading={uploading === "featuredImage"}
                onFile={(file) => uploadImage(file, "featuredImage")}
              />
            </Box>

            <Box title="SEO Settings">
              <Label>Meta Title</Label>
              <Input
                value={form.metaTitle}
                onChange={(e) => updateForm("metaTitle", e.target.value)}
                placeholder="Buy Industrial Electronic Components Online"
              />

              <Label>Meta Description</Label>
              <Textarea
                rows={4}
                value={form.metaDescription}
                onChange={(e) => updateForm("metaDescription", e.target.value)}
                placeholder="SEO description for Google search result..."
              />

              <Label>Meta Keywords comma separated</Label>
              <Textarea
                rows={4}
                value={form.metaKeywordsText}
                onChange={(e) => updateForm("metaKeywordsText", e.target.value)}
              />

              <Label>Canonical URL</Label>
              <Input
                value={form.canonicalUrl}
                onChange={(e) => updateForm("canonicalUrl", e.target.value)}
                placeholder="https://www.royalsmd.com/blog/your-blog-slug"
              />
            </Box>

            <Box title="Related Linking">
              <Label>Related Product Slugs</Label>
              <Textarea
                rows={3}
                value={form.relatedProductSlugsText}
                onChange={(e) =>
                  updateForm("relatedProductSlugsText", e.target.value)
                }
                placeholder="lm358-op-amp, ne555-timer-ic"
              />

              <Label>Related Category Slugs</Label>
              <Textarea
                rows={3}
                value={form.relatedCategorySlugsText}
                onChange={(e) =>
                  updateForm("relatedCategorySlugsText", e.target.value)
                }
                placeholder="semiconductors, sensors"
              />
            </Box>
          </div>
        </div>
      </form>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-extrabold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Label({ children }) {
  return (
    <label className="mb-2 mt-4 block text-sm font-bold text-slate-700">
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
    />
  );
}

function CheckBox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function ImageUpload({ value, preview, uploading, onFile }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mb-3 h-40 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-white text-slate-400">
          <ImagePlus size={32} />
        </div>
      )}

      <input
        value={value}
        onChange={() => {}}
        readOnly
        placeholder="/uploads/blogs/image.webp"
        className="mb-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none"
      />

      <label className="flex cursor-pointer items-center justify-center rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">
        {uploading ? "Uploading..." : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}