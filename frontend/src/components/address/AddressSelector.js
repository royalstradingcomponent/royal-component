"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, CheckCircle2, Search } from "lucide-react";
import { useAddress } from "@/context/AddressContext";
import AddressFormModal from "./AddressFormModal";

export default function AddressSelector() {
  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    loading,
    fetchAddresses,
    deleteAddress,
    setDefaultAddress,
  } = useAddress();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const filteredAddresses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return addresses;

    return addresses.filter((addr) =>
      [
        addr.fullName,
        addr.phone,
        addr.addressLine,
        addr.landmark,
        addr.city,
        addr.state,
        addr.pincode,
        addr.addressType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [addresses, search]);

  const handleAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  return (
    <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
            <MapPin size={22} />
          </div>

          <div>
            <h2 className="text-[24px] font-extrabold text-[#102033]">
              Delivery Address
            </h2>
            <p className="mt-1 text-sm text-[#607287]">
              Select saved address or add a new address for this wholesale order.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2454b5] px-5 text-sm font-bold text-white hover:bg-[#1e4695]"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-[#94a3b8]" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#cbd5e1] pl-10 pr-4 text-sm outline-none focus:border-[#2454b5]"
              placeholder="Search by name, phone, city, pincode..."
            />
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-[#e5edf5] bg-[#f8fbff] p-6 text-center text-[#607287]">
          Loading addresses...
        </div>
      ) : filteredAddresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#bfd7f5] bg-[#f8fbff] p-8 text-center">
          <MapPin className="mx-auto mb-3 text-[#2454b5]" size={40} />
          <h3 className="text-lg font-bold text-[#102033]">No address found</h3>
          <p className="mt-1 text-sm text-[#607287]">
            Add your delivery address to continue checkout.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-5 rounded-lg bg-[#2454b5] px-5 py-3 text-sm font-bold text-white hover:bg-[#1e4695]"
          >
            Add Delivery Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAddresses.map((addr) => {
            const id = String(addr._id);
            const selected = String(selectedAddressId) === id;

            return (
              <div
                key={id}
                onClick={() => setSelectedAddressId(id)}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  selected
                    ? "border-[#2454b5] bg-[#edf3ff]"
                    : "border-[#dbe5f0] bg-white hover:border-[#8bb7ee]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    checked={selected}
                    onChange={() => setSelectedAddressId(id)}
                    className="mt-1 h-4 w-4 accent-[#2454b5]"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-[#102033]">
                        {addr.fullName}
                      </h3>

                      <span className="rounded-full border border-[#2454b5] bg-white px-2 py-0.5 text-[10px] font-extrabold text-[#2454b5]">
                        {addr.addressType || "ADDRESS"}
                      </span>

                      {addr.isDefault ? (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-extrabold text-green-700">
                          DEFAULT
                        </span>
                      ) : null}

                      {selected ? (
                        <CheckCircle2 size={17} className="text-[#2454b5]" />
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#607287]">
                      {addr.addressLine}
                      {addr.landmark ? `, ${addr.landmark}` : ""}, {addr.city},{" "}
                      {addr.state} - {addr.pincode}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#334155]">
                      Mobile: {addr.phone}
                      {addr.altPhone ? ` / ${addr.altPhone}` : ""}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(addr);
                        }}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 text-xs font-bold text-[#334155] hover:border-[#2454b5] hover:text-[#2454b5]"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDefaultAddress(id);
                          }}
                          className="h-9 rounded-lg border border-[#cbd5e1] bg-white px-4 text-xs font-bold text-[#334155] hover:border-[#2454b5] hover:text-[#2454b5]"
                        >
                          Make Default
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAddress(id);
                        }}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAddress ? (
        <div className="mt-5 rounded-xl border border-[#bfd7f5] bg-[#f8fbff] p-4">
          <p className="text-sm font-bold text-[#2454b5]">Selected delivery address</p>
          <p className="mt-1 text-sm text-[#334155]">
            {selectedAddress.fullName}, {selectedAddress.phone} —{" "}
            {selectedAddress.addressLine}, {selectedAddress.city},{" "}
            {selectedAddress.state} - {selectedAddress.pincode}
          </p>
        </div>
      ) : null}

      <AddressFormModal
        open={modalOpen}
        editingAddress={editingAddress}
        onClose={() => {
          setModalOpen(false);
          setEditingAddress(null);
        }}
      />
    </section>
  );
}