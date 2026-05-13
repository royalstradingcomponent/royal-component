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

  const [bulkBlogPaste, setBulkBlogPaste] =
    useState("");

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
    canonicalUrl:
      "https://www.royalsmd.com/blog/",
    status: "draft",
    isFeatured: false,
    isTrending: false,
    relatedProductSlugsText: "",
    relatedCategorySlugsText: "semiconductors, sensors, connectors",

    primaryKeyword: "",

    secondaryKeywordsText: "",

    tableOfContentsText: "",

    industriesText: "",

    applicationsText: "",

    advantagesText: "",

    specificationsText: "",

    locationsText: "",

    trustSignalsText: "",

    ctaTitle: "",

    ctaDescription: "",

    ctaButtonText: "",

    youtubeUrl: "",

    datasheetUrl: "",

    schemaType: "Article",


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

  const handleApplyBlogPaste = () => {
    const lines = bulkBlogPaste
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const parsed = {};

    lines.forEach((line) => {
      const [key, ...rest] = line.split("=");

      if (!key || !rest.length) return;

      parsed[key.trim()] =
        rest.join("=").trim();
    });

    // BASIC
    updateForm(
      "title",
      parsed.Title || ""
    );

    updateForm(
      "slug",

      

      (parsed.Title || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
    );

    
    updateForm(
      "canonicalUrl",
      `https://www.royalsmd.com/blog/${(parsed.Title || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")}`
    );

    updateForm(
      "excerpt",
      parsed.Excerpt || ""
    );

    updateForm(
      "category",
      parsed.Category ||
      "semiconductors"
    );

    updateForm(
      "content",
      parsed.Content || ""
    );

    // SEO
    updateForm(
      "metaTitle",
      parsed.MetaTitle ||
      parsed.Title ||
      ""
    );

    updateForm(
      "metaDescription",
      parsed.MetaDescription ||
      parsed.Excerpt ||
      ""
    );

    updateForm(
      "metaKeywordsText",
      parsed.MetaKeywords || ""
    );

    // KEYWORDS
    updateForm(
      "primaryKeyword",
      parsed.PrimaryKeyword || ""
    );

    updateForm(
      "secondaryKeywordsText",
      parsed.SecondaryKeywords ||
      ""
    );

    // TAGS
    updateForm(
      "tagsText",
      parsed.Tags || ""
    );

    // CTA
    updateForm(
      "ctaTitle",
      parsed.CTATitle || ""
    );

    updateForm(
      "ctaDescription",
      parsed.CTADescription ||
      ""
    );

    updateForm(
      "ctaButtonText",
      parsed.CTAButtonText ||
      ""
    );

    // APPLICATIONS
    updateForm(
      "applicationsText",
      parsed.Applications || ""
    );

    // ADVANTAGES
    updateForm(
      "advantagesText",
      parsed.Advantages || ""
    );

    // INDUSTRIES
    updateForm(
      "industriesText",
      parsed.Industries || ""
    );

    // LOCATIONS
    updateForm(
      "locationsText",
      parsed.Locations || ""
    );

    // FAQS
    const faqData = [];

    for (let i = 1; i <= 20; i++) {
      if (parsed[`FAQ${i}`]) {
        faqData.push({
          question:
            parsed[`FAQ${i}`],

          answer:
            parsed[
            `FAQ${i}Answer`
            ] || "",
        });
      }
    }

    if (faqData.length) {
      setFaqs(faqData);
    }

    // SECTIONS
    const sectionData = [];

    for (let i = 1; i <= 20; i++) {
      if (parsed[`Section${i}`]) {
        sectionData.push({
          heading:
            parsed[`Section${i}`],

          content:
            parsed[
            `Section${i}Content`
            ] || "",

          image: "",
        });
      }
    }

    if (sectionData.length) {
      setSections(sectionData);
    }
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

        primaryKeyword:
          form.primaryKeyword,

        secondaryKeywords:
          splitText(
            form.secondaryKeywordsText
          ),

        tableOfContents:
          splitText(
            form.tableOfContentsText
          ),

        industries:
          splitText(
            form.industriesText
          ),

        applications:
          splitText(
            form.applicationsText
          ),

        advantages:
          splitText(
            form.advantagesText
          ),

        specifications:
          splitText(
            form.specificationsText
          ),

        locations:
          splitText(
            form.locationsText
          ),

        trustSignals:
          splitText(
            form.trustSignalsText
          ),
        readTime:
          Math.max(
            3,
            Math.ceil(
              (
                form.content +
                " " +
                sections
                  .map((s) => s.content)
                  .join(" ")
              ).split(" ").length / 200
            )
          ),

        ctaTitle:
          form.ctaTitle,

        ctaDescription:
          form.ctaDescription,

        ctaButtonText:
          form.ctaButtonText,

        youtubeUrl:
          form.youtubeUrl,

        datasheetUrl:
          form.datasheetUrl,

        schemaType:
          form.schemaType,
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
      <form onSubmit={submitBlog}

        className="mx-auto max-w-7xl">

        <div className="mb-6 rounded-3xl border border-dashed border-blue-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bulk Paste Blog Data
              </h2>

              <p className="text-sm text-slate-500">
                Paste SEO structured blog content
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyBlogPaste}
              className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white"
            >
              Apply Paste Data
            </button>
          </div>

          <textarea
            value={bulkBlogPaste}
            onChange={(e) =>
              setBulkBlogPaste(e.target.value)
            }
            placeholder={`Title=LM358 IC Complete Guide

Category=semiconductors

Excerpt=LM358 operational amplifier used in industrial electronics.

PrimaryKeyword=LM358 IC

SecondaryKeywords=LM358 datasheet, LM358 operational amplifier

MetaTitle=LM358 IC Complete Guide

MetaDescription=Buy LM358 IC online with datasheet and applications.

Tags=lm358,op amp,semiconductor

Applications=automation,power supply,pcb

Advantages=low power,dual op amp

Industries=automation,pcb manufacturing

Locations=Delhi,Mumbai,Noida

FAQ1=What is LM358 IC?
FAQ1Answer=LM358 is a dual operational amplifier IC.

Section1=Applications of LM358
Section1Content=LM358 used in automation and robotics.

CTATitle=Need LM358 IC in Bulk?

CTADescription=Royal Component supplies original LM358 IC.

CTAButtonText=Request Quote`}
            className="h-[320px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none"
          />
        </div>
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
                onChange={(e) => {
                  const value = e.target.value;

                  updateForm("title", value);

                  updateForm(
                    "slug",
                    value
                      .toLowerCase()
                      .replace(/[^a-z0-9 ]/g, "")
                      .replace(/\s+/g, "-")
                  );
                }}
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

              <Label>Primary Keyword</Label>
              <Input
                value={form.primaryKeyword}
                onChange={(e) =>
                  updateForm(
                    "primaryKeyword",
                    e.target.value
                  )
                }
                placeholder="industrial electronic components supplier india"
              />

              <Label>
                Secondary Keywords
              </Label>
              <Textarea
                rows={4}
                value={
                  form.secondaryKeywordsText
                }
                onChange={(e) =>
                  updateForm(
                    "secondaryKeywordsText",
                    e.target.value
                  )
                }
                placeholder="semiconductor supplier, PCB components, automation parts"
              />

              <Label>
                Table Of Contents
              </Label>
              <Textarea
                rows={4}
                value={
                  form.tableOfContentsText
                }
                onChange={(e) =>
                  updateForm(
                    "tableOfContentsText",
                    e.target.value
                  )
                }
                placeholder="What is LM358, Applications, Features"
              />

              <Label>Industries</Label>
              <Textarea
                rows={4}
                value={form.industriesText}
                onChange={(e) =>
                  updateForm(
                    "industriesText",
                    e.target.value
                  )
                }
                placeholder="Automation, Telecom, PCB Manufacturing"
              />

              <Label>Applications</Label>
              <Textarea
                rows={4}
                value={
                  form.applicationsText
                }
                onChange={(e) =>
                  updateForm(
                    "applicationsText",
                    e.target.value
                  )
                }
                placeholder="Industrial automation, robotics"
              />

              <Label>Advantages</Label>
              <Textarea
                rows={4}
                value={form.advantagesText}
                onChange={(e) =>
                  updateForm(
                    "advantagesText",
                    e.target.value
                  )
                }
                placeholder="Low power, high efficiency"
              />

              <Label>Specifications</Label>
              <Textarea
                rows={4}
                value={
                  form.specificationsText
                }
                onChange={(e) =>
                  updateForm(
                    "specificationsText",
                    e.target.value
                  )
                }
                placeholder="Voltage range, package type"
              />

              <Label>Locations</Label>
              <Textarea
                rows={4}
                value={form.locationsText}
                onChange={(e) =>
                  updateForm(
                    "locationsText",
                    e.target.value
                  )
                }
                placeholder="Delhi, Noida, Gurugram"
              />

              <Label>Trust Signals</Label>
              <Textarea
                rows={4}
                value={
                  form.trustSignalsText
                }
                onChange={(e) =>
                  updateForm(
                    "trustSignalsText",
                    e.target.value
                  )
                }
                placeholder="GST invoice, bulk supply"
              />

              <Label>CTA Title</Label>
              <Input
                value={form.ctaTitle}
                onChange={(e) =>
                  updateForm(
                    "ctaTitle",
                    e.target.value
                  )
                }
                placeholder="Need Bulk Components?"
              />

              <Label>
                CTA Description
              </Label>
              <Textarea
                rows={4}
                value={
                  form.ctaDescription
                }
                onChange={(e) =>
                  updateForm(
                    "ctaDescription",
                    e.target.value
                  )
                }
              />

              <Label>
                CTA Button Text
              </Label>
              <Input
                value={form.ctaButtonText}
                onChange={(e) =>
                  updateForm(
                    "ctaButtonText",
                    e.target.value
                  )
                }
                placeholder="Request Quote"
              />

              <Label>YouTube URL</Label>
              <Input
                value={form.youtubeUrl}
                onChange={(e) =>
                  updateForm(
                    "youtubeUrl",
                    e.target.value
                  )
                }
              />

              <Label>Datasheet URL</Label>
              <Input
                value={form.datasheetUrl}
                onChange={(e) =>
                  updateForm(
                    "datasheetUrl",
                    e.target.value
                  )
                }
              />

              <Label>Schema Type</Label>
              <select
                value={form.schemaType}
                onChange={(e) =>
                  updateForm(
                    "schemaType",
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
              >
                <option value="Article">
                  Article
                </option>

                <option value="TechArticle">
                  TechArticle
                </option>

                <option value="FAQPage">
                  FAQPage
                </option>
              </select>

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
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-blue-500"
      ></textarea>
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
        onChange={() => { }}
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