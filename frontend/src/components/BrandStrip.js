"use client";

const brands = [
  { name: "ABB", logo: "/brands/abb.jpg" },
  { name: "Panasonic", logo: "/brands/panasonic.jpg" },
  { name: "Texas Instruments", logo: "/brands/texas-instruments.jpg" },
  { name: "3M", logo: "/brands/3m.jpg" },
  { name: "Fluke", logo: "/brands/fluke.jpg" },
  { name: "Siemens", logo: "/brands/siemens.jpg" },
  { name: "Schneider Electric", logo: "/brands/schneider-electric.jpg" },
  { name: "SMC", logo: "/brands/smc.jpg" },
  { name: "STMicroelectronics", logo: "/brands/stmicroelectronics.jpg" },
  { name: "Arduino", logo: "/brands/arduino.jpg" },
  { name: "Omron", logo: "/brands/omron.jpg" },
  { name: "RS Pro", logo: "/brands/rs-pro.jpg" },
  { name: "SKF", logo: "/brands/skf.jpg" },
  { name: "Henkel", logo: "/brands/henkel.jpg" },
  { name: "Molex", logo: "/brands/molex.jpg" },
];

export default function BrandStrip() {
  return (
    <section className="bg-[#f8fbff] py-16">
      <div className="container-royal">
        <div className="mb-12 text-center">
          <h2 className="heading-section text-[#102033]">
            Trusted Brands
          </h2>
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