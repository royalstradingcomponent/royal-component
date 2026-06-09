"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function LandingPageView({ page }) {
  console.log("PAGE DATA =", page);

  const desktopBanner =
  page.bannerImage
    ? `${API_URL}${page.bannerImage}`
    : "";

const mobileBanner =
  page.mobileBannerImage
    ? `${API_URL}${page.mobileBannerImage}`
    : desktopBanner;

  if (!page) return null;

  return (
    <div className="min-h-screen bg-[#f5fbff]">
      <Navbar />  
      {/* HERO */}

      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-10">

<div className="mb-6 sm:mb-12">

  <div className="mb-6 sm:mb-12">

  {/* Desktop Banner */}
  <div
    className="
    hidden
    md:block
    overflow-hidden
    rounded-[32px]
    shadow-2xl
    w-full
    "
  >
    <img
      src={desktopBanner}
      alt={page.title}
      className="
      w-full
      h-auto
      object-contain
      block
      "
    />
  </div>

  {/* Mobile Banner */}
<div
  className="
  md:hidden
  overflow-hidden
  rounded-[24px]
  shadow-xl
  "
>
  <img
    src={mobileBanner}
    alt={page.title}
    className="
    w-full
    h-auto
    block
    object-contain
    "
  />
</div>

</div>

</div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
         <div className="max-w-5xl mx-auto text-center">
            <div>
             <h1
  className="
  text-3xl
  md:text-4xl
  lg:text-5xl
  xl:text-6xl
  font-extrabold
  leading-[1.15]
  mb-8
  bg-gradient-to-r
  from-blue-700
  via-indigo-600
  to-purple-600
  bg-clip-text
  text-transparent
  tracking-tight
  "
>
  {page.title}
</h1>
<div className="flex justify-center mb-6">
  <div
    className="
    h-1.5
    w-32
    rounded-full
    bg-gradient-to-r
    from-blue-600
    via-indigo-600
    to-purple-600
    "
  />
</div>

              <p className="text-gray-600 text-lg mb-6">{page.description}</p>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  MOQ: 1 Kit
                </span>

                <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Bulk Order Available
                </span>

                <span className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Fast Delivery
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
               
 <Link
 href={`/product/${page.linkedProduct}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
  bg-gradient-to-r
  from-blue-600
  via-indigo-600
  to-purple-600
  text-white
  px-10
  py-4
  rounded-2xl
  font-bold
  text-lg
  shadow-lg
  hover:shadow-2xl
  hover:scale-105
  transition-all
  duration-300
  "
  style={{ color: "#fff" }}
>
  🛒 Buy Now
  </Link>



<a
  href={`https://wa.me/${page.whatsappNumber}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
  bg-gradient-to-r
  from-green-500
  via-emerald-500
  to-teal-500
  text-white
  px-10
  py-4
  rounded-2xl
  font-bold
  text-lg
  shadow-lg
  hover:shadow-2xl
  hover:scale-105
  transition-all
  duration-300
  "
  style={{ color: "#fff" }}
>
  💬 WhatsApp
</a>

                <div className="w-full grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <h4 className="font-bold text-blue-700">1000+</h4>
                    <p className="text-sm">Orders</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <h4 className="font-bold text-blue-700">24H</h4>
                    <p className="text-sm">Dispatch</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <h4 className="font-bold text-blue-700">GST</h4>
                    <p className="text-sm">Invoice</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* PRICE */}

      <section className="bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span
              className="
  inline-block
  bg-blue-100
  text-blue-700
  px-5
  py-2
  rounded-full
  font-semibold
  mb-4
  "
            >
              WHOLESALE PRICE LIST
            </span>

            <h2
              className="
  text-5xl
  md:text-6xl
  font-extrabold
  text-slate-900
  leading-tight
  "
            >
              Bulk Pricing
            </h2>

            <p
              className="
  text-lg
  md:text-xl
  text-slate-600
  max-w-4xl
  mx-auto
  mt-5
  "
            >
              Special discounted pricing available for schools, colleges,
              training institutes, distributors and bulk buyers across India.
            </p>
          </div>
          <div className="flex justify-center mb-10">
            <div
              className="
  bg-gradient-to-r
  from-green-500
  to-emerald-600
  text-white
  px-8
  py-4
  rounded-2xl
  font-bold
  shadow-xl
  "
            >
              🔥 Save More On Higher Quantities
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {page.priceTiers?.map((tier, i) => (
              <div
                key={i}
                className="
      relative
      bg-white
      rounded-[32px]
      overflow-hidden
      border
      border-slate-200
      shadow-xl
      hover:-translate-y-3
      hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]
      transition-all
      duration-300
      "
              >
                {/* TOP BAR */}

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">BULK ORDER</span>

                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                      BEST PRICE
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">{tier.label}</h3>
                </div>

                {/* PRICE */}

                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-2">Starting From</p>

                  <h2 className="text-6xl font-extrabold text-blue-600">
                    ₹{tier.price}
                  </h2>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2">
                      ✅ <span>GST Invoice Available</span>
                    </div>

                    <div className="flex items-center gap-2">
                      🚚 <span>Fast Delivery Across India</span>
                    </div>

                    <div className="flex items-center gap-2">
                      📦 <span>Secure Packaging</span>
                    </div>

                    <div className="flex items-center gap-2">
                      💯 <span>Quality Assured Product</span>
                    </div>
                  </div>

                  <a
  href={`https://wa.me/${page.whatsappNumber}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
  mt-6
  block
  w-full
  text-center
  bg-gradient-to-r
  from-blue-600
  via-indigo-600
  to-purple-600
  !text-white
  py-4
  rounded-2xl
  font-bold
  text-lg
  shadow-lg
  hover:shadow-2xl
  hover:scale-[1.02]
  transition-all
  duration-300
  "
  style={{ color: "#fff" }}
>
  🚀 Get Best Quotation
</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-14">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
            WHY CHOOSE US
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mt-5 text-slate-900">
            Why Customers Choose This Kit
          </h2>

          <p className="text-gray-500 mt-4 max-w-3xl mx-auto text-lg">
            Complete Arduino learning package with sensors, LCD display, motors,
            modules and professional project accessories suitable for students,
            colleges, training institutes and bulk buyers.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <h4 className="text-3xl font-bold text-blue-600">35+</h4>
              <p className="text-gray-500">Components</p>
            </div>

            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <h4 className="text-3xl font-bold text-blue-600">1000+</h4>
              <p className="text-gray-500">Orders</p>
            </div>

            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <h4 className="text-3xl font-bold text-blue-600">GST</h4>
              <p className="text-gray-500">Invoice</p>
            </div>

            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <h4 className="text-3xl font-bold text-blue-600">24H</h4>
              <p className="text-gray-500">Dispatch</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {page.features?.map((item, i) => (
            <div
              key={i}
              className="
      group
      relative
      overflow-hidden
      bg-white
      rounded-3xl
      p-6
      border
      border-slate-200
      shadow-lg
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-300
      "
            >
              <div
                className="
        absolute
        top-0
        right-0
        w-24
        h-24
        bg-blue-50
        rounded-full
        -mr-10
        -mt-10
        "
              />

              <div className="relative z-10">
                <div
                  className="
          w-14
          h-14
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          flex
          items-center
          justify-center
          text-2xl
          mb-5
          "
                >
                  ✓
                </div>

                <h3
                  className="
          text-lg
          font-bold
          text-slate-900
          leading-7
          "
                >
                  {item}
                </h3>

                <p className="text-sm text-gray-500 mt-3">
                  High quality component with project-ready support.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KIT INCLUDES */}

<section className="py-20 bg-white">

  <div className="max-w-7xl mx-auto px-4">

    <div className="text-center mb-14">

      <span className="
      inline-block
      px-5
      py-2
      rounded-full
      bg-orange-100
      text-orange-700
      font-semibold
      mb-4
      ">
        COMPLETE PACKAGE
      </span>

      <h2 className="
      text-5xl
      font-extrabold
      text-slate-900
      ">
        Everything Included In The Kit
      </h2>

      <p className="
      text-lg
      text-slate-500
      mt-4
      max-w-3xl
      mx-auto
      ">
        Ready-to-use Arduino learning kit with board,
        sensors, display modules, motors, accessories
        and project components.
      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {page.kitIncludes?.map((item, i) => (

        <div
          key={i}
          className="
          group
          bg-white
          border
          border-slate-200
          rounded-3xl
          p-6
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          "
        >

          <div className="flex items-start gap-4">

            <div className="
            w-14
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-orange-500
            to-red-500
            text-white
            flex
            items-center
            justify-center
            text-2xl
            shrink-0
            ">
              📦
            </div>

            <div>

              <h3 className="
              text-lg
              font-bold
              text-slate-900
              leading-7
              ">
                {item}
              </h3>

              <p className="
              text-sm
              text-slate-500
              mt-2
              ">
                Included inside the package and ready
                for project development.
              </p>

            </div>

          </div>

        </div>

      ))}

    </div>

    <div className="
    mt-14
    bg-gradient-to-r
    from-blue-600
    to-indigo-700
    rounded-[32px]
    p-8
    text-white
    shadow-2xl
    ">

      <div className="grid md:grid-cols-4 gap-6 text-center">

        <div>
          <h3 className="text-4xl font-extrabold">
            35+
          </h3>
          <p>Components</p>
        </div>

        <div>
          <h3 className="text-4xl font-extrabold">
            LCD
          </h3>
          <p>Display Included</p>
        </div>

        <div>
          <h3 className="text-4xl font-extrabold">
            IR
          </h3>
          <p>Remote Included</p>
        </div>

        <div>
          <h3 className="text-4xl font-extrabold">
            DIY
          </h3>
          <p>Project Ready</p>
        </div>

      </div>

    </div>

  </div>

</section>

      {/* APPLICATIONS */}

      <section className="max-w-6xl mx-auto py-14 px-4">
        <h2 className="text-3xl font-bold mb-8">Applications</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {page.applications?.map((item, i) => (
            <div
              key={i}
              className="
  relative
  overflow-hidden
  bg-white
  rounded-3xl
  p-6
  shadow-xl
  border
  border-slate-100
  hover:-translate-y-2
  hover:shadow-2xl
  transition-all
  "
            >
              <div
                className="
    absolute
    top-0
    right-0
    w-24
    h-24
    bg-blue-50
    rounded-full
    -mr-10
    -mt-10
    "
              />

              <div className="relative z-10">
                <div
                  className="
      w-14
      h-14
      bg-blue-100
      rounded-2xl
      flex
      items-center
      justify-center
      text-2xl
      mb-4
      "
                >
                  🚀
                </div>

                <h4 className="font-bold text-xl mb-3 text-slate-900">
                  {item}
                </h4>

                <p className="text-gray-500">
                  Perfect for industrial, educational and innovation projects.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}

      <section
        className="
  bg-gradient-to-r
  from-blue-700
  to-indigo-700
  text-white
  py-20
  "
      >
        <div className="max-w-4xl mx-auto text-center mb-14">
        <h2
  className="
  text-4xl
  md:text-5xl
  lg:text-6xl
  font-extrabold
  mb-4
  tracking-tight
  text-white
  "
>
  Ready To Order?
</h2>

          <p
  className="
  text-xl
  text-white/90
  mb-10
  "
>
  📞 Call or WhatsApp:
  <span className="font-bold ml-2">
    {page.whatsappNumber}
  </span>
</p>

<a
  href={`https://wa.me/${page.whatsappNumber}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
  inline-flex
  items-center
  justify-center
  gap-3
  bg-gradient-to-r
  from-green-500
  via-emerald-500
  to-teal-500
  !text-white
  px-12
  py-5
  rounded-2xl
  font-bold
  text-xl
  shadow-2xl
  hover:scale-105
  hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
  transition-all
  duration-300
  "
  style={{ color: "#fff" }}
>
  💬 WhatsApp Now
</a>
        </div>

       <div className="flex justify-center gap-8 mt-12 flex-wrap">
          <div
  className="
w-[240px]
bg-white/15
backdrop-blur-md
border
border-white/20
px-8
py-6
rounded-3xl
shadow-xl
hover:scale-105
transition-all
duration-300
"
>
            <h4 className="font-bold text-2xl">1000+</h4>
            <p>Orders Delivered</p>
          </div>

         <div
  className="
  bg-white/15
  backdrop-blur-md
  border
  border-white/20
  px-8
  py-6
  rounded-3xl
  shadow-xl
  hover:scale-105
  transition-all
  duration-300
  "
>
            <h4 className="font-bold text-2xl">PAN India</h4>
            <p>Shipping</p>
          </div>

          <div
  className="
  bg-white/15
  backdrop-blur-md
  border
  border-white/20
  px-8
  py-6
  rounded-3xl
  shadow-xl
  hover:scale-105
  transition-all
  duration-300
  "
>
            <h4 className="font-bold text-2xl">GST</h4>
            <p>Invoice Available</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
