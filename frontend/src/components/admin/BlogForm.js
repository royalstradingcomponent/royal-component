"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptySection = {
  heading: "",
  content: "",
  image: "",
};

const emptyFaq = {
  question: "",
  answer: "",
};

export function BlogForm({
  mode = "add",
  blogId = "",
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",

    bannerImage: "",
    featuredImage: "",

    category: "",

    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",

    primaryKeyword: "",
    secondaryKeywords: "",

    canonicalUrl: "",

    authorName: "Royal Trading Component",

    status: "draft",

    readTime: 5,

    sections: [emptySection],

    faqs: [emptyFaq],

    relatedProductSlugs: "",
    relatedCategorySlugs: "",

    tableOfContents: "",
    industries: "",
    applications: "",
    advantages: "",
    specifications: "",
    locations: "",
    trustSignals: "",

    ctaTitle: "",
    ctaDescription: "",
    ctaButtonText: "",

    youtubeUrl: "",
    datasheetUrl: "",

    schemaType: "Article",
  });

  // =========================
  // EDIT LOAD
  // =========================

  useEffect(() => {
    if (mode !== "edit" || !blogId) return;

    fetchBlog();
  }, [mode, blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/blogs/admin/${blogId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      const blog = data.blog;

      setFormData({
        ...blog,

        metaKeywords:
          blog.metaKeywords?.join(", ") || "",

        secondaryKeywords:
          blog.secondaryKeywords?.join(", ") || "",

        relatedProductSlugs:
          blog.relatedProductSlugs?.join(", ") || "",

        relatedCategorySlugs:
          blog.relatedCategorySlugs?.join(", ") || "",

        tableOfContents:
          blog.tableOfContents?.join("\n") || "",

        industries:
          blog.industries?.join("\n") || "",

        applications:
          blog.applications?.join("\n") || "",

        advantages:
          blog.advantages?.join("\n") || "",

        specifications:
          blog.specifications?.join("\n") || "",

        locations:
          blog.locations?.join("\n") || "",

        trustSignals:
          blog.trustSignals?.join("\n") || "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SECTIONS
  // =========================

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        emptySection,
      ],
    });
  };

  const removeSection = (index) => {
    const updated = [...formData.sections];
    updated.splice(index, 1);

    setFormData({
      ...formData,
      sections: updated,
    });
  };

  const updateSection = (
    index,
    field,
    value
  ) => {
    const updated = [...formData.sections];

    updated[index][field] = value;

    setFormData({
      ...formData,
      sections: updated,
    });
  };

  // =========================
  // FAQS
  // =========================

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, emptyFaq],
    });
  };

  const removeFaq = (index) => {
    const updated = [...formData.faqs];

    updated.splice(index, 1);

    setFormData({
      ...formData,
      faqs: updated,
    });
  };

  const updateFaq = (
    index,
    field,
    value
  ) => {
    const updated = [...formData.faqs];

    updated[index][field] = value;

    setFormData({
      ...formData,
      faqs: updated,
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,

        metaKeywords:
          formData.metaKeywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        secondaryKeywords:
          formData.secondaryKeywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        relatedProductSlugs:
          formData.relatedProductSlugs
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        relatedCategorySlugs:
          formData.relatedCategorySlugs
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

        tableOfContents:
          formData.tableOfContents
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

        industries:
          formData.industries
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

        applications:
          formData.applications
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

        advantages:
          formData.advantages
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

        specifications:
          formData.specifications
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

        locations:
          formData.locations
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),

        trustSignals:
          formData.trustSignals
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
      };

      const url =
        mode === "edit"
          ? `${API_URL}/api/blogs/admin/${blogId}`
          : `${API_URL}/api/blogs/admin`;

      const method =
        mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(
        mode === "edit"
          ? "Blog updated"
          : "Blog created"
      );

      router.push("/admin/blogs");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* BASIC */}

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="mb-5 text-2xl font-bold">
          Blog Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="slug"
            placeholder="blog-slug"
            value={formData.slug}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="primaryKeyword"
            placeholder="Primary Keyword"
            value={formData.primaryKeyword}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />
        </div>

        <textarea
          name="excerpt"
          placeholder="Short Excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="mt-4 min-h-[120px] w-full rounded-xl border p-3"
        />

        <textarea
          name="content"
          placeholder="Main Blog Content"
          value={formData.content}
          onChange={handleChange}
          className="mt-4 min-h-[300px] w-full rounded-xl border p-3"
        />
      </div>

      {/* SEO */}

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="mb-5 text-2xl font-bold">
          SEO Settings
        </h2>

        <div className="grid gap-4">
          <input
            name="metaTitle"
            placeholder="Meta Title"
            value={formData.metaTitle}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            value={formData.metaDescription}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <textarea
            name="metaKeywords"
            placeholder="keyword1, keyword2"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <textarea
            name="secondaryKeywords"
            placeholder="Secondary Keywords"
            value={formData.secondaryKeywords}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />
        </div>
      </div>

      {/* SECTIONS */}

      <div className="rounded-2xl border bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Blog Sections
          </h2>

          <button
            type="button"
            onClick={addSection}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {formData.sections.map(
            (section, index) => (
              <div
                key={index}
                className="rounded-xl border p-4"
              >
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      removeSection(index)
                    }
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <input
                  placeholder="Section Heading"
                  value={section.heading}
                  onChange={(e) =>
                    updateSection(
                      index,
                      "heading",
                      e.target.value
                    )
                  }
                  className="mb-3 w-full rounded-xl border p-3"
                />

                <textarea
                  placeholder="Section Content"
                  value={section.content}
                  onChange={(e) =>
                    updateSection(
                      index,
                      "content",
                      e.target.value
                    )
                  }
                  className="min-h-[180px] w-full rounded-xl border p-3"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* FAQ */}

      <div className="rounded-2xl border bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            FAQs
          </h2>

          <button
            type="button"
            onClick={addFaq}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {formData.faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border p-4"
            >
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    removeFaq(index)
                  }
                  className="text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <input
                placeholder="Question"
                value={faq.question}
                onChange={(e) =>
                  updateFaq(
                    index,
                    "question",
                    e.target.value
                  )
                }
                className="mb-3 w-full rounded-xl border p-3"
              />

              <textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) =>
                  updateFaq(
                    index,
                    "answer",
                    e.target.value
                  )
                }
                className="min-h-[120px] w-full rounded-xl border p-3"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT */}

      <button
        disabled={loading}
        className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white"
      >
        {loading
          ? "Saving..."
          : mode === "edit"
          ? "Update Blog"
          : "Create Blog"}
      </button>
    </form>
  );
}