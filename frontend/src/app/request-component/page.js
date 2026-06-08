"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([{ ...emptyItem }]);

  const [form, setForm] = useState({
    description: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",

    companyName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
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

    const validItems = items.map((item) => ({
      componentName: item.componentName.trim(),
      partNumber: item.partNumber.trim(),
      brand: item.brand.trim(),
      quantity: Number(item.quantity || 1),
    }));

    console.log("VALID ITEMS =>", validItems);

    console.log({
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      description: form.description,
      addressLine1: form.addressLine1,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
    });

    const hasPdf = datasheets.length > 0;

    if (
      !form.customerName?.trim() ||
      !form.customerEmail?.trim() ||
      !form.customerPhone?.trim() ||
      !form.description?.trim() ||
      !form.addressLine1?.trim() ||
      !form.city?.trim() ||
      !form.state?.trim() ||
      !form.pinCode?.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!hasPdf) {

      const invalidItem = validItems.find(
        (item) =>
          !item.componentName ||
          !item.partNumber ||
          !item.brand ||
          item.quantity <= 0
      );

      if (invalidItem) {
        toast.error(
          "Component Name, Part Number and Brand are required when PDF is not uploaded"
        );
        return;
      }
    }


    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user"));

      const token = storedUser?.token;

      console.log("TOKEN FOUND =>", token);

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      console.log("TOKEN =>", token);

      localStorage.setItem(
        "rfqEmail",
        form.customerEmail
      );


      localStorage.setItem(
        "rfqEmail",
        form.customerEmail
      );
      const formData = new FormData();

      formData.append("items", JSON.stringify(validItems));
      formData.append("description", form.description);
      formData.append("customerName", form.customerName);
      formData.append("customerEmail", form.customerEmail);
      formData.append("customerPhone", form.customerPhone);
      formData.append("companyName", form.companyName);

      formData.append("addressLine1", form.addressLine1);

      formData.append("addressLine2", form.addressLine2);

      formData.append("city", form.city);

      formData.append("state", form.state);

      formData.append("pinCode", form.pinCode);

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

      setTimeout(() => {
        router.push("/request-component/my-requests");
      }, 1500);

      setItems([{ ...emptyItem }]);
      setForm({
        description: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",

        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
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
                      Component Name
                    </label>
                    <input
                      value={item.componentName}
                      onChange={(e) =>
                        handleItemChange(index, "componentName", e.target.value)
                      }
                      placeholder="Example: LM358 Op-Amp IC"
                      className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
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
                      className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
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
                      className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Quantity *
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
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
                required
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email *
              </label>
              <input
                required
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone / WhatsApp *
              </label>

              <input
                required
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-2xl border border-sky-200 bg-sky-50/40 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Company Name
              </label>

              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company / Business Name"
                className="w-full rounded-2xl border border-sky-200 bg-sky-50/40 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-6">

                <div className="mb-5 flex items-center gap-3">
                  <div className="h-10 w-1 rounded-full bg-sky-500"></div>

                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      Delivery Address
                    </h3>

                    <p className="text-sm text-slate-500">
                      Fill complete address for quotation and delivery.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Address Line 1 *
                    </label>

                    <input
                      required
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      placeholder="Building, Street, Area"
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Address Line 2
                    </label>

                    <input
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder="Landmark, Floor etc."
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      City *
                    </label>

                    <input
                      required
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Delhi"
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      State *
                    </label>

                    <input
                      required
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Delhi"
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      PIN Code *
                    </label>

                    <input
                      required
                      name="pinCode"
                      value={form.pinCode}
                      onChange={handleChange}
                      placeholder="110001"
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>

                </div>
              </div>
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
                Requirement Details *
              </label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Write package type, voltage, application, alternate acceptable brand, delivery urgency etc."
                className="w-full rounded-xl border border-sky-300 px-4 py-3 outline-none focus:border-sky-600"
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