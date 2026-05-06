import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/api";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  FileText,
  PackageSearch,
  ShieldCheck,
  Truck,
  Headphones,
  Cpu,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

async function getContactPage() {
  try {
    const res = await fetch(`${API_BASE}/api/contact-page`, {
      cache: "no-store",
    });

    const data = await res.json();
    return data?.page || null;
  } catch {
    return null;
  }
}

function getIcon(icon) {
  switch (icon) {
    case "mail":
      return Mail;
    case "whatsapp":
      return MessageCircle;
    case "map":
      return MapPin;
    case "clock":
      return Clock;
    case "truck":
      return Truck;
    case "file":
      return FileText;
    case "cpu":
      return Cpu;
    case "payment":
      return CreditCard;
    default:
      return Phone;
  }
}

export async function generateMetadata() {
  const page = await getContactPage();

  return {
    title:
      page?.seo?.metaTitle ||
      "Contact Royal Component | Industrial Electronic Components, Bulk Orders & GST Support",
    description:
      page?.seo?.metaDescription ||
      "Contact Royal Component for industrial electronic components, semiconductors, bulk quotation, MOQ, datasheet, GST invoice, payment proof, order tracking and procurement support.",
    keywords:
      page?.seo?.metaKeywords || [
        "Royal Component contact",
        "Royal Trading contact",
        "industrial components supplier India",
        "electronic components bulk order",
        "semiconductor supplier India",
        "GST invoice support",
        "datasheet support",
        "industrial procurement support",
      ],
  };
}

