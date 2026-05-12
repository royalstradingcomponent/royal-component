import Link from "next/link";
import {
  Home,
  Search,
  PackageSearch,
  Cable,
  Cpu,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "404 Page Not Found | Royal Component",
  description:
    "The page you are looking for could not be found. Explore Royal Component products, components, categories and sourcing support.",
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4fbff] text-[#102033]">
      <section className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="absolute left-8 top-12 h-32 w-32 rounded-full border-[14px] border-[#dff2ff]" />
        <div className="absolute right-10 bottom-10 h-44 w-44 rounded-full border-[16px] border-[#dff2ff]" />
        <div className="absolute right-24 top-20 h-8 w-8 rounded-full bg-[#b8e7ff]" />
        <div className="absolute left-1/4 bottom-20 h-5 w-5 rounded-full bg-[#93d8ff]" />

        <div className="relative z-10 grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto flex h-[380px] w-full max-w-[520px] items-center justify-center">
            <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-[#cfeeff] blur-xl" />

            <div className="relative rounded-[34px] border border-[#cce9ff] bg-white p-8 shadow-[0_22px_70px_rgba(15,76,129,0.14)]">
              <div className="mb-6 flex items-center justify-between">
                <div className="rounded-2xl bg-[#eaf7ff] p-4 text-[#0b6aa2]">
                  <Cpu size={42} />
                </div>
                <div className="rounded-2xl bg-[#fff7ed] p-4 text-[#c2410c]">
                  <Cable size={42} />
                </div>
              </div>

              <div className="rounded-3xl border border-dashed border-[#7dd3fc] bg-[#f8fcff] p-6 text-center">
                <PackageSearch
                  size={86}
                  className="mx-auto text-[#2454b5]"
                />

                <h2 className="mt-5 text-2xl font-extrabold text-[#102033]">
                  Component Not Found
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  The part number, category or page you searched for may have
                  moved, expired, or is not listed yet.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-16 rounded-2xl bg-[#eaf7ff]" />
                <div className="h-16 rounded-2xl bg-[#eef4ff]" />
                <div className="h-16 rounded-2xl bg-[#f0f9ff]" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-xl text-center lg:text-left">
            <p className="text-[92px] font-black leading-none tracking-[-0.08em] text-[#2454b5] drop-shadow-sm md:text-[130px]">
              404
            </p>

            <h1 className="mt-2 text-4xl font-black leading-tight text-[#102033] md:text-5xl">
              Page Not Found
            </h1>

            <h2 className="mt-5 text-xl font-extrabold uppercase tracking-wide text-[#0b6aa2] md:text-2xl">
              Looks like this component path is missing.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-700">
              Sorry, we can’t find the page you are searching for. You can go
              back to the homepage, browse products, or request the component
              directly from our sourcing team.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#2454b5] px-7 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-blue-200 transition hover:bg-[#1d469b]"
              >
                <Home size={18} />
                Return Home
              </Link>

              <Link
                href="/products"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0b6aa2] px-7 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-sky-200 transition hover:bg-[#075985]"
              >
                <Search size={18} />
                Browse Products
              </Link>
            </div>

            <Link
              href="/request-component"
              className="mt-6 inline-flex items-center gap-2 text-base font-extrabold text-[#2454b5] hover:underline"
            >
              Request unavailable component
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}