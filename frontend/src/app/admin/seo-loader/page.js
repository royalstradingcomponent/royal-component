"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, adminRequest } from "@/lib/api";

const uploadImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });
};

const emptyLoader = {
    title: "",
    subtitle: "",
    description: "",
    seoHeading: "",
    seoParagraph: "",
    bottomContent: "",
    heroImage: "",
    isActive: true,
    keywords: [{ label: "", link: "" }],
    cards: [
        {
            title: "",
            description: "",
            icon: "Cpu",
            image: "",
            link: "",
            order: 0,
            isActive: true,
        },
    ],
    trustedBrands: [
        {
            name: "",
            logo: "",
            link: "",
            order: 0,
            isActive: true,
        },
    ],
};

export default function SeoLoaderAdminPage() {
    const [form, setForm] = useState(emptyLoader);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await adminRequest("/api/seo-loader/admin");

            if (data?.loader) {
                setForm({
                    ...emptyLoader,
                    ...data.loader,
                    keywords: data.loader.keywords?.length
                        ? data.loader.keywords
                        : emptyLoader.keywords,
                    cards: data.loader.cards?.length
                        ? data.loader.cards
                        : emptyLoader.cards,
                    trustedBrands: data.loader.trustedBrands?.length
                        ? data.loader.trustedBrands
                        : emptyLoader.trustedBrands,
                });
            }
        } catch (error) {
            toast.error(error.message || "SEO loader data load failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addKeyword = () => {
        setForm((prev) => ({
            ...prev,
            keywords: [...prev.keywords, { label: "", link: "" }],
        }));
    };

    const updateKeyword = (index, key, value) => {
        setForm((prev) => ({
            ...prev,
            keywords: prev.keywords.map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            ),
        }));
    };

    const removeKeyword = (index) => {
        setForm((prev) => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index),
        }));
    };

    const addCard = () => {
        setForm((prev) => ({
            ...prev,
            cards: [
                ...prev.cards,
                {
                    title: "",
                    description: "",
                    icon: "Cpu",
                    image: "",
                    link: "",
                    order: prev.cards.length,
                    isActive: true,
                },
            ],
        }));
    };

    const updateCard = (index, key, value) => {
        setForm((prev) => ({
            ...prev,
            cards: prev.cards.map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            ),
        }));
    };

    const removeCard = (index) => {
        setForm((prev) => ({
            ...prev,
            cards: prev.cards.filter((_, i) => i !== index),
        }));
    };

    const addBrand = () => {
        setForm((prev) => ({
            ...prev,
            trustedBrands: [
                ...prev.trustedBrands,
                {
                    name: "",
                    logo: "",
                    link: "",
                    order: prev.trustedBrands.length,
                    isActive: true,
                },
            ],
        }));
    };

    const updateBrand = (index, key, value) => {
        setForm((prev) => ({
            ...prev,
            trustedBrands: prev.trustedBrands.map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            ),
        }));
    };

    const removeBrand = (index) => {
        setForm((prev) => ({
            ...prev,
            trustedBrands: prev.trustedBrands.filter((_, i) => i !== index),
        }));
    };

    const handleHeroImageUpload = async (e) => {
        try {
            const file = e.target.files?.[0];

            if (!file) return;

            const base64 = await uploadImageToBase64(file);

            setForm((prev) => ({
                ...prev,
                heroImage: base64,
            }));

            toast.success("Hero image uploaded");
        } catch (error) {
            toast.error("Image upload failed");
        }
    };

    const saveData = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const payload = {
                ...form,
                keywords: form.keywords.filter((x) => x.label),
                cards: form.cards
                    .filter((x) => x.title || x.description)
                    .map((x, index) => ({
                        ...x,
                        order: Number(x.order || index),
                        isActive: x.isActive !== false,
                    })),
                trustedBrands: form.trustedBrands
                    .filter((x) => x.name)
                    .map((x, index) => ({
                        ...x,
                        order: Number(x.order || index),
                        isActive: x.isActive !== false,
                    })),
            };

            await adminRequest("/api/seo-loader/admin", {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            toast.success("SEO loader updated successfully");
            loadData();
        } catch (error) {
            toast.error(error.message || "SEO loader save failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="rounded-2xl bg-white p-6">Loading SEO loader...</div>;
    }

    return (
        <form onSubmit={saveData} className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h1 className="text-2xl font-extrabold text-[#102033]">
                    SEO Loader Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Control global loading page SEO content, keywords, cards and brands.
                </p>
            </div>

            <Section title="Main Loader Content">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Main Title">
                        <input
                            className="input"
                            value={form.title}
                            onChange={(e) => updateForm("title", e.target.value)}
                        />
                    </Field>

                    <Field label="Subtitle">
                        <input
                            className="input"
                            value={form.subtitle}
                            onChange={(e) => updateForm("subtitle", e.target.value)}
                        />
                    </Field>

                    <Field label="Description">
                        <textarea
                            className="input min-h-[120px]"
                            value={form.description}
                            onChange={(e) => updateForm("description", e.target.value)}
                        />
                    </Field>

                    <Field label="Hero Image">
                        <div className="space-y-4">
                            <input
                                className="input"
                                placeholder="Paste image URL or upload image"
                                value={form.heroImage}
                                onChange={(e) => updateForm("heroImage", e.target.value)}
                            />

                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#2454b5] bg-[#eef4ff] px-5 py-4 text-sm font-bold text-[#2454b5] transition hover:bg-[#dfeeff]">
                                <UploadCloud size={18} />
                                Upload Hero Image

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleHeroImageUpload}
                                />
                            </label>

                            {form.heroImage ? (
                                <div className="overflow-hidden rounded-2xl border bg-slate-100">
                                    <img
                                        src={form.heroImage}
                                        alt="SEO loader preview"
                                        className="h-[220px] w-full object-cover"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </Field>
                </div>
            </Section>

            <Section title="SEO Paragraph Content">
                <div className="grid gap-4">
                    <Field label="SEO Heading">
                        <input
                            className="input"
                            value={form.seoHeading}
                            onChange={(e) => updateForm("seoHeading", e.target.value)}
                        />
                    </Field>

                    <Field label="SEO Paragraph">
                        <textarea
                            className="input min-h-[140px]"
                            value={form.seoParagraph}
                            onChange={(e) => updateForm("seoParagraph", e.target.value)}
                        />
                    </Field>

                    <Field label="Bottom Content">
                        <textarea
                            className="input min-h-[140px]"
                            value={form.bottomContent}
                            onChange={(e) => updateForm("bottomContent", e.target.value)}
                        />
                    </Field>
                </div>
            </Section>

            <Section
                title="Keyword Chips"
                action={
                    <button type="button" onClick={addKeyword} className="btn-muted">
                        <Plus size={16} /> Add Keyword
                    </button>
                }
            >
                <div className="space-y-3">
                    {form.keywords.map((item, index) => (
                        <div
                            key={index}
                            className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_auto]"
                        >
                            <input
                                className="input"
                                placeholder="Keyword label"
                                value={item.label}
                                onChange={(e) => updateKeyword(index, "label", e.target.value)}
                            />
                            <input
                                className="input"
                                placeholder="/products?category=semiconductors"
                                value={item.link || ""}
                                onChange={(e) => updateKeyword(index, "link", e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeKeyword(index)}
                                className="rounded-lg border p-2 text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Loader Cards"
                action={
                    <button type="button" onClick={addCard} className="btn-muted">
                        <Plus size={16} /> Add Card
                    </button>
                }
            >
                <div className="space-y-4">
                    {form.cards.map((card, index) => (
                        <div key={index} className="rounded-xl border p-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                <input
                                    className="input"
                                    placeholder="Card title"
                                    value={card.title}
                                    onChange={(e) => updateCard(index, "title", e.target.value)}
                                />
                                <input
                                    className="input"
                                    placeholder="Icon e.g. Cpu, Factory, PackageSearch"
                                    value={card.icon || "Cpu"}
                                    onChange={(e) => updateCard(index, "icon", e.target.value)}
                                />
                                <input
                                    className="input"
                                    placeholder="Card link"
                                    value={card.link || ""}
                                    onChange={(e) => updateCard(index, "link", e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Order"
                                    value={card.order || 0}
                                    onChange={(e) =>
                                        updateCard(index, "order", Number(e.target.value))
                                    }
                                />
                                <input
                                    className="input md:col-span-2"
                                    placeholder="Image URL"
                                    value={card.image || ""}
                                    onChange={(e) => updateCard(index, "image", e.target.value)}
                                />
                            </div>

                            <textarea
                                className="input mt-3 min-h-[90px]"
                                placeholder="Card description"
                                value={card.description || ""}
                                onChange={(e) =>
                                    updateCard(index, "description", e.target.value)
                                }
                            />

                            <div className="mt-3 flex justify-between">
                                <CheckBox
                                    label="Active Card"
                                    checked={card.isActive !== false}
                                    onChange={(v) => updateCard(index, "isActive", v)}
                                />

                                <button
                                    type="button"
                                    onClick={() => removeCard(index)}
                                    className="rounded-lg border px-4 py-2 text-sm font-bold text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Trusted Brands"
                action={
                    <button type="button" onClick={addBrand} className="btn-muted">
                        <Plus size={16} /> Add Brand
                    </button>
                }
            >
                <div className="space-y-3">
                    {form.trustedBrands.map((brand, index) => (
                        <div
                            key={index}
                            className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_100px_auto]"
                        >
                            <input
                                className="input"
                                placeholder="Brand name"
                                value={brand.name}
                                onChange={(e) => updateBrand(index, "name", e.target.value)}
                            />
                            <input
                                className="input"
                                placeholder="Logo URL"
                                value={brand.logo || ""}
                                onChange={(e) => updateBrand(index, "logo", e.target.value)}
                            />
                            <input
                                type="number"
                                className="input"
                                value={brand.order || 0}
                                onChange={(e) =>
                                    updateBrand(index, "order", Number(e.target.value))
                                }
                            />
                            <button
                                type="button"
                                onClick={() => removeBrand(index)}
                                className="rounded-lg border p-2 text-red-600"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </Section>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-[#f3f7fb] py-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2454b5] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save SEO Loader"}
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

function Section({ title, action, children }) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#102033]">{title}</h2>
                {action}
            </div>
            {children}
        </div>
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