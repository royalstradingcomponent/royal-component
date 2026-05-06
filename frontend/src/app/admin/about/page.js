"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import {
  Plus,
  Save,
  Trash2,
  Building2,
  Image as ImageIcon,
  Cpu,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  SearchCheck,
  ClipboardCheck,
  Factory,
  HelpCircle,
  PackageSearch,
} from "lucide-react";

const emptyPage = {
  hero: {},
  overview: {},
  stats: [],
  electronicsDepartment: { points: [] },
  productGroups: [],
  capabilities: [],
  qualityProcess: [],
  industries: [],
  whyChooseUs: [],
  faq: [],
  cta: {},
  seo: {},
};

export default function AdminAboutPage() {
  const [page, setPage] = useState(emptyPage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingField, setUploadingField] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  useEffect(() => {
    fetchAboutPage();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function fetchAboutPage() {
    try {
      const res = await fetch(`${API_BASE}/api/about-page/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json();
      setPage({ ...emptyPage, ...(data?.page || {}) });
    } catch {
      setToast({ type: "error", message: "About page load failed" });
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file, type, index = null) {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const fieldKey = index !== null ? `${type}-${index}` : type;
    setUploadingField(fieldKey);

    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      const uploadedUrl =
        data?.url ||
        data?.fileUrl ||
        data?.path ||
        data?.file?.url ||
        data?.file?.path ||
        data?.image ||
        "";

      if (!uploadedUrl) {
        setToast({
          type: "error",
          message: "Image upload failed: URL not received",
        });
        return;
      }

      if (type === "hero") updateNested("hero", "image", uploadedUrl);
      if (type === "overview") updateNested("overview", "image", uploadedUrl);

      setToast({
        type: "success",
        message: "Image uploaded successfully. Please save changes.",
      });
    } catch {
      setToast({ type: "error", message: "Image upload failed" });
    } finally {
      setUploadingField("");
    }
  }

  async function savePage() {
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/about-page/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(page),
      });

      const data = await res.json();

      if (!data.success) {
        setToast({
          type: "error",
          message: data.message || "Failed to save about page",
        });
        return;
      }

      setPage({ ...emptyPage, ...(data.page || {}) });
      setToast({
        type: "success",
        message: "About page updated successfully",
      });
    } catch {
      setToast({ type: "error", message: "Failed to save about page" });
    } finally {
      setSaving(false);
    }
  }

  function updateNested(section, key, value) {
    setPage((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  }

  function updateArrayField(field, index, value) {
    setPage((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  }

  function addArrayItem(field, value) {
    setPage((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  }

  function removeArrayItem(field, index) {
    setPage((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  }

  function updateObjectArray(field, index, key, value) {
    setPage((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = { ...(arr[index] || {}), [key]: value };
      return { ...prev, [field]: arr };
    });
  }

  function updateStats(index, key, value) {
    setPage((prev) => {
      const stats = [...(prev.stats || [])];
      stats[index] = { ...stats[index], [key]: value };
      return { ...prev, stats };
    });
  }

  function updateElectronicsPoint(index, value) {
    setPage((prev) => {
      const points = [...(prev.electronicsDepartment?.points || [])];
      points[index] = value;

      return {
        ...prev,
        electronicsDepartment: {
          ...(prev.electronicsDepartment || {}),
          points,
        },
      };
    });
  }

  function addElectronicsPoint() {
    setPage((prev) => ({
      ...prev,
      electronicsDepartment: {
        ...(prev.electronicsDepartment || {}),
        points: [...(prev.electronicsDepartment?.points || []), ""],
      },
    }));
  }

  function removeElectronicsPoint(index) {
    setPage((prev) => ({
      ...prev,
      electronicsDepartment: {
        ...(prev.electronicsDepartment || {}),
        points: (prev.electronicsDepartment?.points || []).filter(
          (_, i) => i !== index
        ),
      },
    }));
  }

  const inputClass =
    "w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f8ff] p-8 text-xl font-black">
        Loading about page...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f8ff] p-4 md:p-8">
      {toast && (
        <div className="fixed right-5 top-5 z-[9999]">
          <div
            className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <div className="mt-0.5">
              {toast.type === "success" ? (
                <CheckCircle2 size={22} className="text-emerald-600" />
              ) : (
                <AlertCircle size={22} className="text-red-600" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-black">
                {toast.type === "success" ? "Update Successful" : "Action Failed"}
              </h4>
              <p className="mt-1 text-sm font-semibold">{toast.message}</p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="rounded-full p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-black text-[#082f49]">
              <Building2 className="text-sky-600" />
              About Page Control
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Complete about landing page yahin se control hoga: images,
              content, categories, FAQ, SEO aur CTA.
            </p>
          </div>

          <button
            onClick={savePage}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-7 py-4 text-sm font-black text-white shadow-lg disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <Panel title="Hero Banner" icon={<ImageIcon />}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Badge">
              <input
                className={inputClass}
                value={page.hero?.badge || ""}
                onChange={(e) => updateNested("hero", "badge", e.target.value)}
              />
            </Field>

            <ImageUploadField
              label="Hero Image"
              value={page.hero?.image || ""}
              inputClass={inputClass}
              uploading={uploadingField === "hero"}
              onTextChange={(value) => updateNested("hero", "image", value)}
              onFileChange={(file) => uploadImage(file, "hero")}
            />

            <Field label="Title">
              <input
                className={inputClass}
                value={page.hero?.title || ""}
                onChange={(e) => updateNested("hero", "title", e.target.value)}
              />
            </Field>

            <Field label="Highlight">
              <input
                className={inputClass}
                value={page.hero?.highlight || ""}
                onChange={(e) =>
                  updateNested("hero", "highlight", e.target.value)
                }
              />
            </Field>

            <Field label="Primary Button Text">
              <input
                className={inputClass}
                value={page.hero?.primaryButtonText || ""}
                onChange={(e) =>
                  updateNested("hero", "primaryButtonText", e.target.value)
                }
              />
            </Field>

            <Field label="Primary Button Link">
              <input
                className={inputClass}
                value={page.hero?.primaryButtonLink || ""}
                onChange={(e) =>
                  updateNested("hero", "primaryButtonLink", e.target.value)
                }
              />
            </Field>

            <Field label="Secondary Button Text">
              <input
                className={inputClass}
                value={page.hero?.secondaryButtonText || ""}
                onChange={(e) =>
                  updateNested("hero", "secondaryButtonText", e.target.value)
                }
              />
            </Field>

            <Field label="Secondary Button Link">
              <input
                className={inputClass}
                value={page.hero?.secondaryButtonLink || ""}
                onChange={(e) =>
                  updateNested("hero", "secondaryButtonLink", e.target.value)
                }
              />
            </Field>
          </div>

          <Field label="Hero Description">
            <textarea
              className={`${inputClass} min-h-[150px]`}
              value={page.hero?.description || ""}
              onChange={(e) =>
                updateNested("hero", "description", e.target.value)
              }
            />
          </Field>
        </Panel>

        <Panel title="Company Overview" icon={<Building2 />}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Overview Title">
              <input
                className={inputClass}
                value={page.overview?.title || ""}
                onChange={(e) =>
                  updateNested("overview", "title", e.target.value)
                }
              />
            </Field>

            <ImageUploadField
              label="Overview Image"
              value={page.overview?.image || ""}
              inputClass={inputClass}
              uploading={uploadingField === "overview"}
              onTextChange={(value) => updateNested("overview", "image", value)}
              onFileChange={(file) => uploadImage(file, "overview")}
            />
          </div>

          <Field label="Overview Description">
            <textarea
              className={`${inputClass} min-h-[180px]`}
              value={page.overview?.description || ""}
              onChange={(e) =>
                updateNested("overview", "description", e.target.value)
              }
            />
          </Field>
        </Panel>

        <Panel title="Stats">
          <div className="grid gap-4 md:grid-cols-2">
            {(page.stats || []).map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-sky-100 bg-[#f8fcff] p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className={inputClass}
                    value={item.value || ""}
                    onChange={(e) =>
                      updateStats(index, "value", e.target.value)
                    }
                    placeholder="100+"
                  />
                  <input
                    className={inputClass}
                    value={item.label || ""}
                    onChange={(e) =>
                      updateStats(index, "label", e.target.value)
                    }
                    placeholder="Product Categories"
                  />
                </div>

                <RemoveButton onClick={() => removeArrayItem("stats", index)} />
              </div>
            ))}
          </div>

          <AddButton
            text="Add Stat"
            onClick={() => addArrayItem("stats", { value: "", label: "" })}
          />
        </Panel>

        <Panel title="Electronics Department" icon={<Cpu />}>
          <Field label="Title">
            <input
              className={inputClass}
              value={page.electronicsDepartment?.title || ""}
              onChange={(e) =>
                updateNested("electronicsDepartment", "title", e.target.value)
              }
            />
          </Field>

          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-[160px]`}
              value={page.electronicsDepartment?.description || ""}
              onChange={(e) =>
                updateNested(
                  "electronicsDepartment",
                  "description",
                  e.target.value
                )
              }
            />
          </Field>

          <div className="grid gap-3">
            {(page.electronicsDepartment?.points || []).map((point, index) => (
              <div key={index} className="flex gap-3">
                <input
                  className={inputClass}
                  value={point}
                  onChange={(e) =>
                    updateElectronicsPoint(index, e.target.value)
                  }
                />
                <button
                  onClick={() => removeElectronicsPoint(index)}
                  className="rounded-xl bg-red-50 px-4 text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <AddButton text="Add Electronics Point" onClick={addElectronicsPoint} />
        </Panel>

        <ObjectListPanel
          title="Product Groups"
          icon={<Layers />}
          items={page.productGroups || []}
          field="productGroups"
          inputClass={inputClass}
          updateObjectArray={updateObjectArray}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
        />

        <ObjectListPanel
          title="Capabilities"
          icon={<SearchCheck />}
          items={page.capabilities || []}
          field="capabilities"
          inputClass={inputClass}
          updateObjectArray={updateObjectArray}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
        />

        <ObjectListPanel
          title="Quality Process"
          icon={<ClipboardCheck />}
          items={page.qualityProcess || []}
          field="qualityProcess"
          inputClass={inputClass}
          updateObjectArray={updateObjectArray}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
        />

        <SimpleStringList
          title="Industries"
          icon={<Factory />}
          items={page.industries || []}
          onChange={(index, value) =>
            updateArrayField("industries", index, value)
          }
          onAdd={() => addArrayItem("industries", "")}
          onRemove={(index) => removeArrayItem("industries", index)}
          inputClass={inputClass}
        />

        <SimpleStringList
          title="Why Choose Us"
          items={page.whyChooseUs || []}
          onChange={(index, value) =>
            updateArrayField("whyChooseUs", index, value)
          }
          onAdd={() => addArrayItem("whyChooseUs", "")}
          onRemove={(index) => removeArrayItem("whyChooseUs", index)}
          inputClass={inputClass}
        />

        <FaqPanel
          items={page.faq || []}
          inputClass={inputClass}
          updateObjectArray={updateObjectArray}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
        />

        <Panel title="CTA Section" icon={<PackageSearch />}>
          <Field label="CTA Title">
            <input
              className={inputClass}
              value={page.cta?.title || ""}
              onChange={(e) => updateNested("cta", "title", e.target.value)}
            />
          </Field>

          <Field label="CTA Description">
            <textarea
              className={`${inputClass} min-h-[130px]`}
              value={page.cta?.description || ""}
              onChange={(e) =>
                updateNested("cta", "description", e.target.value)
              }
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="CTA Button Text">
              <input
                className={inputClass}
                value={page.cta?.buttonText || ""}
                onChange={(e) =>
                  updateNested("cta", "buttonText", e.target.value)
                }
              />
            </Field>

            <Field label="CTA Button Link">
              <input
                className={inputClass}
                value={page.cta?.buttonLink || ""}
                onChange={(e) =>
                  updateNested("cta", "buttonLink", e.target.value)
                }
              />
            </Field>
          </div>
        </Panel>

        <Panel title="SEO Settings">
          <Field label="Meta Title">
            <input
              className={inputClass}
              value={page.seo?.metaTitle || ""}
              onChange={(e) => updateNested("seo", "metaTitle", e.target.value)}
            />
          </Field>

          <Field label="Meta Description">
            <textarea
              className={`${inputClass} min-h-[130px]`}
              value={page.seo?.metaDescription || ""}
              onChange={(e) =>
                updateNested("seo", "metaDescription", e.target.value)
              }
            />
          </Field>

          <Field label="Meta Keywords comma separated">
            <input
              className={inputClass}
              value={(page.seo?.metaKeywords || []).join(", ")}
              onChange={(e) =>
                updateNested(
                  "seo",
                  "metaKeywords",
                  e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                )
              }
            />
          </Field>
        </Panel>

        <div className="sticky bottom-5 z-20 mt-8 flex justify-end">
          <button
            onClick={savePage}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-8 py-4 text-sm font-black text-white shadow-2xl disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  inputClass,
  uploading,
  onTextChange,
  onFileChange,
}) {
  return (
    <Field label={label}>
      <div className="grid gap-3">
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="/uploads/about/image.jpg"
        />

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sky-300 bg-sky-50 px-4 py-3 text-sm font-black text-[#075985] transition hover:bg-sky-100">
          <Upload size={18} />
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
        </label>
      </div>
    </Field>
  );
}

function ObjectListPanel({
  title,
  icon,
  items,
  field,
  inputClass,
  updateObjectArray,
  removeArrayItem,
  addArrayItem,
}) {
  return (
    <Panel title={title} icon={icon}>
      <div className="grid gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-sky-100 bg-[#f8fcff] p-5"
          >
            <Field label="Title">
              <input
                className={inputClass}
                value={item.title || ""}
                onChange={(e) =>
                  updateObjectArray(field, index, "title", e.target.value)
                }
              />
            </Field>

            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-[110px]`}
                value={item.description || ""}
                onChange={(e) =>
                  updateObjectArray(
                    field,
                    index,
                    "description",
                    e.target.value
                  )
                }
              />
            </Field>

            <RemoveButton onClick={() => removeArrayItem(field, index)} />
          </div>
        ))}
      </div>

      <AddButton
        text={`Add ${title}`}
        onClick={() => addArrayItem(field, { title: "", description: "" })}
      />
    </Panel>
  );
}

function FaqPanel({
  items,
  inputClass,
  updateObjectArray,
  removeArrayItem,
  addArrayItem,
}) {
  return (
    <Panel title="FAQ Section" icon={<HelpCircle />}>
      <div className="grid gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-sky-100 bg-[#f8fcff] p-5"
          >
            <Field label="Question">
              <input
                className={inputClass}
                value={item.question || ""}
                onChange={(e) =>
                  updateObjectArray("faq", index, "question", e.target.value)
                }
              />
            </Field>

            <Field label="Answer">
              <textarea
                className={`${inputClass} min-h-[110px]`}
                value={item.answer || ""}
                onChange={(e) =>
                  updateObjectArray("faq", index, "answer", e.target.value)
                }
              />
            </Field>

            <RemoveButton onClick={() => removeArrayItem("faq", index)} />
          </div>
        ))}
      </div>

      <AddButton
        text="Add FAQ"
        onClick={() => addArrayItem("faq", { question: "", answer: "" })}
      />
    </Panel>
  );
}

function Panel({ title, icon, children }) {
  return (
    <section className="mb-8 rounded-3xl border border-sky-100 bg-white p-5 shadow-sm md:p-7">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-[#082f49]">
        {icon}
        {title}
      </h2>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function AddButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-black text-[#075985]"
    >
      <Plus size={17} />
      {text}
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-2 text-sm font-black text-red-600"
    >
      <Trash2 size={16} />
      Remove
    </button>
  );
}

function SimpleStringList({
  title,
  icon,
  items,
  onChange,
  onAdd,
  onRemove,
  inputClass,
}) {
  return (
    <Panel title={title} icon={icon}>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <input
              className={inputClass}
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
            />
            <button
              onClick={() => onRemove(index)}
              className="rounded-xl bg-red-50 px-4 text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <AddButton text={`Add ${title}`} onClick={onAdd} />
    </Panel>
  );
}