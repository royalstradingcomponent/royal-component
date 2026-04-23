"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  "/banner/royal-hero-banner.jpg",
  "/banner/royal-hero-banner-1.jpg",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // 3 sec me slide change hoga

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] max-h-[720px] overflow-hidden">
      
      {/* AUTO SLIDE BANNERS */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${slide}')`,
          }}
        />
      ))}

      {/* OPTIONAL DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/10 z-[1]" />

      {/* BUTTONS */}
      <div className="relative z-10 h-full flex items-end px-6 md:px-10 lg:px-16 pb-0">
        <div className="flex flex-wrap gap-4 mb-4 md:mb-6">
          
          {/* EXPLORE BUTTON */}
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 md:px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg hover:bg-sky-600 transition-all duration-300"
          >
            Explore Products
          </Link>

          {/* FEATURED BUTTON */}
          <Link
            href="/products?featured=true"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 md:px-8 py-3 text-sm md:text-base font-semibold text-[#081526] shadow-lg hover:bg-gray-200 transition-all duration-300"
          >
            Featured Products
          </Link>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white w-6" : "bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}