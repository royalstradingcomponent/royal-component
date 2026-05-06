import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterCTA() {
  return (
    <section className="bg-[#eef8ff] py-14">
      <div className="container-royal">
        <div className="grid gap-8 rounded-[34px] border border-[#cde8ff] bg-white p-8 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#0284c7]">
              <Mail size={18} /> Business Support
            </p>

            <h2 className="text-3xl font-extrabold text-[#102033] md:text-4xl">
              Need help sourcing industrial components?
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#52677d]">
              Send your requirement list, part numbers or quantity needs. Our
              team can support bulk procurement, alternate parts and sourcing
              guidance.
            </p>
          </div>

          <Link
            href="/quote-request"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0284c7] px-8 py-4 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#0369a1]"
          >
            Request Quote <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}