"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function ProductMatchBox({ productId }) {
    const [image, setImage] = useState(null);
    const [componentName, setComponentName] = useState("");
    const [partNumber, setPartNumber] = useState("");
    const [brand, setBrand] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSearch = async () => {
        if (!image && !componentName && !partNumber && !brand) {
            setErrorMessage("Please upload image or enter component details");

            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

        try {
            setLoading(true);
            setErrorMessage("");
            setResult(null);

            const formData = new FormData();

            if (image) {
                formData.append("image", image);
            }
            formData.append("productId", productId);

            formData.append("componentName", componentName);

            formData.append("partNumber", partNumber);

            formData.append("brand", brand);

            const response = await fetch(`${API_BASE}/api/products/check-match`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            setResult(data);

            if (data?.products?.length > 0) {
                setSuccessMessage(
                    `${data.products.length} matching component(s) found`
                );

                setErrorMessage("");
            } else {
                setSuccessMessage("");

                setErrorMessage(
                    "No matching components found"
                );
            }
        } catch (error) {
            console.error(error);

            setErrorMessage(
                "Unable to check component match"
            );

            setSuccessMessage("");

            setResult({
                success: false,
                message: "Match failed",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-5 rounded-sm border border-[#dbe7f3] bg-[#f8fbff] p-4">
            <h3 className="text-[16px] font-bold text-[#111827]">
                Match Your Component
            </h3>

            <p className="mt-1 text-[13px] text-slate-600">
                Upload your component image and compare with this product
            </p>

            <div className="mt-4 grid gap-3">
                <input
                    type="text"
                    placeholder="Component Name"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    className="h-[44px] rounded-sm border border-[#dbe4f0] bg-white px-3 text-[14px] outline-none"
                />

                <input
                    type="text"
                    placeholder="Part Number"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="h-[44px] rounded-sm border border-[#dbe4f0] bg-white px-3 text-[14px] outline-none"
                />

                <input
                    type="text"
                    placeholder="Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="h-[44px] rounded-sm border border-[#dbe4f0] bg-white px-3 text-[14px] outline-none"
                />
            </div>

            {successMessage && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {errorMessage}
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <label className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-sm bg-[#2452c6] px-4 text-[14px] font-semibold text-white hover:bg-[#1e40af]">
                    Upload
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />

                </label>

                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    className="inline-flex h-[44px] items-center justify-center rounded-sm bg-[#111827] px-4 text-[14px] font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Checking...
                        </span>
                    ) : (
                        "Check Match"
                    )}
                </button>


            </div>

            {image && (
                <div className="mt-4">
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Uploaded component"
                        className="h-24 w-24 rounded-lg border border-[#dbe4f0] object-cover"
                    />
                </div>
            )}

            {result && result?.products?.length === 0 && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    No matching components found
                </div>
            )}

            {result?.products?.length > 0 && (
                <div className="mt-5 space-y-3">
                    {result.products.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-xl border border-[#dbe4f0] bg-white p-3"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        item.thumbnail?.startsWith("http")
                                            ? item.thumbnail
                                            : `${API_BASE}${item.thumbnail}`
                                    }
                                    alt={item.name}
                                    className="h-16 w-16 rounded-lg object-cover"
                                />

                                <div>
                                    <h3 className="font-bold">{item.name}</h3>

                                    <p className="text-sm text-gray-500">{item.brand}</p>

                                    <p
                                        className={`mt-1 text-sm font-semibold ${item.similarity >= 80
                                            ? "text-green-600"
                                            : item.similarity >= 50
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        Match Score:
                                        {item.similarity}%
                                    </p>

                                    <a
                                        href={`/product/${item.slug}`}
                                        className="mt-2 inline-flex text-sm font-semibold text-[#2452c6] hover:underline"
                                    >
                                        View Product
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
