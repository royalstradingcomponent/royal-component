"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  RefreshCcw,
  Plus,
  Save,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Truck,
  IndianRupee,
} from "lucide-react";

const emptyForm = {
  componentName: "",
  partNumber: "",
  brand: "",
  supplierCompany: "",
  contactPerson: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  purchasePrice: "",

  gstPercent: 18,
  profitPercent: 20,
  extraCharge: 0,
  currency: "INR",
  moq: 1,
  leadTime: "",
  lastPurchaseDate: "",
  availabilityStatus: "available",
  qualityNote: "",
  adminNote: "",
  isPreferred: false,
  isActive: true,
  supplierPdf: null,
  supplierImages: [],
};

const statusOptions = ["available", "limited", "on_request", "unavailable"];

const statusStyles = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  limited: "bg-yellow-50 text-yellow-700 border-yellow-200",
  on_request: "bg-blue-50 text-blue-700 border-blue-200",
  unavailable: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizePhone(value) {
  const clean = String(value || "").replace(/\D/g, "");
  if (!clean) return "";
  return clean.startsWith("91") ? clean : `91${clean}`;
}

export default function SupplierSourcesPage() {
  const [sources, setSources] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [configText, setConfigText] = useState("");


  const stats = useMemo(() => {
    return {
      total: sources.length,
      preferred: sources.filter((s) => s.isPreferred).length,
      active: sources.filter((s) => s.isActive).length,
      available: sources.filter((s) => s.availabilityStatus === "available")
        .length,
    };
  }, [sources]);

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const headers = {
    Authorization: `Bearer ${adminToken}`,
  };

  const fetchSources = async () => {
    try {
      setLoading(true);

      if (!adminToken) {
        toast.error("Admin login required");
        return;
      }

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      params.set("status", status);

      const res = await fetch(
        `${API_BASE}/api/supplier-sources?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.success) {
        setSources(data.sources || []);
      } else {
        toast.error(data.message || "Failed to fetch suppliers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [status]);

  useEffect(() => {
    const editId =
      localStorage.getItem("editSupplierId");

    if (!editId || !sources.length) return;

    const found = sources.find(
      (item) => item._id === editId
    );

    if (found) {
      editSource(found);

      localStorage.removeItem(
        "editSupplierId"
      );
    }
  }, [sources]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const purchasePrice = Number(form.purchasePrice || 0);

  const profitAmount =
    (purchasePrice * Number(form.profitPercent || 0)) / 100;

  const sellingPrice =
    purchasePrice + profitAmount + Number(form.extraCharge || 0);

  const gstAmount =
    (sellingPrice * Number(form.gstPercent || 0)) / 100;

  const subtotal = sellingPrice;

  const sgstAmount = gstAmount / 2;

  const cgstAmount = gstAmount / 2;

  const grandTotal = sellingPrice + gstAmount;

  const totalQty = Number(form.moq || 1);

  const finalItemTotal =
    sellingPrice * totalQty;

  const submitSource = async (e) => {
    e.preventDefault();

    if (!form.componentName || !form.supplierCompany) {
      toast.error("Component name and supplier company are required");
      return;
    }

    try {
      const url = editingId
        ? `${API_BASE}/api/supplier-sources/${editingId}`
        : `${API_BASE}/api/supplier-sources`;

      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (
          key !== "supplierPdf" &&
          key !== "supplierImages"
        ) {
          formData.append(key, form[key]);
        }
      });

      if (form.supplierPdf) {
        formData.append("supplierPdf", form.supplierPdf);
      }

      formData.append(
        "sellingPrice",
        sellingPrice
      );

      formData.append(
        "subtotal",
        subtotal
      );

      formData.append(
        "sgstAmount",
        sgstAmount
      );

      formData.append(
        "cgstAmount",
        cgstAmount
      );

      formData.append(
        "grandTotal",
        grandTotal
      );

      if (form.supplierImages?.length) {
        form.supplierImages.forEach((file) => {
          formData.append("supplierImages", file);
        });
      }

      const res = await fetch(url, {
        method,
        headers,
        body: formData,
      });



      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Save failed");
        return;
      }

      toast.success(editingId ? "Supplier updated" : "Supplier added");
      resetForm();
      fetchSources();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const editSource = (source) => {
    setEditingId(source._id);
    setForm({
      componentName: source.componentName || "",
      partNumber: source.partNumber || "",
      brand: source.brand || "",
      supplierCompany: source.supplierCompany || "",
      contactPerson: source.contactPerson || "",
      phone: source.phone || "",
      whatsapp: source.whatsapp || "",
      email: source.email || "",
      address: source.address || "",
      purchasePrice: source.purchasePrice || "",

      gstPercent: source.gstPercent || 18,
      profitPercent: source.profitPercent || 20,
      extraCharge: source.extraCharge || 0,
      currency: source.currency || "INR",
      moq: source.moq || 1,
      leadTime: source.leadTime || "",
      lastPurchaseDate: source.lastPurchaseDate
        ? String(source.lastPurchaseDate).slice(0, 10)
        : "",
      availabilityStatus: source.availabilityStatus || "available",
      qualityNote: source.qualityNote || "",
      adminNote: source.adminNote || "",
      isPreferred: Boolean(source.isPreferred),
      isActive: source.isActive !== false,

      supplierPdf: null,
      supplierImages: [],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const importOffer = async () => {
    if (!configText.trim()) {
      toast.error("Paste supplier config");
      return;
    }

    try {
      const lines = configText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const parsedData = {};

      const itemLines = [];

      lines.forEach((line) => {
        if (line.includes("=")) {
          const [key, ...rest] = line.split("=");

          parsedData[key.trim()] =
            rest.join("=").trim();
        } else if (line.includes("|")) {
          itemLines.push(line);
        }
      });

      if (!itemLines.length) {
        toast.error("No items found");
        return;
      }

      const firstItem = itemLines[0].split("|");

      const partNumber = firstItem[0] || "";
      const brand = firstItem[1] || "";
      const packageName = firstItem[2] || "";
      const price = firstItem[3] || 0;

      setForm({
        componentName: partNumber,

        partNumber,

        brand,

        supplierCompany:
          parsedData.SUPPLIER || "",

        contactPerson:
          parsedData.CONTACT_PERSON || "",

        phone:
          parsedData.PHONE || "",

        whatsapp:
          parsedData.WHATSAPP || "",

        email:
          parsedData.EMAIL || "",

        address:
          parsedData.ADDRESS || "",

        purchasePrice:
          Number(price),

        gstPercent:
          Number(parsedData.GST || 18),

        profitPercent:
          Number(parsedData.PROFIT || 20),

        extraCharge:
          Number(parsedData.EXTRA || 0),

        currency: "INR",

        moq:
          Number(parsedData.MOQ || 1),

        leadTime:
          parsedData.LEAD_TIME || "",

        lastPurchaseDate: "",

        availabilityStatus:
          parsedData.STATUS || "available",

        qualityNote:
          parsedData.QUALITY_NOTE || "",

        adminNote:
          parsedData.ADMIN_NOTE ||
          packageName,

        isPreferred:
          parsedData.PREFERRED === "true",

        isActive: true,

        supplierPdf: null,

        supplierImages: [],
      });

      toast.success("Import applied to form");


    } catch (error) {
      console.log(error);

      toast.error("Import failed");
    }
  };

  const deleteSource = async (id) => {
    const ok = window.confirm("Delete this supplier source?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/supplier-sources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("Supplier deleted");
      fetchSources();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-[#eef6ff] p-4 lg:p-8">
      <div className="mb-6 rounded-[30px] bg-gradient-to-r from-[#0f4c81] via-[#0f6cbd] to-[#38bdf8] p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              <Truck size={18} />
              Supplier Source Database
            </div>

            <h1 className="text-3xl font-black lg:text-4xl">
              Supplier Sources
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50">
              Save supplier/company data for components. Use this database to
              quickly find where a component was previously purchased from.
            </p>
          </div>

          <button
            onClick={fetchSources}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-[#0f4c81] shadow-lg transition hover:bg-blue-50"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard title="Total Sources" value={stats.total} />
        <StatCard title="Preferred" value={stats.preferred} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Available" value={stats.available} />
      </div>

      <section className="mb-6 rounded-[28px] border border-blue-100 bg-white p-5 shadow-lg">

        <h2 className="mb-3 text-2xl font-black text-slate-900">
          Import Supplier Offer
        </h2>

        <p className="mb-4 text-sm text-slate-500">
          Paste supplier stock offer like .env variables.
        </p>

        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          rows={12}
          placeholder={`SUPPLIER=FORMIX INTERNATIONAL INDIA PRIVATE LIMITED
GST=18
PROFIT=20
EXTRA=10

LM324DT|ST|SOIC14|25
LM358DT|ST|SOIC8|30
LM339DT|ST|SOIC14|35`}
          className="w-full rounded-2xl border border-slate-200 p-4 font-mono text-sm outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={importOffer}
          className="mt-4 rounded-2xl bg-[#0f4c81] px-6 py-3 font-black text-white shadow hover:bg-[#0b3b66]"
        >
          Apply Import
        </button>
      </section>



      <section className="mb-6 rounded-[28px] border border-blue-100 bg-white p-5 shadow-lg">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf7ff] text-[#0f6cbd]">
            <Plus size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {editingId ? "Edit Supplier Source" : "Add Supplier Source"}
            </h2>
            <p className="text-sm text-slate-500">
              Component aur supplier details database me save karo.
            </p>
          </div>
        </div>

        <form onSubmit={submitSource} className="grid gap-4 md:grid-cols-3">
          <Input
            label="Component Name *"
            name="componentName"
            value={form.componentName}
            onChange={handleChange}
            placeholder="STM32F103C8T6 Microcontroller IC"
          />

          <Input
            label="Part Number / MPN"
            name="partNumber"
            value={form.partNumber}
            onChange={handleChange}
            placeholder="STM32F103C8T6"
          />

          <Input
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="STMicroelectronics"
          />

          <Input
            label="Supplier Company *"
            name="supplierCompany"
            value={form.supplierCompany}
            onChange={handleChange}
            placeholder="ABC Electronics Pvt Ltd"
          />

          <Input
            label="Contact Person"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            placeholder="Rahul Sharma"
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543210"
          />

          <Input
            label="WhatsApp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="9876543210"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="sales@example.com"
          />

          <Textarea
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
          />

          <Input
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="52"
          />

          <Input
            label="GST %"
            name="gstPercent"
            type="number"
            value={form.gstPercent}
            onChange={handleChange}
          />

          <Input
            label="Profit %"
            name="profitPercent"
            type="number"
            value={form.profitPercent}
            onChange={handleChange}
          />

          <Input
            label="Extra Charge"
            name="extraCharge"
            type="number"
            value={form.extraCharge}
            onChange={handleChange}
          />

          <Input
            label="MOQ"
            name="moq"
            type="number"
            value={form.moq}
            onChange={handleChange}
            placeholder="100"
          />

          <Input
            label="Lead Time"
            name="leadTime"
            value={form.leadTime}
            onChange={handleChange}
            placeholder="2-5 business days"
          />

          <Input
            label="Last Purchase Date"
            name="lastPurchaseDate"
            type="date"
            value={form.lastPurchaseDate}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-black text-slate-600">
              Availability Status
            </label>
            <select
              name="availabilityStatus"
              value={form.availabilityStatus}
              onChange={handleChange}
              className="h-12 w-full rounded-xl border border-slate-200 px-3 font-bold outline-none focus:border-blue-500"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              name="isPreferred"
              checked={form.isPreferred}
              onChange={handleChange}
            />
            Preferred Supplier
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active Source
          </label>

          <div className="md:col-span-3">
            <Textarea
              label="Quality Note"
              name="qualityNote"
              value={form.qualityNote}
              onChange={handleChange}
              placeholder="Original material, GST invoice support, date code available..."
            />
          </div>

          <div className="md:col-span-3">

            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-black text-slate-600">
                Supplier PDF
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    supplierPdf: e.target.files[0],
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-3"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-black text-slate-600">
                Supplier Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    supplierImages: Array.from(e.target.files),
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-3"
              />
            </div>
            <Textarea
              label="Admin Note"
              name="adminNote"
              value={form.adminNote}
              onChange={handleChange}
              placeholder="Internal note, supplier response, purchase remarks..."
            />
          </div>

          <div className="md:col-span-3 mt-4">

            <div className="rounded-[28px] border border-blue-100 bg-[#f8fbff] p-6">

              <h2 className="mb-6 text-3xl font-black text-[#0f172a]">
                quotation summary
              </h2>

              <div className="overflow-hidden rounded-2xl border border-slate-200">

                <table className="w-full">

                  <thead className="bg-[#2563eb] text-white">

                    <tr>

                      <th className="px-5 py-4 text-left">
                        component
                      </th>

                      <th className="px-5 py-4 text-center">
                        qty
                      </th>

                      <th className="px-5 py-4 text-center">
                        unit price
                      </th>

                      <th className="px-5 py-4 text-center">
                        total
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr className="bg-white">

                      <td className="px-5 py-5 font-black">
                        {form.partNumber || form.componentName}
                      </td>

                      <td className="px-5 py-5 text-center font-black">
                        {form.moq || 1}
                      </td>

                      <td className="px-5 py-5 text-center font-black">
                        ₹{sellingPrice.toFixed(2)}
                      </td>

                      <td className="px-5 py-5 text-center font-black">
                        ₹{finalItemTotal.toFixed(2)}
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          <div className="md:col-span-3 mt-4">

            <div className="rounded-[28px] border border-blue-100 bg-[#f8fbff] p-6">

              <h2 className="mb-6 text-3xl font-black text-[#0f172a]">
                pricing summary
              </h2>

              <div className="overflow-hidden rounded-2xl border border-slate-200">

                <table className="w-full">

                  <thead className="bg-[#0f4c81] text-white">

                    <tr>

                      <th className="px-5 py-4">
                        subtotal
                      </th>

                      <th className="px-5 py-4">
                        sgst
                      </th>

                      <th className="px-5 py-4">
                        cgst
                      </th>

                      <th className="px-5 py-4">
                        grand total
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr className="bg-white">

                      <td className="px-5 py-5 text-center text-2xl font-black">
                        ₹{subtotal.toFixed(2)}
                      </td>

                      <td className="px-5 py-5 text-center text-2xl font-black">
                        ₹{sgstAmount.toFixed(2)}
                      </td>

                      <td className="px-5 py-5 text-center text-2xl font-black">
                        ₹{cgstAmount.toFixed(2)}
                      </td>

                      <td className="px-5 py-5 text-center text-3xl font-black text-green-700">
                        ₹{grandTotal.toFixed(2)}
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          <div className="flex gap-3 md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-7 py-3 font-black text-white shadow transition hover:bg-[#0b3b66]"
            >
              <Save size={18} />
              {editingId ? "Update Supplier" : "Save Supplier"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 bg-white px-7 py-3 font-black text-slate-700 hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <div className="mb-6 grid gap-4 rounded-[26px] border border-blue-100 bg-white p-5 shadow-lg lg:grid-cols-[1fr_220px_160px]">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search component, part number, supplier, phone, email..."
            className="h-[54px] w-full rounded-2xl border border-slate-200 bg-[#f8fbff] py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-[54px] rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 text-sm font-bold outline-none transition focus:border-blue-500 focus:bg-white"
        >
          <option value="all">All Status</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          onClick={fetchSources}
          className="h-[54px] rounded-2xl bg-[#102033] px-6 font-black text-white shadow transition hover:bg-[#0f4c81]"
        >
          Search
        </button>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="rounded-[28px] bg-white p-10 text-center font-black shadow">
            Loading supplier sources...
          </div>
        ) : sources.length === 0 ? (
          <div className="rounded-[28px] bg-white p-10 text-center font-black shadow">
            No supplier sources found
          </div>
        ) : (
          sources.map((source) => (
            <SupplierCard
              key={source._id}
              source={source}
              onEdit={editSource}
              onDelete={deleteSource}
            />
          ))
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-md">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-[#0f4c81]">{value}</p>
    </div>
  );
}

function SupplierCard({ source, onEdit, onDelete }) {
  const whatsapp = normalizePhone(source.whatsapp || source.phone);

  return (
    <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-lg">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-[#f8fbff] p-5 xl:flex-row xl:items-center">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusStyles[source.availabilityStatus] ||
                statusStyles.available
                }`}
            >
              {source.availabilityStatus || "available"}
            </span>

            {source.isPreferred ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                <Star size={13} />
                Preferred
              </span>
            ) : null}

            {!source.isActive ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                Inactive
              </span>
            ) : null}
          </div>

          <h2 className="break-words text-2xl font-black text-slate-900">
            {source.componentName}
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            MPN: {source.partNumber || "N/A"} • Brand: {source.brand || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f4c81] px-6 py-4 text-white">
          <p className="text-xs font-bold uppercase text-blue-100">
            Last Price
          </p>
          <p className="text-3xl font-black">
            ₹ {Number(source.purchasePrice || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr_0.8fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
            Supplier Details
          </h3>

          <InfoBox label="Company" value={source.supplierCompany} />
          <InfoBox label="Contact Person" value={source.contactPerson || "N/A"} />
          <InfoBox label="Phone" value={source.phone || "N/A"} />
          <InfoBox label="WhatsApp" value={source.whatsapp || "N/A"} />
          <InfoBox label="Email" value={source.email || "N/A"} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
            Purchase Info
          </h3>

          <InfoBox label="MOQ" value={source.moq || 1} />
          <InfoBox label="Lead Time" value={source.leadTime || "N/A"} />
          <InfoBox
            label="Last Purchase"
            value={formatDate(source.lastPurchaseDate)}
          />
          <InfoBox label="Quality Note" value={source.qualityNote || "N/A"} />
          <InfoBox label="Admin Note" value={source.adminNote || "N/A"} />

          {source.supplierPdf ? (
            <a
              href={`${API_BASE}/${source.supplierPdf}`}
              target="_blank"
              className="mb-3 inline-flex w-full items-center justify-center rounded-xl bg-red-50 px-4 py-3 font-black text-red-700 hover:bg-red-100"
            >
              View Supplier PDF
            </a>
          ) : null}

          {source.supplierImages?.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-sm font-black text-slate-700">
                Supplier Images
              </p>

              <div className="grid grid-cols-2 gap-3">
                {source.supplierImages.map((img, index) => (
                  <a
                    key={index}
                    href={`${API_BASE}/${img}`}
                    target="_blank"
                  >
                    <img
                      src={`${API_BASE}/${img}`}
                      alt="supplier"
                      className="h-28 w-full rounded-xl object-cover border border-slate-200"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
            Quick Actions
          </h3>

          <div className="grid gap-3">
            {source.phone ? (
              <a
                href={`tel:${source.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-5 py-3 font-black text-white shadow-md hover:bg-[#0d5ea6] transition"
              >
                <Phone size={17} />
                Call Supplier
              </a>
            ) : null}

            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                  `Hello, we want to discuss availability for ${source.partNumber || source.componentName}.`
                )}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a86b] px-5 py-3 font-black text-white shadow-md hover:bg-[#009960] transition"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>
            ) : null}

            {source.email ? (
              <a
                href={`mailto:${source.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-black text-white shadow-md hover:bg-sky-600 transition"
              >
                <Mail size={17} />
                Email
              </a>
            ) : null}

            <button
              onClick={() => onEdit(source)}
              className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 font-black text-[#0f4c81] hover:bg-blue-100"
            >
              Edit Source
            </button>

            <Link
              href={`/admin/supplier-sources/${source._id}`}
              className="flex items-center justify-center rounded-xl border border-green-100 bg-green-50 px-5 py-3 font-black text-green-700 hover:bg-green-100"
            >
              View Details
            </Link>

            <button
              onClick={() => onDelete(source._id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-black text-red-600 hover:bg-red-100"
            >
              <Trash2 size={17} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-600">
        {label}
      </label>
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-slate-200 px-3 font-semibold outline-none focus:border-blue-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-600">
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500"
      />
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="mb-3 rounded-xl bg-white p-3">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-700">
        {value || "N/A"}
      </p>
    </div>
  );
}