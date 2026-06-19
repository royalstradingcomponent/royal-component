"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Mail, Phone, Building2, MessageCircle, Edit2, Clock } from "lucide-react";
import { getContacts, createContact, updateContact } from "@/lib/crmApi";

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [selectedContact, setSelectedContact] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        company: "",
        status: "new",
        assignedAgent: "",
        tags: "",
        source: "website",
        notes: "",
    });

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await getContacts();
            setContacts(data.contacts || []);
            if (data.contacts && data.contacts.length > 0) {
                setSelectedContact(data.contacts[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateContact = async () => {
        try {
            const payload = {
                ...formData,
                status: formData.status,
                source: formData.source,
                tags: formData.tags
                    ? formData.tags.split(",").map((tag) => tag.trim())
                    : [],
            };

            await createContact(payload);
            setShowModal(false);
            setFormData({
                name: "",
                phone: "",
                email: "",
                company: "",
                status: "new",
                assignedAgent: "",
                tags: "",
                source: "website",
                notes: "",
            });
            loadContacts();
        } catch (error) {
            console.error(error);
            alert("Failed to create contact");
        }
    };

    const handleUpdateContact = async () => {
        try {
            await updateContact(editData._id, editData);
            setEditModal(false);
            loadContacts();
        } catch (error) {
            console.log(error);
            alert("Failed to update contact");
        }
    };

    const filteredContacts = contacts.filter((contact) =>
        `${contact.name} ${contact.phone} ${contact.email}`
            .toLowerCase()
            .includes(search.toLowerCase()),
    );

    const timeline = selectedContact?.activities?.length
        ? selectedContact.activities
        : [
            {
                title: "Contact Created",
                description: "New CRM Contact",
                createdAt: selectedContact?.createdAt,
            },
        ];

    const getStatusColor = (status) => {
        switch (status) {
            case "new":
                return "bg-yellow-100 text-yellow-700";
            case "qualified":
                return "bg-blue-100 text-blue-700";
            case "customer":
                return "bg-green-100 text-green-700";
            case "lost":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F7FFFA] to-[#F5F8FC] p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8 md:mb-10 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-[#111827]">
                    AI Sensy <span className="text-[#00C853]">Contacts</span>
                </h1>
                <p className="mt-3 md:mt-4 text-lg md:text-2xl text-slate-500">
                    Manage all your WhatsApp contacts in one place
                </p>
                <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
                    <div className="rounded-full border border-gray-300 bg-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                        Smart Contact Management
                    </div>
                    <div className="rounded-full border border-gray-300 bg-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                        Real-time Sync
                    </div>
                    <div className="rounded-full border border-gray-300 bg-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                        Activity Timeline
                    </div>
                    <div className="rounded-full border border-gray-300 bg-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                        Team Collaboration
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading contacts...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
                    {/* LEFT CONTACT LIST */}
                    <div className="xl:col-span-3">
<div className="rounded-[32px] bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white shadow-2xl overflow-hidden">
                            {/* Search Bar */}
                            <div className="p-3 md:p-4 border-b border-[#E5EAF2]">
                               <div className="flex items-center rounded-2xl border border-[#334155] px-3 md:px-4 py-2 md:py-3 bg-[#1E293B]">
                                    <Search size={16} className="md:size-[18px] text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search contacts..."
className="ml-2 md:ml-3 w-full bg-transparent text-white placeholder:text-slate-400 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Contact List */}
                            <div className="p-2 md:p-3 space-y-2 md:space-y-3 max-h-[600px] md:max-h-[800px] overflow-y-auto">
                                {filteredContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        onClick={() => setSelectedContact(contact)}
                                        className={`cursor-pointer rounded-2xl md:rounded-[30px] border p-3 md:p-5 transition-all hover:shadow-lg ${selectedContact?._id === contact._id
                                                ? "bg-gradient-to-r from-[#DCFCE7] to-[#F0FDF4] border-[#22C55E] shadow-xl shadow-md"
                                                : "bg-white border-[#E5EAF2]"
                                            }`}
                                    >
                                        <div className="flex gap-2 md:gap-3">
                                            <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] shadow-lg text-white flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">
                                                {contact.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[#102033] text-sm md:text-base truncate">
                                                    {contact.name}
                                                </h3>
                                                <p className="mt-1 text-xs md:text-sm text-slate-500 truncate">
                                                    {contact.phone}
                                                </p>
                                                <p className="mt-1 text-xs md:text-sm text-slate-500 truncate">
                                                    {contact.notes || "No Messages"}
                                                </p>
                                                <div className="mt-2 flex items-center justify-between gap-1">
                                                    <span className={`rounded-full px-2 md:px-3 py-1 text-xs font-medium ${getStatusColor(contact.status)}`}>
                                                        {contact.status}
                                                    </span>
                                                    {contact.lastMessageAt && (
                                                        <span className="text-xs text-slate-400 flex-shrink-0">
                                                            {new Date(contact.lastMessageAt).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Contact Button */}
                            <div className="p-3 md:p-4 border-t border-[#E5EAF2] bg-white">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full h-10 md:h-12 rounded-xl bg-gradient-to-r from-[#00C853] to-[#00A63E] text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <Plus size={18} />
                                    Add Contact
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CENTER PROFILE */}
                    <div className="xl:col-span-5">
                        <div className="rounded-2xl md:rounded-[28px] bg-white border border-[#E5EAF2] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 md:p-8">
                            {selectedContact ? (
                                <>
                                    {/* Avatar Section */}
                                    <div className="text-center mb-6 md:mb-8">
                                        <div className="mx-auto h-20 md:h-28 w-20 md:w-28 rounded-full bg-gradient-to-br
from-[#22C55E]
to-[#16A34A]
shadow-lg text-white flex items-center justify-center text-3xl md:text-5xl font-bold shadow-lg">
                                            {selectedContact.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <h2 className="mt-4 md:mt-5 text-2xl md:text-3xl font-bold text-[#102033]">
                                            {selectedContact.name}
                                        </h2>
                                        <p className="text-sm md:text-base text-slate-500 mt-1">{selectedContact.phone}</p>
                                        <div className="mt-3">
                                            <span className="inline-block rounded-full bg-green-100 px-3 md:px-4 py-1 text-xs md:text-sm text-green-700 font-medium">
                                                Online
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="rounded-2xl md:rounded-3xl border border-[#E5EAF2] p-4 md:p-6 mb-6">
                                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Email</p>
                                                <p className="font-semibold text-sm md:text-base break-all">
                                                    {selectedContact.email || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                                                <span className={`inline-block rounded-full px-3 py-1 text-xs md:text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                                                    {selectedContact.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Company</p>
                                                <p className="font-semibold text-sm md:text-base">
                                                    {selectedContact.company || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Assigned Agent</p>
                                                <p className="font-semibold text-sm md:text-base">
                                                    {selectedContact.assignedAgent || "Unassigned"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Source</p>
                                                <p className="font-semibold text-sm md:text-base">
                                                    {selectedContact.source}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">Tags</p>
                                                <p className="font-semibold text-sm md:text-base">
                                                    {selectedContact.tags?.join(", ") || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <hr className="my-4 md:my-6" />

                                        <div>
                                            <h3 className="font-bold text-sm md:text-base mb-2">Notes</h3>
                                            <p className="text-slate-600 text-sm md:text-base">
                                                {selectedContact.notes || "No notes available"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                                        <div className="rounded-2xl md:rounded-3xl bg-[#F8FAFD] p-3 md:p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Lead Score</p>
                                            <p className="text-xl md:text-2xl font-black text-[#00C853]">
                                                {selectedContact.leadScore || 50}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl md:rounded-3xl bg-[#F8FAFD] p-3 md:p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Customer Value</p>
                                            <p className="text-xl md:text-2xl font-black text-[#2563EB]">
                                                ₹{selectedContact.customerValue || 0}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl md:rounded-3xl bg-[#F8FAFD] p-3 md:p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Created</p>
                                            <p className="font-bold text-sm md:text-base">
                                                {selectedContact.createdAt
                                                    ? new Date(selectedContact.createdAt).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl md:rounded-3xl bg-[#F8FAFD] p-3 md:p-4">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Updated</p>
                                            <p className="font-bold text-sm md:text-base">
                                                {selectedContact.updatedAt
                                                    ? new Date(selectedContact.updatedAt).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                        <button
                                            onClick={() =>
                                                window.open(`https://wa.me/${selectedContact.phone}`, "_blank")
                                            }
                                            className="flex-1 h-10 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-[#00C853] to-[#00A63E] text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditData(selectedContact);
                                                setEditModal(true);
                                            }}
                                            className="flex-1 h-10 md:h-12 rounded-lg md:rounded-xl bg-[#EEF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-semibold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-[#DBEAFE] transition-all"
                                        >
                                            <Edit2 size={18} />
                                            Edit
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-96 text-center">
                                    <div className="text-5xl mb-4">📭</div>
                                    <p className="text-gray-500 text-lg">No contact selected</p>
                                    <p className="text-gray-400 text-sm mt-2">Select a contact from the list to view details</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT TIMELINE */}
                    <div className="xl:col-span-4">
                        <div className="rounded-2xl md:rounded-[24px] bg-white border border-[#E5EAF2] shadow-sm p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                                <Clock size={24} className="text-[#00C853]" />
                                Activity Timeline
                            </h2>

                            {selectedContact ? (
                                <div className="relative">
                                    <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-[#E5EAF2]" />

                                    {timeline.map((item, index) => (
                                        <div key={index} className="relative pl-10 md:pl-12 pb-6 md:pb-8">
                                            <div className="absolute left-0 top-1 h-8 md:h-10 w-8 md:w-10 rounded-lg md:rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-lg">
                                                🟢
                                            </div>

                                            <h4 className="font-semibold text-[#102033] text-sm md:text-base">
                                                {item.title}
                                            </h4>

                                            {item.description && (
                                                <p className="text-xs md:text-sm text-slate-500 mt-1">
                                                    {item.description}
                                                </p>
                                            )}

                                            {item.createdAt && (
                                                <p className="text-xs text-slate-400 mt-2">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Select a contact to view activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Contact Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl md:rounded-3xl bg-white p-6">
                        <h2 className="mb-6 text-2xl font-bold">Add Contact</h2>

                        <div className="space-y-4">
                            <input
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                placeholder="Company"
                                value={formData.company}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        company: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                placeholder="Assigned Agent"
                                value={formData.assignedAgent}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        assignedAgent: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                placeholder="Tags (comma separated)"
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tags: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            >
                                <option value="new">New</option>
                                <option value="qualified">Qualified</option>
                                <option value="customer">Customer</option>
                                <option value="lost">Lost</option>
                            </select>

                            <select
                                value={formData.source}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        source: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            >
                                <option value="website">Website</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option>
                                <option value="manual">Manual</option>
                            </select>

                            <textarea
                                rows={4}
                                placeholder="Notes"
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notes: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-xl border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreateContact}
                                className="rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] shadow-lg px-5 py-2 font-semibold text-white transition-all"
                            >
                                Save Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Contact Modal */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl md:rounded-3xl bg-white p-6">
                        <h2 className="mb-6 text-2xl font-bold">Edit Contact</h2>

                        <div className="space-y-4">
                            <input
                                value={editData.name || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Name"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                value={editData.phone || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Phone"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                value={editData.email || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Email"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <input
                                value={editData.company || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        company: e.target.value,
                                    })
                                }
                                placeholder="Company"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />

                            <textarea
                                rows={4}
                                value={editData.notes || ""}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        notes: e.target.value,
                                    })
                                }
                                placeholder="Notes"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setEditModal(false)}
                                className="rounded-xl border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateContact}
                                className="rounded-xl bg-gradient-to-br
from-[#22C55E]
to-[#16A34A]
shadow-lg px-5 py-2 font-semibold text-white hover:bg-[#00A63E] transition-all"
                            >
                                Update Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
