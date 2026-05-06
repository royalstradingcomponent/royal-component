"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

const blankSection = { heading: "", content: "", order: 0, isActive: true };
const blankFaq = { question: "", answer: "", order: 0, isActive: true };

const emptyPolicy = {
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  sections: [{ ...blankSection }],
  faqs: [{ ...blankFaq }],
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState(emptyPolicy);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const filteredPolicies = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return policies;

    return policies.filter((policy) => {
      return (
        policy.title?.toLowerCase().includes(q) ||
        policy.slug?.toLowerCase().includes(q) ||
        policy.shortDescription?.toLowerCase().includes(q)
      );
    });
  }, [keyword, policies]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await adminRequest("/api/admin/policies");
      setPolicies(data.pages || []);
    } catch (error) {
      toast.error(error.message || "Policies load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const resetForm = () => {
    setForm({
      ...emptyPolicy,
      sections: [{ ...blankSection }],
      faqs: [{ ...blankFaq }],
    });
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (policy) => {
    setEditing(policy);
    setForm({
      title: policy.title || "",
      slug: policy.slug || "",
      shortDescription: policy.shortDescription || "",
      content: policy.content || "",
      sections: policy.sections?.length
        ? policy.sections
        : [{ ...blankSection }],
      faqs: policy.faqs?.length ? policy.faqs : [{ ...blankFaq }],
      isActive: policy.isActive !== false,
      metaTitle: policy.seo?.metaTitle || "",
      metaDescription: policy.seo?.metaDescription || "",
      metaKeywords: policy.seo?.metaKeywords?.join(", ") || "",
    });
    setOpen(true);
  };

  const updateForm = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "title" && !editing) {
        next.slug = makeSlug(value);
        next.metaTitle = `${value} | Royal Component`;
      }

      if (key === "shortDescription" && !editing) {
        next.metaDescription = value;
      }

      return next;
    });
  };

  const updateSection = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { ...blankSection, order: prev.sections.length },
      ],
    }));
  };

  const removeSection = (index) => {
    setForm((prev) => ({
      ...prev,
      sections:
        prev.sections.length === 1
          ? [{ ...blankSection }]
          : prev.sections.filter((_, i) => i !== index),
    }));
  };

  const updateFaq = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addFaq = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { ...blankFaq, order: prev.faqs.length }],
    }));
  };

  const removeFaq = (index) => {
    setForm((prev) => ({
      ...prev,
      faqs:
        prev.faqs.length === 1
          ? [{ ...blankFaq }]
          : prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: makeSlug(form.slug),
    shortDescription: form.shortDescription.trim(),
    content: form.content.trim(),
    sections: form.sections
      .filter((item) => item.heading.trim() || item.content.trim())
      .map((item, index) => ({
        heading: item.heading.trim(),
        content: item.content.trim(),
        order: Number(item.order || index),
        isActive: item.isActive !== false,
      })),
    faqs: form.faqs
      .filter((item) => item.question.trim() || item.answer.trim())
      .map((item, index) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
        order: Number(item.order || index),
        isActive: item.isActive !== false,
      })),
    isActive: form.isActive,
    seo: {
      metaTitle:
        form.metaTitle.trim() || `${form.title.trim()} | Royal Component`,
      metaDescription:
        form.metaDescription.trim() || form.shortDescription.trim(),
      metaKeywords: String(form.metaKeywords || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    },
  });

  const savePolicy = async () => {
    try {
      if (!form.title.trim()) return toast.error("Title required");
      if (!form.slug.trim()) return toast.error("Slug required");

      setSaving(true);

      const payload = buildPayload();

      if (editing?._id) {
        await adminRequest(`/api/admin/policies/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Policy updated successfully");
      } else {
        await adminRequest("/api/admin/policies", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Policy created successfully");
      }

      setOpen(false);
      setEditing(null);
      resetForm();
      fetchPolicies();
    } catch (error) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deletePolicy = async (policy) => {
    if (!confirm(`Delete ${policy.title}?`)) return;

    try {
      await adminRequest(`/api/admin/policies/${policy._id}`, {
        method: "DELETE",
      });
      toast.success("Policy deleted successfully");
      fetchPolicies();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#cdefff] bg-gradient-to-br from-[#e0f5ff] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bfe6ff] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0284c7]">
              <FileText size={16} />
              Admin Controlled Pages
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#102033]">
              Policy Pages
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Manage Return Policy, Refund Policy, Exchange Policy and other
              legal/customer-support pages from one place.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0284c7] px-6 py-4 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-[#0369a1]"
          >
            <Plus size={18} />
            Add New Policy
          </button>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#dbeafe] bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title, slug or description..."
            className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fcff] py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#38bdf8]"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-[#dbeafe] bg-white shadow-sm">
        <div className="hidden grid-cols-[1.2fr_1fr_130px_140px] bg-[#f0fbff] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500 md:grid">
          <div>Policy</div>
          <div>Slug</div>
          <div>Status</div>
          <div className="text-right">Action</div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm font-bold text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            Loading policies...
          </div>
        ) : null}

        {!loading && filteredPolicies.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-slate-500">
            No policies found.
          </div>
        ) : null}

        {!loading &&
          filteredPolicies.map((policy) => (
            <div
              key={policy._id}
              className="grid gap-4 border-t border-[#eef2f7] px-5 py-5 md:grid-cols-[1.2fr_1fr_130px_140px] md:items-center"
            >
              <div>
                <p className="text-base font-black text-[#102033]">
                  {policy.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                  {policy.shortDescription || "No short description added."}
                </p>
              </div>

              <div className="font-bold text-[#0284c7]">/{policy.slug}</div>

              <div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black ${
                    policy.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {policy.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  {policy.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex justify-start gap-2 md:justify-end">
                <button
                  onClick={() => openEdit(policy)}
                  className="rounded-xl border border-[#dbeafe] p-2.5 text-[#0369a1] transition hover:bg-[#f0fbff]"
                >
                  <Pencil size={17} />
                </button>

                <button
                  onClick={() => deletePolicy(policy)}
                  className="rounded-xl border border-red-200 p-2.5 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
      </section>

      {open ? (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/50 p-4">
          <div className="mx-auto my-6 max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-[#102033]">
                  {editing ? "Edit Policy Page" : "Add Policy Page"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  All content shown on public policy page is controlled from
                  here.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border p-2 transition hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <Card title="Basic Content">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Title"
                      value={form.title}
                      onChange={(v) => updateForm("title", v)}
                      placeholder="Return Policy"
                    />

                    <Input
                      label="Slug"
                      value={form.slug}
                      onChange={(v) => updateForm("slug", makeSlug(v))}
                      placeholder="return-policy"
                    />

                    <div className="md:col-span-2">
                      <TextArea
                        label="Short Description"
                        value={form.shortDescription}
                        onChange={(v) => updateForm("shortDescription", v)}
                        rows={3}
                        placeholder="Small description shown in hero section..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <TextArea
                        label="Main Content"
                        value={form.content}
                        onChange={(v) => updateForm("content", v)}
                        rows={9}
                        placeholder="Main policy overview content..."
                      />
                    </div>
                  </div>
                </Card>

                <Card
                  title="Policy Sections"
                  action={
                    <button
                      onClick={addSection}
                      type="button"
                      className="rounded-xl border border-[#bfe6ff] bg-[#f0fbff] px-4 py-2 text-sm font-black text-[#0284c7]"
                    >
                      + Add Section
                    </button>
                  }
                >
                  <div className="space-y-4">
                    {form.sections.map((section, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#e2e8f0] bg-[#f8fcff] p-4"
                      >
                        <div className="grid gap-3 md:grid-cols-[1fr_90px_auto]">
                          <Input
                            label="Heading"
                            value={section.heading}
                            onChange={(v) =>
                              updateSection(index, "heading", v)
                            }
                            placeholder="Return Eligibility"
                          />

                          <Input
                            label="Order"
                            type="number"
                            value={section.order}
                            onChange={(v) =>
                              updateSection(index, "order", Number(v))
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="mt-6 rounded-xl border border-red-200 px-4 text-sm font-black text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-3">
                          <TextArea
                            label="Section Content"
                            value={section.content}
                            onChange={(v) =>
                              updateSection(index, "content", v)
                            }
                            rows={4}
                          />
                        </div>

                        <label className="mt-3 inline-flex items-center gap-2 text-sm font-black text-slate-700">
                          <input
                            type="checkbox"
                            checked={section.isActive !== false}
                            onChange={(e) =>
                              updateSection(
                                index,
                                "isActive",
                                e.target.checked
                              )
                            }
                          />
                          Active Section
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-5">
                <Card
                  title="FAQs"
                  action={
                    <button
                      onClick={addFaq}
                      type="button"
                      className="rounded-xl border border-[#bfe6ff] bg-[#f0fbff] px-4 py-2 text-sm font-black text-[#0284c7]"
                    >
                      + Add FAQ
                    </button>
                  }
                >
                  <div className="space-y-4">
                    {form.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#e2e8f0] bg-[#f8fcff] p-4"
                      >
                        <div className="grid gap-3 md:grid-cols-[1fr_80px]">
                          <Input
                            label="Question"
                            value={faq.question}
                            onChange={(v) =>
                              updateFaq(index, "question", v)
                            }
                            placeholder="How many days do I have to return?"
                          />

                          <Input
                            label="Order"
                            type="number"
                            value={faq.order}
                            onChange={(v) =>
                              updateFaq(index, "order", Number(v))
                            }
                          />
                        </div>

                        <div className="mt-3">
                          <TextArea
                            label="Answer"
                            value={faq.answer}
                            onChange={(v) => updateFaq(index, "answer", v)}
                            rows={4}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <label className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
                            <input
                              type="checkbox"
                              checked={faq.isActive !== false}
                              onChange={(e) =>
                                updateFaq(index, "isActive", e.target.checked)
                              }
                            />
                            Active FAQ
                          </label>

                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="SEO Settings">
                  <div className="space-y-4">
                    <Input
                      label="SEO Meta Title"
                      value={form.metaTitle}
                      onChange={(v) => updateForm("metaTitle", v)}
                      placeholder="Return Policy | Royal Component"
                    />

                    <TextArea
                      label="SEO Meta Description"
                      value={form.metaDescription}
                      onChange={(v) => updateForm("metaDescription", v)}
                      rows={4}
                      placeholder="Write SEO description..."
                    />

                    <TextArea
                      label="SEO Keywords"
                      value={form.metaKeywords}
                      onChange={(v) => updateForm("metaKeywords", v)}
                      rows={3}
                      placeholder="return policy, industrial return, electronics return"
                    />

                    <label className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) =>
                          updateForm("isActive", e.target.checked)
                        }
                      />
                      Page Active / Visible on Website
                    </label>
                  </div>
                </Card>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#e2e8f0] bg-white px-6 py-5">
              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl border px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={savePolicy}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] px-7 py-3 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-[#0369a1] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save Policy"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <section className="rounded-[26px] border border-[#dbeafe] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-[#102033]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fcff] px-4 py-3 text-sm font-semibold text-[#102033] outline-none transition focus:border-[#38bdf8] focus:bg-white"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 5, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-2xl border border-[#dbeafe] bg-[#f8fcff] px-4 py-3 text-sm font-semibold leading-7 text-[#102033] outline-none transition focus:border-[#38bdf8] focus:bg-white"
      />
    </label>
  );
}