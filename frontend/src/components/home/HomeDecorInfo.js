"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import WishlistToggleButton from "@/components/WishlistToggleButton";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function HomeDecorInfo() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/home-decor-info`)
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data) return null;


    return (
        <section className="-mt-16 pb-20 bg-[#f8fbff]">
            <div className="max-w-[1800px] mx-auto px-6">
                <div className="mb-6">

                    <div className="flex items-center justify-between mb-8 relative">

                        {/* LEFT SIDE */}
                        <div>

                            <span
                                className="
      inline-flex
      items-center
      px-4
      py-2
      rounded-full
      bg-gradient-to-r
      from-[#eaf5ff]
      to-[#f4ebfa]
      text-[#0f6cbd]
      text-xs
      font-bold
      mb-3
      "
                            >
                                🔥 TRENDING PRODUCTS
                            </span>

                            <h2
                                className="
      text-3xl
      md:text-4xl
      lg:text-5xl
      font-extrabold
      bg-gradient-to-r
      from-[#0f6cbd]
      via-[#31a8ff]
      to-[#8a5db2]
      bg-clip-text
      text-transparent
      "
                            >
                                {data.sectionTitle || "Trending & New Launches"}
                            </h2>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-4">

                            <Link
                                href={data.viewAllLink || "/products"}
                                className="
      px-10
      py-4
      rounded-full
      font-bold
      text-white
      text-lg
      bg-gradient-to-r
      from-[#0f6cbd]
      via-[#31a8ff]
      to-[#8a5db2]
      shadow-[0_12px_30px_rgba(15,108,189,0.30)]
      hover:-translate-y-1
      transition-all
      duration-300
      "
                            >
                                <span className="text-white">
                                    {data.viewAllText || "View All"}
                                </span>
                            </Link>

                            <button
                                className="
      decor-prev
      w-14
      h-14
      rounded-full
      bg-[#eef5ff]
      text-[#0f6cbd]
      flex
      items-center
      justify-center
      border
      border-[#dbeafe]
      "
                            >
                                <ChevronLeft />
                            </button>

                            <button
                                className="
      decor-next
      w-14
      h-14
      rounded-full
      bg-gradient-to-r
      from-[#0f6cbd]
      to-[#31a8ff]
      text-white
      flex
      items-center
      justify-center
      "
                            >
                                <ChevronRight />
                            </button>

                        </div>

                    </div>

                </div>

                <Swiper
                    modules={[
                        Navigation,
                        Autoplay,
                    ]}
                    navigation={{
                        prevEl: ".decor-prev",
                        nextEl: ".decor-next",
                    }}

                    autoplay={{
                        delay: data.sliderSpeed || 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}

                    loop={true}
                    spaceBetween={24}

                    breakpoints={{
                        0: {
                            slidesPerView: 1.1,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                        1400: {
                            slidesPerView: 5,
                        },
                    }}
                >
                    {data.products?.map((item, index) => {

                        console.log(
                            "TRENDING ITEM =>",
                            JSON.stringify(item, null, 2)
                        );

                        console.log("PRODUCT ID =>", item.productId);
                        console.log("SLUG =>", item.slug);

                        return (

                            <SwiperSlide key={index}>
                                <div
                                    onClick={() => {
                                        window.location.href = item.buttonLink || "#";
                                    }}
                                    className="block h-full cursor-pointer"
                                >
                                    <div
                                        className="
group
bg-gradient-to-b
from-white
via-[#fbfdff]
to-[#f3f8ff]
rounded-[24px]
border
border-slate-200
overflow-hidden
transition-all
duration-500
hover:-translate-y-2
hover:border-[#0f6cbd]
hover:shadow-[0_25px_70px_rgba(15,108,189,0.18)]
h-full
cursor-pointer
"
                                    >
                                        <div
                                            className="
    relative
    h-[250px]
    bg-gradient-to-br
    from-[#eef7ff]
    via-white
    to-[#f4ebfa]
    overflow-hidden
    "
                                        >

                                            <div
                                                className="absolute top-4 right-4 z-20"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <WishlistToggleButton
                                                    product={{
                                                        ...item,
                                                        _id: item.productId,
                                                        slug: item.slug,
                                                        name: item.title,
                                                    }}
                                                />
                                            </div>

                                            <span
                                                className="
    absolute
    top-4
    left-4
    z-20
    px-4
    py-1.5
    rounded-full
    text-white
    text-xs
    font-bold
    uppercase
    bg-gradient-to-r
    from-[#0f6cbd]
    via-[#31a8ff]
    to-[#8a5db2]
    shadow-lg
    "
                                            >
                                                {item.badge || "NEW"}
                                            </span>

                                            <img
                                                src={
                                                    item.image?.startsWith("http")
                                                        ? item.image
                                                        : `${API}${item.image}`
                                                }
                                                alt={item.title}
                                                className="
        absolute
        inset-0
        w-full
        h-full
        object-contain
        p-6
        transition-all
        duration-500
        group-hover:opacity-0
        group-hover:scale-110
        "
                                            />

                                            {item.hoverImage && (
                                                <img
                                                    src={
                                                        item.hoverImage?.startsWith("http")
                                                            ? item.hoverImage
                                                            : `${API}${item.hoverImage}`
                                                    }
                                                    alt={item.title}
                                                    className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
            p-6
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-110
        "
                                                />
                                            )}
                                        </div>

                                        <div className="p-5">

                                            <div className="mb-2">
                                                <span className="text-xs font-semibold text-[#0f6cbd]">
                                                    SKU: {item.sku}
                                                </span>
                                            </div>

                                            <h3
                                                className="
        text-[22px]
        font-bold
        text-slate-900
        leading-tight
        line-clamp-2
        min-h-[60px]
    "
                                            >
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mt-4">
                                                <span className="text-[30px] font-bold text-[#16a34a]">
                                                    ₹{item.price}
                                                </span>

                                                <span className="line-through text-gray-400">
                                                    ₹{item.mrp}
                                                </span>

                                                <span
                                                    className="
        px-2
        py-1
        rounded-full
        bg-red-50
        text-red-600
        text-xs
        font-bold
        "
                                                >
                                                    {item.discount} OFF
                                                </span>
                                            </div>

                                            <div
                                                className="
        mt-4
        flex
        items-center
        gap-2
        text-green-600
        font-semibold
        text-sm
    "
                                            >
                                                ✓ Ready Stock
                                            </div>

                                            <div
                                                className="
        mt-2
        flex
        items-center
        gap-2
        text-[#0f6cbd]
        text-sm
        font-medium
    "
                                            >
                                                ✓ Fast Dispatch Available
                                            </div>

                                            <div
                                                className="
    mt-6
    block
    w-full
    relative
    overflow-hidden
    text-center
    py-4
    rounded-2xl
    font-bold
    text-white
    text-[16px]
    bg-gradient-to-r
    from-[#0f6cbd]
    via-[#31a8ff]
    to-[#8a5db2]
    shadow-[0_12px_30px_rgba(15,108,189,0.25)]
    hover:shadow-[0_20px_40px_rgba(15,108,189,0.35)]
    hover:-translate-y-1
    transition-all
    duration-300
    "
                                            >
                                                <span className="relative z-10 !text-white">
                                                    View Product →
                                                </span>

                                                <span
                                                    className="
        absolute
        inset-0
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        -translate-x-full
        group-hover:translate-x-full
        transition-transform
        duration-700
    "
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}
