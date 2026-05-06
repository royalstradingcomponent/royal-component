"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, Send, UploadCloud } from "lucide-react";

const emptyItem = {
  componentName: "",
  partNumber: "",
  brand: "",
  quantity: 1,
};

export default function RequestComponentPage() {
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([{ ...emptyItem }]);

  const [form, setForm] = useState({
    description: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [datasheets, setDatasheets] = useState([]);
  const [images, setImages] = useState([]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyItem }]);
  };

  const removeItem = (index) => {
    setItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    const validItems = items
      .map((item) => ({
        componentName: item.componentName.trim(),
        partNumber: item.partNumber.trim(),
        brand: item.brand.trim(),
        quantity: Number(item.quantity || 1),
      }))
      .filter((item) => item.componentName && item.quantity > 0);

    if (!validItems.length || !form.customerName || !form.customerEmail) {
      toast.error("Please add at least one component, name and email");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const formData = new FormData();

      formData.append("items", JSON.stringify(validItems));
      formData.append("description", form.description);
      formData.append("customerName", form.customerName);
      formData.append("customerEmail", form.customerEmail);
      formData.append("customerPhone", form.customerPhone);

      images.forEach((file) => formData.append("images", file));
      datasheets.forEach((file) => formData.append("datasheets", file));

      const res = await fetch(`${API_BASE}/api/component-requests`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Request failed");
        return;
      }

      toast.success("Requirement submitted successfully");

      setItems([{ ...emptyItem }]);
      setForm({
        description: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      });
      setDatasheets([]);
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8ff]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 rounded-[32px] bg-gradient-to-r from-[#0f4c81] to-[#0ea5e9] p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
            Industrial Component Sourcing
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Can’t find your component?
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50 md:text-lg">
            Add multiple components, part numbers, quantity, images and
            datasheets. Our procurement team will check availability, MOQ,
            pricing and delivery timeline.
          </p>
        </div>

        <form
          onSubmit={submitRequest}
          className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Component List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add all required components in one RFQ request.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f4c81] px-4 py-3 text-sm font-black text-white"
            >
              <Plus size={18} />
              Add Component
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-blue-100 bg-[#f8fbff] p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-black text-slate-800">
                    Component #{index + 1}
                  </p>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Component Name *
                    </label>
                    <input
                      value={item.componentName}
                      onChange={(e) =>
                        handleItemChange(index, "componentName", e.target.value)
                      }
                      placeholder="Example: LM358 Op-Amp IC"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Part Number / MPN
                    </label>
                    <input
                      value={item.partNumber}
                      onChange={(e) =>
                        handleItemChange(index, "partNumber", e.target.value)
                      }
                      placeholder="STM32F103C8T6"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Brand
                    </label>
                    <input
                      value={item.brand}
                      onChange={(e) =>
                        handleItemChange(index, "brand", e.target.value)
                      }
                      placeholder="ST, TI, Siemens"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Your Name *
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone / WhatsApp
              </label>
              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Upload Product Images
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                <UploadCloud size={18} />
                {images.length ? `${images.length} image selected` : "Choose images"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                />
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Upload Datasheets / PDF
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                <UploadCloud size={18} />
                {datasheets.length
                  ? `${datasheets.length} file selected`
                  : "Choose datasheets PDF"}
                <input
                  type="file"
                  accept=".pdf,image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    setDatasheets(Array.from(e.target.files || []))
                  }
                />
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Requirement Details
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Write package type, voltage, application, alternate acceptable brand, delivery urgency etc."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-8 py-4 font-black text-white shadow-lg transition hover:bg-[#0b3b66] disabled:opacity-60"
              >
                <Send size={18} />
                {loading ? "Submitting..." : "Submit Requirement"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}