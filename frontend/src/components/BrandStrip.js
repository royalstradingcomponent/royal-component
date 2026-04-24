"use client";

const brands = [
  { name: "ABB", logo: "/brands/abb.jpg" },
  { name: "Panasonic", logo: "/brands/Panasonic.jpg" },
  { name: "Texas Instruments", logo: "/brands/texas-instruments.jpg" },
  { name: "3M", logo: "/brands/3m.jpg" },
  { name: "Fluke", logo: "/brands/Fluke.jpg" },
  { name: "Siemens", logo: "/brands/Siemens.jpg" },
  { name: "Schneider Electric", logo: "/brands/schneider-electric.jpg" },
  { name: "SMC", logo: "/brands/SMC.jpg" },
  { name: "STMicroelectronics", logo: "/brands/STMicroelectronics.jpg" },
  { name: "Arduino", logo: "/brands/Arduino.jpg" },
  { name: "Omron", logo: "/brands/Omron.jpg" },
  { name: "RS Pro", logo: "/brands/RS-Pro.jpg" },
  { name: "SKF", logo: "/brands/SKF.jpg" },
  { name: "Henkel", logo: "/brands/Henkel.jpg" },
  { name: "Molex", logo: "/brands/Molex.jpg" },
];

export default function BrandStrip() {
  return (
    <section className="bg-[#f8fbff] py-16">
      <div className="container-royal">
        <div className="mb-12 text-center">
          <h2 className="heading-section text-[#102033]">Trusted Brands</h2>
          <p className="section-subtitle text-[#0054a6]">
            Top industrial & electronics brands we support
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-[90px] w-auto object-contain transition duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}