"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function ImageMatchBox() {
    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState("");

    const [zoom, setZoom] = useState(1);

    const [dragging, setDragging] = useState(false);

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [start, setStart] = useState({
        x: 0,
        y: 0,
    });

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    const handleUpload = async (file) => {
        if (!file) return;

        setImage(file);

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();

        formData.append("image", file);

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE}/api/products/search-image`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            setProducts(data.products || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();

        if (e.deltaY < 0) {
            setZoom((prev) => Math.min(prev + 0.2, 5));
        } else {
            setZoom((prev) => Math.max(prev - 0.2, 1));
        }
    };

    const handleMouseDown = (e) => {
        setDragging(true);

        setStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;

        setPosition({
            x: e.clientX - start.x,
            y: e.clientY - start.y,
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const resetZoom = () => {
        setZoom(1);

        setPosition({
            x: 0,
            y: 0,
        });
    };

    return (
        <div className="mt-6 rounded-xl border border-[#dbe4f0] bg-white p-5">

            <h2 className="text-[24px] font-bold text-[#111827]">
                Match By Component Image
            </h2>

            <p className="mt-2 text-[15px] text-slate-600">
                Upload component image and find similar products instantly
            </p>

            <div className="mt-5">

                <label className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbd5e1] bg-[#f8fbff] p-6 transition hover:border-[#2452c6]">

                    {!preview ? (
                        <>
                            <div className="text-[18px] font-semibold text-[#2452c6]">
                                Upload Component Image
                            </div>

                            <div className="mt-2 text-sm text-slate-500">
                                JPG, PNG, WEBP
                            </div>
                        </>
                    ) : (

                        <div className="w-full">

                            <div className="mb-4 flex items-center justify-center gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setZoom((prev) => Math.min(prev + 0.2, 5))
                                    }
                                    className="rounded-lg bg-[#2452c6] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Zoom In
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setZoom((prev) => Math.max(prev - 0.2, 1))
                                    }
                                    className="rounded-lg bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Zoom Out
                                </button>

                                <button
                                    type="button"
                                    onClick={resetZoom}
                                    className="rounded-lg border border-[#dbe4f0] bg-white px-4 py-2 text-sm font-semibold text-[#111827]"
                                >
                                    Reset
                                </button>

                            </div>

                            <div
                                className="relative h-[700px] w-full overflow-auto rounded-xl bg-white"
                                onWheel={handleWheel}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >

                                <img
                                    src={preview}
                                    alt="Preview"
                                    draggable={false}
                                    onMouseDown={handleMouseDown}
                                    className="cursor-grab object-contain active:cursor-grabbing"
                                    style={{
                                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                        transition: dragging
                                            ? "none"
                                            : "transform 0.2s ease",
                                        transformOrigin: "top left",
                                        maxWidth: "100%",
                                        height: "auto",
                                    }}
                                />

                            </div>

                            <p className="mt-3 text-center text-sm text-slate-500">
                                Use mouse wheel or buttons to zoom and compare image
                            </p>

                        </div>

                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                            handleUpload(e.target.files?.[0])
                        }
                    />
                </label>
            </div>

            {loading && (
                <div className="mt-5 text-center text-[16px] font-semibold text-[#2452c6]">
                    Matching products...
                </div>
            )}

            {products.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">

                    {products.map((item) => (
                        <div
                            key={item._id}
                            className="rounded-xl border border-[#dbe4f0] p-4"
                        >
                            <div className="flex gap-4">

                                <img
                                    src={`${API_BASE}${item.thumbnail}`}
                                    alt={item.name}
                                    className="h-24 w-24 rounded-lg object-cover"
                                />

                                <div className="flex-1">

                                    <h3 className="text-[18px] font-bold text-[#111827]">
                                        {item.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.brand}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-green-600">
                                        Match Score: {100 - item.similarity}%
                                    </p>

                                    <a
                                        href={`/product/${item.slug}`}
                                        className="mt-3 inline-flex text-sm font-semibold text-[#2452c6]"
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