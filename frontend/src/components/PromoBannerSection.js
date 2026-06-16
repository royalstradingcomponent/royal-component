"use client";

import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PromoBannerSection({
  banners = [],
}) {
  if (!banners?.length) return null;

  const count = banners.length;

  let gridClass = "grid-cols-1";

  if (count === 2) {
    gridClass = "md:grid-cols-2";
  }

  if (count === 3) {
    gridClass = "md:grid-cols-3";
  }

  if (count >= 4) {
    gridClass = "md:grid-cols-4";
  }

  return (
    <section className="w-full py-0 -mb-2">
      <div className="w-full">
        <div className={`grid gap-0 ${gridClass}`}>
          {banners.map((banner, index) => (
            <Link
              key={banner._id || index}
              href={banner.buttonLink || "/products"}
              className="block overflow-hidden"
            >
              <img
                src={
                  banner.desktopImage
                    ? `${API}${banner.desktopImage}`
                    : `${API}${banner.image}`
                }
                alt={banner.title || "Banner"}
                className="
                  w-full
                  block
                  object-cover
                "
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}