export default async function ContactPage() {
  const page = await getContactPage();

  const cards =
    page?.cards?.filter((c) => c.isActive)?.sort((a, b) => a.order - b.order) ||
    [];

  return (
    <div className="min-h-screen bg-[#f3f8fd]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50">
          <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-[90px]" />
          <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-blue-100/60 blur-[80px]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-sky-600">
                Contact Support
              </p>

              <h1 className="text-[36px] font-black leading-tight text-slate-950 sm:text-[52px] lg:text-[66px]">
                {page?.heroTitle || "Contact Royal Component"}
              </h1>

              <p className="mt-6 max-w-3xl text-[17px] leading-8 text-slate-600 sm:text-[19px]">
                {page?.heroSubtitle ||
                  "Need help with industrial components, electronic parts, semiconductors, bulk quotation, GST invoice, datasheet, payment proof or order tracking? Royal Component support team helps businesses source the right parts with confidence."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${page?.phone || ""}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
                >
                  <Phone size={18} />
                  Call Support
                </a>

                <a
                  href={`mailto:${page?.email || "support@royalsmd.com"}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-white px-6 py-4 text-sm font-black text-sky-700 transition hover:bg-sky-50"
                >
                  <Mail size={18} />
                  Email Us
                </a>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                <FeatureCard
                  icon={PackageSearch}
                  title="Bulk Quote"
                  text="Share SKU, MPN, quantity and delivery location for quick quotation support."
                />
                <FeatureCard
                  icon={FileText}
                  title="GST Invoice"
                  text="Business billing, company details and tax invoice support for buyers."
                />
                <FeatureCard
                  icon={ShieldCheck}
                  title="Safe Support"
                  text="We never ask for OTP, CVV, password or banking PIN."
                />
              </div>
            </div>

            <div className="rounded-[36px] border border-sky-100 bg-white/90 p-6 shadow-2xl shadow-sky-100 backdrop-blur sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Headphones size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {page?.supportTitle || "Industrial Procurement Support"}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Fast help for business buyers
                  </p>
                </div>
              </div>

              <p className="text-[15px] leading-7 text-slate-600">
                {page?.supportDescription ||
                  "Share your part number, SKU, MPN, quantity, delivery location, GST details, payment screenshot or technical requirement and our team will help you with the right procurement support."}
              </p>

              <div className="mt-6 space-y-4">
                <InfoRow icon={Phone} label="Phone" value={page?.phone} />
                <InfoRow icon={Mail} label="Email" value={page?.email} />
                <InfoRow
                  icon={MessageCircle}
                  label="WhatsApp"
                  value={page?.whatsapp}
                />
                <InfoRow
                  icon={Clock}
                  label="Business Hours"
                  value={page?.businessHours}
                />
                <InfoRow icon={MapPin} label="Address" value={page?.address} />
              </div>
            </div>
          </div>
        </section>

        {cards.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">
                Contact Options
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Choose the right support channel
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {cards.map((card) => {
                const Icon = getIcon(card.icon);

                return (
                  <a
                    key={card._id || card.title}
                    href={card.link || "#"}
                    className="group rounded-[30px] border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <h3 className="text-xl font-black text-slate-950">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-[15px] font-bold text-sky-700">
                      {card.value}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {card.subText}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-sky-700">
                      Continue <ArrowRight size={15} />
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[34px] border border-sky-100 bg-white p-7 shadow-sm sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">
                What We Support
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Contact Royal Component for electronic, electrical and
                industrial hardware procurement
              </h2>

              <div className="mt-6 space-y-5 text-[15.5px] leading-8 text-slate-650">
                <p>
                  Royal Component is built for business buyers, engineers,
                  maintenance teams, manufacturers, workshops, traders and
                  industrial procurement teams who need reliable component
                  sourcing support. Whether you are searching for semiconductors,
                  ICs, sensors, connectors, automation parts, electrical
                  accessories, tools, control components or mechanical hardware,
                  our contact support page helps you reach the right team quickly.
                </p>

                <p>
                  Industrial buying is different from normal retail shopping.
                  Many components require exact part number matching, datasheet
                  verification, MOQ confirmation, lead time checking and GST
                  billing accuracy. That is why our support process is designed
                  around technical details such as SKU, MPN, brand name, package
                  type, voltage rating, current rating, tolerance, pin count,
                  stock availability and delivery location.
                </p>

                <p>
                  For bulk orders, you can share the required quantity, target
                  price, delivery timeline, company name and GST details. Our
                  team can help verify availability, supplier confirmation,
                  dispatch planning and quotation support. This makes Royal
                  Component useful for both small repair requirements and large
                  industrial procurement needs.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SeoPoint
                icon={Cpu}
                title="Datasheet & Technical Details"
                text="Send part number, product image, marking or MPN to request technical support and datasheet help."
              />
              <SeoPoint
                icon={PackageSearch}
                title="Bulk Quantity Support"
                text="Request 10, 100, 1000 or higher quantity with MOQ, lead time and pricing confirmation."
              />
              <SeoPoint
                icon={CreditCard}
                title="Payment Proof Verification"
                text="Upload or share UPI, bank transfer or payment screenshot for admin verification."
              />
              <SeoPoint
                icon={Building2}
                title="Business Billing"
                text="Share GST number, company name, billing address and shipping address for invoice support."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-sky-100 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-7 text-white shadow-xl sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
                  Faster Support Checklist
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  Share these details before contacting us
                </h2>
                <p className="mt-5 text-[15px] leading-7 text-slate-300">
                  Agar aap ye details pehle se ready rakhte hain to quotation,
                  payment verification, dispatch update aur product support fast
                  ho jata hai.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Product name, SKU, MPN or exact part number",
                  "Required quantity and expected delivery location",
                  "Brand preference or acceptable alternate brand",
                  "Datasheet, product image or component marking",
                  "GST number, company name and billing address",
                  "Payment screenshot, UPI ID or transaction reference",
                  "Order ID for tracking, cancellation or invoice help",
                  "Technical rating such as voltage, current or package type",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <CheckCircle2 className="mt-1 shrink-0 text-sky-300" size={18} />
                    <p className="text-sm font-semibold leading-6 text-slate-100">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-[34px] border border-sky-100 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">
              SEO Information
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              Industrial component sourcing support for businesses across India
            </h2>

            <div className="mt-6 grid gap-6 text-[15.5px] leading-8 text-slate-650 lg:grid-cols-2">
              <div className="space-y-5">
                <p>
                  Royal Component focuses on industrial solution buyers who need
                  electronic components, electrical hardware, automation spares,
                  semiconductor parts and procurement assistance in a structured
                  way. Customers can contact our support team for product
                  identification, quotation, availability confirmation, dispatch
                  updates, payment proof checking and GST invoice assistance.
                </p>

                <p>
                  If you are not sure about the exact part, you can share a
                  product photo, label, old component marking, datasheet or
                  machine requirement. Our support team can review the available
                  details and guide you about possible product matching or
                  alternate part options. For electronic components, final
                  compatibility should always be verified with the datasheet and
                  application requirements.
                </p>

                <p>
                  Business customers often need clear documentation such as GST
                  invoice, purchase order reference, delivery address, shipping
                  details and payment confirmation. Royal Component contact
                  support helps keep these details organized so that your order
                  can move from enquiry to procurement, packing and dispatch with
                  fewer delays.
                </p>
              </div>

              <div className="space-y-5">
                <p>
                  For semiconductors, ICs, modules, connectors and sensors,
                  availability can change quickly depending on market stock and
                  supplier confirmation. Large quantity orders may require lead
                  time confirmation before final dispatch. This is why customers
                  should mention required quantity, brand preference and delivery
                  timeline while contacting support.
                </p>

                <p>
                  Payment-related support is also important for manual UPI or
                  bank transfer orders. Customers can share transaction reference,
                  amount paid, payment screenshot and order ID so admin can verify
                  the payment from the backend panel. This helps reduce confusion
                  and improves order processing accuracy.
                </p>

                <p>
                  Our aim is to provide a professional B2B buying experience for
                  industrial components. From product enquiry to technical
                  support, quotation, GST billing, payment verification, tracking
                  and after-order communication, Royal Component is designed for
                  serious buyers who need clarity, reliability and responsive
                  support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {page?.mapEmbedUrl ? (
          <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[34px] border border-sky-100 bg-white shadow-sm">
              <iframe
                src={page.mapEmbedUrl}
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100">
      <Icon className="mb-3 text-sky-600" size={28} />
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function SeoPoint({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
        <Icon size={26} />
      </div>
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-[15px] font-bold leading-6 text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}