"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

const QUICK_QTY = [1, 5, 10, 20, 50, 100, 500, 1000, 10000];

export default function AddToCartButton({
  productId,
  quantity = 1,
  moq = 1,
  showQuantity = false,
}) {
  const { addToCart, cartActionLoading } = useCart();

  const [qty, setQty] = useState(Number(quantity || moq || 1));
  const [open, setOpen] = useState(false);
  const [searchQty, setSearchQty] = useState("");

  const cleanQty = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1) return 1;
    return Math.floor(num);
  };

  const filteredQty = useMemo(() => {
    if (!searchQty) return QUICK_QTY;
    return QUICK_QTY.filter((q) =>
      String(q).includes(String(searchQty).trim())
    );
  }, [searchQty]);

  const selectQty = (value) => {
    setQty(cleanQty(value));
    setOpen(false);
    setSearchQty("");
  };

  const handleAddToCart = async () => {
    try {
      const finalQty = showQuantity ? cleanQty(qty) : cleanQty(quantity);

      const res = await addToCart({
        productId,
        qty: finalQty,
      });

      if (res?.success) {
        toast.success(`${finalQty} item(s) added to cart`);

        if (finalQty >= 500) {
          toast.info("🎉 Bulk offer unlocked! Coupon apply kar sakte ho.");
        }
      } else {
        toast.error(res?.message || "Failed to add item");
      }
    } catch {
      toast.error("Add to cart failed");
    }
  };

  if (!showQuantity) {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={cartActionLoading || !productId}
        className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-[#b6dcff] bg-[#d6ecff] px-8 text-[16px] font-extrabold text-black shadow-[0_8px_18px_rgba(14,165,233,0.28)] transition hover:bg-[#c5e4ff] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ShoppingCart size={20} className="text-[#0b6aa2]" />
        {cartActionLoading ? "Adding..." : "Add to Cart"}
      </button>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative w-[220px]">
          <div className="flex h-[52px] items-center rounded-[10px] border border-slate-300 bg-white px-4">
            <input
              type="number"
              min="1"
              value={qty}
              onFocus={() => setOpen(true)}
              onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={() => setQty(cleanQty(qty))}
              className="w-full bg-transparent text-[18px] font-bold text-black outline-none"
            />

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpen((prev) => !prev)}
            >
              <ChevronDown
                size={18}
                className={`text-[#0b6aa2] transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {open && (
            <div className="absolute top-[56px] z-50 w-full rounded-[10px] border border-[#dbe5f0] bg-white shadow-lg">
              <div className="flex gap-2 border-b p-2">
                <Search size={16} className="text-[#607287]" />
                <input
                  type="number"
                  value={searchQty}
                  onChange={(e) =>
                    setSearchQty(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="Search qty..."
                  className="w-full outline-none"
                />
              </div>

              <div className="max-h-[200px] overflow-y-auto">
                {filteredQty.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectQty(q)}
                    className={`block w-full px-4 py-2 text-left font-semibold hover:bg-[#eef4ff] ${
                      Number(qty) === q
                        ? "bg-[#eef4ff] text-[#2454b5]"
                        : "text-[#102033]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={cartActionLoading || !productId}
          className="flex h-[52px] items-center justify-center gap-2 rounded-full border border-[#b6dcff] bg-[#d6ecff] px-8 text-[16px] font-extrabold text-black shadow-[0_8px_18px_rgba(14,165,233,0.28)] transition hover:bg-[#c5e4ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart size={20} className="text-[#0b6aa2]" />
          {cartActionLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      <p className="mt-2 text-sm font-medium text-[#607287]">
        Tip: 500+ qty par coupon apply ho sakta hai
      </p>
    </div>
  );
}