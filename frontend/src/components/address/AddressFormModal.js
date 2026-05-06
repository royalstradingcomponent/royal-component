"use client";

import { useEffect, useState } from "react";
import { X, Loader2, LocateFixed } from "lucide-react";
import { useAddress } from "@/context/AddressContext";

const emptyForm = {
  fullName: "",
  phone: "",
  altPhone: "",
  pincode: "",
  city: "",
  state: "",
  addressLine: "",
  landmark: "",
  addressType: "HOME",
  isDefault: true,
  latitude: null,
  longitude: null,
  mapAddress: "",
  locationVerified: false,
};

export default function AddressFormModal({
  open,
  onClose,
  editingAddress = null,
}) {
  const { addAddress, updateAddress, actionLoading } = useAddress();

  const [form, setForm] = useState(emptyForm);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingAddress) {
      setForm({
        fullName: editingAddress.fullName || "",
        phone: editingAddress.phone || "",
        altPhone: editingAddress.altPhone || "",
        pincode: editingAddress.pincode || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        addressLine: editingAddress.addressLine || "",
        landmark: editingAddress.landmark || "",
        addressType: editingAddress.addressType || "HOME",
        isDefault: Boolean(editingAddress.isDefault),
        latitude: editingAddress.latitude || null,
        longitude: editingAddress.longitude || null,
        mapAddress: editingAddress.mapAddress || "",
        locationVerified: Boolean(editingAddress.locationVerified),
      });
    } else {
      setForm(emptyForm);
    }

    setPinError("");
  }, [editingAddress, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value.replace(/\D/g, "").slice(0, 10),
    }));
  };

  const handlePincodeChange = async (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 6);

    setForm((prev) => ({
      ...prev,
      pincode: clean,
    }));

    if (clean.length !== 6) {
      setPinError("");
      return;
    }

    try {
      setPinLoading(true);
      setPinError("");

      const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
      const data = await res.json();

      if (data?.[0]?.Status === "Success" && data?.[0]?.PostOffice?.length) {
        const office = data[0].PostOffice[0];

        setForm((prev) => ({
          ...prev,
          city: office.District || prev.city,
          state: office.State || prev.state,
        }));
      } else {
        setPinError("Invalid pincode");
      }
    } catch {
      setPinError("Pincode check failed");
    } finally {
      setPinLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setPinError("Location is not supported in this browser");
      return;
    }

    setLocationLoading(true);
    setPinError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationVerified: true,
          mapAddress: `GPS Verified: ${lat}, ${lng}`,
        }));

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setPinError("Please allow location permission");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      altPhone: form.altPhone.trim(),
      pincode: form.pincode.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      addressLine: form.addressLine.trim(),
      landmark: form.landmark.trim(),
      addressType: form.addressType,
      isDefault: form.isDefault,
      latitude: form.latitude,
      longitude: form.longitude,
      mapAddress: form.mapAddress,
      locationVerified: form.locationVerified,
    };

    if (!payload.fullName || !payload.phone || !payload.pincode || !payload.city || !payload.state || !payload.addressLine) {
      setPinError("Please fill all required fields");
      return;
    }
    if (payload.addressLine.length < 15) {
      setPinError("Please enter complete house / office / shop address");
      return;
    }

    if (!payload.locationVerified) {
      setPinError("Please use current location to verify delivery address");
      return;
    }

    if (editingAddress?._id) {
      await updateAddress(editingAddress._id, payload);
    } else {
      await addAddress(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#dbeafe] bg-[#f8fbff] px-6 py-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#102033]">
              {editingAddress ? "Edit Delivery Address" : "Add Delivery Address"}
            </h2>
            <p className="mt-1 text-sm text-[#607287]">
              Save address for faster wholesale checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#64748b] hover:bg-[#eaf3ff] hover:text-[#2454b5]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                placeholder="Receiver full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Phone *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handlePhoneChange("phone", e.target.value)}
                maxLength={10}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                placeholder="10 digit mobile number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Alternate Phone
              </label>
              <input
                type="tel"
                value={form.altPhone}
                onChange={(e) => handlePhoneChange("altPhone", e.target.value)}
                maxLength={10}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Pincode *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  maxLength={6}
                  className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                  placeholder="6 digit pincode"
                />
                {pinLoading ? (
                  <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-[#2454b5]" />
                ) : null}
              </div>
              {pinError ? (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {pinError}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                placeholder="City"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                placeholder="State"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Full Address *
              </label>
              <textarea
                name="addressLine"
                value={form.addressLine}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-[#cbd5e1] px-4 py-3 outline-none focus:border-[#2454b5]"
                placeholder="House / office / warehouse / shop address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
                placeholder="Near road, market, industrial area..."
              />
            </div>
            {/* 🔥 USE CURRENT LOCATION */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#2454b5] bg-[#eaf3ff] px-5 text-sm font-extrabold text-[#2454b5] hover:bg-[#dbeafe] disabled:opacity-60"
              >
                {locationLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LocateFixed size={18} />
                )}
                {locationLoading ? "Detecting Location..." : "Use Current Location"}
              </button>

              {form.locationVerified ? (
                <p className="mt-2 text-xs font-bold text-green-700">
                  ✅ Location verified (GPS)
                </p>
              ) : (
                <p className="mt-2 text-xs font-semibold text-[#607287]">
                  ⚠️ Please verify location before saving address
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-3 block text-sm font-bold text-[#334155]">
              Address Type
            </label>

            <div className="flex flex-wrap gap-3">
              {["HOME", "OFFICE", "WAREHOUSE", "FACTORY", "OTHER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, addressType: type }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${form.addressType === type
                    ? "border-[#2454b5] bg-[#2454b5] text-white"
                    : "border-[#cbd5e1] bg-white text-[#42566d] hover:border-[#2454b5]"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#334155]">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="h-4 w-4 accent-[#2454b5]"
            />
            Make this default delivery address
          </label>

          <div className="mt-7 flex gap-3 border-t border-[#e5edf5] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-lg border border-[#cbd5e1] bg-white font-bold text-[#42566d] hover:bg-[#f8fbff]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="h-12 flex-1 rounded-lg bg-[#2454b5] font-bold text-white hover:bg-[#1e4695] disabled:opacity-60"
            >
              {actionLoading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}