"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function HomeDecorSectionPage() {
    const [form, setForm] = useState({
        sectionTitle: "Trending & New Launches",
        products: [],
    });

    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await fetch(
            `${API}/api/home-decor-info`
        );

        const data = await res.json();

        

        if (data) {
            setForm(data);
        }
    };

    const uploadImage = async (
        file,
        index
    ) => {
        try {
            setUploading(true);

            const fd = new FormData();

            fd.append("image", file);
            fd.append("type", "home-decor");

            const res = await fetch(
                `${API}/api/upload`,
                {
                    method: "POST",
                    body: fd,
                }
            );

            const data = await res.json();

            const updated = [...form.products];

            updated[index].image =
                data.url;

            setForm({
                ...form,
                products: updated,
            });
        } finally {
            setUploading(false);
        }
    };

    const uploadHoverImage = async (
        file,
        index
    ) => {
        try {
            setUploading(true);

            const fd = new FormData();

            fd.append("image", file);
            fd.append("type", "home-decor");

            const res = await fetch(
                `${API}/api/upload`,
                {
                    method: "POST",
                    body: fd,
                }
            );

            const data = await res.json();

            const updated = [...form.products];

            updated[index].hoverImage =
                data.url;

            setForm({
                ...form,
                products: updated,
            });
        } finally {
            setUploading(false);
        }
    };

    const saveData = async () => {
        try {
            const updatedProducts = await Promise.all(
                form.products.map(async (item) => {
                    if (!item.sku) return item;

                    try {
                        const res = await fetch(
                            `${API}/api/products?limit=5000`
                        );

                        const data = await res.json();

                        const product = data?.products?.find(
                            (p) =>
                                p.sku?.trim()?.toLowerCase() ===
                                item.sku?.trim()?.toLowerCase()
                        );

                        console.log("PRODUCT ID =", product?._id);
console.log("PRODUCT SLUG =", product?.slug);

                        if (product?.slug) {
                            return {
                                ...item,

                                productId: product._id,

                                slug: product.slug,

                                buttonLink: `/product/${product.slug}`,
                            };
                        }
                        return item;
                    } catch {
                        return item;
                    }
                })
            );

            const res = await fetch(
                `${API}/api/home-decor-info`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...form,
                        products: updatedProducts,
                    }),
                }
            );

            if (res.ok) {
                setForm({
                    ...form,
                    products: updatedProducts.map((p) => ({
                        ...p,
                        isEditing: false,
                    })),
                });

                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {showSuccess && (
                <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse">
                    ✅ Saved Successfully
                </div>
            )}

            <div className="bg-white p-6 rounded-3xl">

                <h1 className="text-3xl font-bold mb-6">
                    Trending Products
                </h1>

                <input
                    value={form.sectionTitle}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            sectionTitle:
                                e.target.value,
                        })
                    }
                    className="border p-3 rounded-xl w-full mb-6"
                />

                <input
                    value={form.viewAllText || ""}
                    placeholder="View All Button Text"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            viewAllText: e.target.value,
                        })
                    }
                    className="border p-3 rounded-xl w-full mb-4"
                />

                <input
                    value={form.viewAllLink || ""}
                    placeholder="View All Link"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            viewAllLink: e.target.value,
                        })
                    }
                    className="border p-3 rounded-xl w-full mb-6"
                />

                <button
                    onClick={() =>
                        setForm({
                            ...form,
                            products: [
                                ...form.products,
                                {
                                    productId: "",

                                    slug: "",

                                    image: "",

                                    hoverImage: "",

                                    title: "",

                                    shortDescription: "",

                                    category: "",

                                    sku: "",

                                    badge: "",

                                    price: "",

                                    mrp: "",

                                    discount: "",

                                    buttonText: "Add To Cart",

                                    buttonLink: "#",

                                    isFeatured: false,

                                    isNewLaunch: false,

                                    sortOrder: 0,
                                    isEditing: true,
                                }
                            ],
                        })
                    }
                    className="bg-green-600 text-white px-6 py-3 rounded-xl mb-6"
                >
                    Add Product
                </button>

                <div className="space-y-6">

                    {form.products.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 bg-white p-6 rounded-3xl shadow-sm"
                            >

                                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">

                                    <div className="flex items-center gap-4">

                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border bg-gray-100">

                                            {item.image ? (
                                                <img
                                                    src={
                                                        item.image?.startsWith("http")
                                                            ? item.image
                                                            : `${API}${item.image}`
                                                    }
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                                    📦
                                                </div>
                                            )}

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-gray-900">
                                                {item.title || `Product ${index + 1}`}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {item.category || "No Category"}
                                            </p>

                                            {item.badge && (
                                                <span className="inline-flex mt-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {item.badge}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const p = [...form.products];

                                                p[index].isEditing =
                                                    !p[index].isEditing;

                                                setForm({
                                                    ...form,
                                                    products: p,
                                                });
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
                                        >
                                            {item.isEditing ? "Close" : "Edit"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...form.products];

                                                updated.splice(index, 1);

                                                setForm({
                                                    ...form,
                                                    products: updated,
                                                });
                                            }}
                                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                                {item.isEditing && (
                                    <>
                                        <label className="block mb-4">

                                            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition">

                                                <div className="text-5xl mb-3">
                                                    📸
                                                </div>

                                                <h4 className="text-lg font-bold text-gray-800">
                                                    Upload Product Image
                                                </h4>

                                                <p className="text-gray-500 mt-2">
                                                    Click here to select image
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    JPG, PNG, WEBP Supported
                                                </p>

                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    uploadImage(
                                                        e.target.files[0],
                                                        index
                                                    )
                                                }
                                                className="hidden"
                                            />

                                        </label>

                                        {item.image && (
                                            <div className="mb-6 rounded-2xl border-2 border-green-200 bg-green-50 p-4">

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-green-600 text-xl">✅</span>
                                                    <p className="font-bold text-green-700">
                                                        Product Image Uploaded Successfully
                                                    </p>
                                                </div>

                                                <img
                                                    src={item.image}
                                                    alt="Product"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                    className="w-full max-w-[300px] h-[220px] object-contain rounded-xl border bg-white shadow"
                                                />

                                                <p className="text-xs text-gray-600 break-all mt-3">
                                                    {item.image}
                                                </p>

                                            </div>
                                        )}

                                        {item.hoverImage && (
                                            <div className="mb-5">
                                                <p className="text-orange-600 font-semibold mb-2">
                                                    🔄 Hover Image Uploaded
                                                </p>

                                                <img
                                                    src={
                                                        item.hoverImage?.startsWith("http")
                                                            ? item.hoverImage
                                                            : `${API}${item.hoverImage}`
                                                    }
                                                    alt=""
                                                    className="w-[150px] h-[150px] object-cover rounded-xl border shadow-md"
                                                />
                                            </div>
                                        )}

                                        <label className="block mb-4">

                                            <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center cursor-pointer">

                                                <div className="text-4xl">
                                                    🔄
                                                </div>

                                                <h4 className="font-bold">
                                                    Upload Hover Image
                                                </h4>

                                                <p className="text-sm text-gray-500">
                                                    Hover par dikhne wali image
                                                </p>

                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    uploadHoverImage(
                                                        e.target.files[0],
                                                        index
                                                    )
                                                }
                                                className="hidden"
                                            />

                                        </label>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <input
                                                placeholder="Title"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const p = [
                                                        ...form.products,
                                                    ];

                                                    p[index].title =
                                                        e.target.value;

                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />

                                            <input
                                                placeholder="Price"
                                                value={item.price}
                                                onChange={(e) => {
                                                    const p = [
                                                        ...form.products,
                                                    ];

                                                    p[index].price =
                                                        e.target.value;

                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />

                                            <input
                                                placeholder="MRP"
                                                value={item.mrp}
                                                onChange={(e) => {
                                                    const p = [
                                                        ...form.products,
                                                    ];

                                                    p[index].mrp =
                                                        e.target.value;

                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />

                                            <input
                                                placeholder="Discount"
                                                value={item.discount}
                                                onChange={(e) => {
                                                    const p = [
                                                        ...form.products,
                                                    ];

                                                    p[index].discount =
                                                        e.target.value;

                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full"
                                            />

                                            <input
                                                placeholder="Category"
                                                value={item.category}
                                                onChange={(e) => {
                                                    const p = [...form.products];
                                                    p[index].category = e.target.value;
                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />

                                            <input
                                                placeholder="Badge (NEW / HOT)"
                                                value={item.badge}
                                                onChange={(e) => {
                                                    const p = [...form.products];
                                                    p[index].badge = e.target.value;
                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />

                                            <input
                                                placeholder="SKU"
                                                value={item.sku}
                                                onChange={(e) => {
                                                    const p = [...form.products];
                                                    p[index].sku = e.target.value;
                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />


                                            <input
                                                placeholder="Button Link"
                                                value={item.buttonLink || ""}
                                                onChange={(e) => {
                                                    const p = [...form.products];

                                                    p[index].buttonLink = e.target.value;

                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />
                                            <textarea
                                                placeholder="Short Description"
                                                value={item.shortDescription}
                                                onChange={(e) => {
                                                    const p = [...form.products];
                                                    p[index].shortDescription = e.target.value;
                                                    setForm({
                                                        ...form,
                                                        products: p,
                                                    });
                                                }}
                                                className="border p-3 rounded-xl w-full mb-3"
                                            />

                                        </div>
                                    </>

                                )}


                            </div>

                        )
                    )}

                </div>



                <button
                    onClick={saveData}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl mt-8 w-full text-lg font-semibold"
                >
                    Save Section
                </button>



            </div>
        </>

    );
}