import Link from "next/link";

const shopLinks = [
  { label: "Automation", link: "/products?category=automation" },
  { label: "Switchgear", link: "/products?category=switchgear" },
  { label: "Sensors", link: "/products?category=sensors" },
  { label: "Cables", link: "/products?category=cables" },
  { label: "Tools", link: "/products?category=tools" },
];

const companyLinks = [
  { label: "About Us", link: "/about" },
  { label: "Contact Us", link: "/contact" },
  { label: "Privacy Policy", link: "/privacy-policy" },
  { label: "Terms & Conditions", link: "/terms-and-conditions" },
];

const supportLinks = [
  { label: "Track Order", link: "/track" },
  { label: "Bulk Procurement", link: "/contact" },
  { label: "Request Quote", link: "/contact" },
  { label: "Help Center", link: "/help" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0f172a] text-white">
      <div className="container-royal py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold">Royal Component</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Royal Component is a modern industrial e-commerce platform for
              electrical, automation and electronic component sourcing with trusted
              brands, technical specifications and scalable B2B support.
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <p>Email: sales@royalcomponent.com</p>
              <p>Phone: +91 00000 00000</p>
              <p>Support Hours: Mon - Sat | 9 AM - 7 PM</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-red-300">
              Shop
            </h4>
            <div className="space-y-3">
              {shopLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="block text-sm text-slate-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-red-300">
              Support
            </h4>
            <div className="space-y-3">
              {supportLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="block text-sm text-slate-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-red-300">
              Company
            </h4>
            <div className="space-y-3">
              {companyLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className="block text-sm text-slate-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 text-sm text-slate-400">
          © 2026 Royal Component. All rights reserved.
        </div>
      </div>
    </footer>
  );
}