"use client";

import { Camera, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function ImageSearchCamera({ mobile = false, onSearchDone }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function uploadImage(file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/products/search-by-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data?.success) {
        alert(data?.message || "Image search failed");
        return;
      }

      localStorage.setItem(
        "imageSearchResults",
        JSON.stringify(data.products || [])
      );

      router.push("/products?imageSearch=true");
      setOpen(false);
      if (onSearchDone) onSearchDone();
    } catch (error) {
      console.error("Image search error:", error);
      alert("Image search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`absolute top-1/2 z-20 -translate-y-1/2 rounded-full text-[#5f7d95] transition hover:bg-[#eaf7ff] hover:text-[#0f6cbd] ${
          mobile ? "right-3 p-1.5" : "right-4 p-2"
        }`}
        aria-label="Search by image"
      >
        <Camera size={mobile ? 18 : 20} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[120] w-[260px] rounded-[18px] border border-[#d7e7f4] bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#102033]">
              Search by image
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-[#eef7ff]"
              aria-label="Close image search"
            >
              <X size={16} />
            </button>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => cameraInputRef.current?.click()}
            className="mb-2 flex w-full items-center gap-3 rounded-xl border border-[#d7e7f4] px-3 py-3 text-left text-sm font-bold text-[#23435b] hover:bg-[#eef7ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera size={18} />
            Take photo now
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl border border-[#d7e7f4] px-3 py-3 text-left text-sm font-bold text-[#23435b] hover:bg-[#eef7ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ImagePlus size={18} />
            Upload from gallery
          </button>

          {loading ? (
            <p className="mt-3 text-xs font-semibold text-[#0f6cbd]">
              Searching similar products...
            </p>
          ) : null}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => uploadImage(e.target.files?.[0])}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => uploadImage(e.target.files?.[0])}
          />
        </div>
      ) : null}
    </>
  );
}