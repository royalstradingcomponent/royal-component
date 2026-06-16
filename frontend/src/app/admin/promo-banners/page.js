"use client";

import { useEffect, useState } from "react";
import { adminRequest, API_BASE } from "@/lib/api";

export default function PromoBannerAdmin() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        desktopImage: "",
        mobileImage: "",
        buttonText: "",
        buttonLink: "",
        position: "afterHero",
        bannerType: "full",
        sortOrder: 1,
        active: true,
    });

    async function loadBanners() {
        try {
            const res = await adminRequest(
                "/api/promo-banners"
            );

            setBanners(res.banners || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadBanners();
    }, []);

    async function uploadImage(file) {
        const fd = new FormData();

        fd.append("image", file);

        const res = await fetch(
            `${API_BASE}/api/upload`,
            {
                method: "POST",
                body: fd,
            }
        );

        const data = await res.json();

        return data.url;
    }

    async function handleImage(e, field) {
        const file = e.target.files[0];

        if (!file) return;

        setLoading(true);

        try {
            const url = await uploadImage(file);

            setForm((prev) => ({
                ...prev,
                [field]: url,
            }));
        } finally {
            setLoading(false);
        }
    }

    async function createBanner() {
        try {
            await adminRequest(
                "/api/promo-banners",
                {
                    method: "POST",
                    body: JSON.stringify(form),
                }
            );

            setForm({
                title: "",
                subtitle: "",
                desktopImage: "",
                mobileImage: "",
                buttonText: "",
                buttonLink: "",
                position: "afterHero",
                bannerType: "full",
                sortOrder: 1,
                active: true,
            });

            loadBanners();
        } catch (err) {
            alert(err.message);
        }
    }

    async function deleteBanner(id) {
        if (!confirm("Delete Banner?")) return;

        await adminRequest(
            `/api/promo-banners/${id}`,
            {
                method: "DELETE",
            }
        );

        loadBanners();
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Promo Banner Manager
            </h1>

            <div className="bg-white rounded-xl p-6 border mb-8">

                <div className="grid md:grid-cols-2 gap-4">

                    <input
                        placeholder="Title"
                        className="border p-3 rounded"
                        value={form.title}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                title: e.target.value,
                            })
                        }
                    />

                    <input
                        placeholder="Subtitle"
                        className="border p-3 rounded"
                        value={form.subtitle}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                subtitle: e.target.value,
                            })
                        }
                    />

                    <input
                        placeholder="Button Text"
                        className="border p-3 rounded"
                        value={form.buttonText}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                buttonText: e.target.value,
                            })
                        }
                    />

                    <input
                        placeholder="Button Link"
                        className="border p-3 rounded"
                        value={form.buttonLink}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                buttonLink: e.target.value,
                            })
                        }
                    />

                    <select
                        className="border p-3 rounded"
                        value={form.position}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                position: e.target.value,
                            })
                        }
                    >
                        <option value="afterHero">
                            After Hero
                        </option>

                        <option value="afterCategories">
                            After Categories
                        </option>

                        <option value="afterProducts">
                            After Products
                        </option>

                        <option value="afterTrendingProducts">
                            After Trending Products
                        </option>

                        <option value="beforeFooter">
                            Before Footer
                        </option>
                    </select>

                    <select
                        className="border p-3 rounded"
                        value={form.bannerType}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                bannerType: e.target.value,
                            })
                        }
                    >
                        <option value="full">
                            Single Banner
                        </option>

                        <option value="two-column">
                            2 Banner Layout
                        </option>

                        <option value="three-column">
                            3 Banner Layout
                        </option>

                        <option value="four-column">
                            4 Banner Layout
                        </option>
                    </select>

                    <div>
                        <label>
                            Desktop Image
                        </label>

                        <input
                            type="file"
                            onChange={(e) =>
                                handleImage(
                                    e,
                                    "desktopImage"
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>
                            Mobile Image
                        </label>

                        <input
                            type="file"
                            onChange={(e) =>
                                handleImage(
                                    e,
                                    "mobileImage"
                                )
                            }
                        />
                    </div>
                </div>

                <button
                    onClick={createBanner}
                    disabled={loading}
                    className="mt-6 px-6 py-3 bg-black text-white rounded"
                >
                    Save Banner
                </button>
            </div>

            <div className="grid gap-4">

                {banners.map((banner) => (
                    <div
                        key={banner._id}
                        className="border rounded-xl p-4 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-bold">
                                {banner.title}
                            </h3>

                            <p>
                                {banner.position}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                deleteBanner(
                                    banner._id
                                )
                            }
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}