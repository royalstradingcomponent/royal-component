"use client";

import { useEffect, useState } from "react";
import { Building2, CreditCard, FileText, IndianRupee, ShieldCheck, Truck } from "lucide-react";
import { API_BASE } from "@/lib/api";

const iconMap = {
  "bank-transfer": Building2,
  "quote-request": FileText,
  "online-payment": CreditCard,
  cod: Truck,
};

export default function PaymentMethodSelector({
  value,
  onChange,
  totalAmount = 0,
}) {
  const [methods, setMethods] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/api/payments/methods?amount=${Number(totalAmount || 0)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (data?.success) {
          setMethods(data.methods || []);
          setBankDetails(data.bankDetails || null);

          const currentStillValid = (data.methods || []).some(
            (item) => item.id === value && item.enabled
          );

          if (!currentStillValid) {
            const recommended =
              data.methods?.find((item) => item.recommended && item.enabled) ||
              data.methods?.find((item) => item.enabled);

            if (recommended?.id) onChange(recommended.id);
          }
        }
      } catch (error) {
        console.error("Payment methods fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [totalAmount]);

  if (loading) {
    return (
      <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 md:p-6">
        <p className="text-[#607287]">Loading payment options...</p>
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-full bg-[#eaf3ff] p-3 text-[#2454b5]">
          <IndianRupee size={22} />
        </div>

        <div>
          <h2 className="text-[24px] font-bold text-[#102033]">
            Payment Method
          </h2>
          <p className="text-sm text-[#607287]">
            Choose a payment option suitable for industrial procurement.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {methods.map((method) => {
          const Icon = iconMap[method.id] || CreditCard;
          const active = value === method.id;

          return (
            <button
              key={method.id}
              type="button"
              disabled={!method.enabled}
              onClick={() => method.enabled && onChange(method.id)}
              className={`relative rounded-xl border p-4 text-left transition ${
                active
                  ? "border-[#2454b5] bg-[#edf3ff] shadow-[0_0_0_3px_rgba(36,84,181,0.10)]"
                  : "border-[#dbe5f0] bg-white hover:border-[#8bb7ee]"
              } ${!method.enabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    active ? "bg-[#2454b5] text-white" : "bg-[#eaf3ff] text-[#2454b5]"
                  }`}
                >
                  <Icon size={19} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-[#102033]">
                      {method.label}
                    </p>

                    {method.recommended ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-extrabold text-green-700">
                        RECOMMENDED
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-[#607287]">
                    {method.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {value === "bank-transfer" && bankDetails ? (
        <div className="mt-5 rounded-xl border border-[#bfd7f5] bg-[#f8fbff] p-4">
          <div className="mb-2 flex items-center gap-2 font-bold text-[#102033]">
            <ShieldCheck size={18} className="text-[#2454b5]" />
            Bank details will be shared after order confirmation
          </div>

          <div className="grid gap-2 text-sm text-[#607287] md:grid-cols-2">
            <p>Account Name: {bankDetails.accountName}</p>
            <p>Bank: {bankDetails.bankName}</p>
            <p>Account No: {bankDetails.accountNumber}</p>
            <p>IFSC: {bankDetails.ifsc}</p>
            <p>UPI: {bankDetails.upiId}</p>
          </div>
        </div>
      ) : null}

      {value === "quote-request" ? (
        <div className="mt-5 rounded-xl border border-[#bfd7f5] bg-[#f8fbff] p-4 text-sm text-[#607287]">
          Your order will be submitted as a quote request. Our team can verify stock,
          bulk pricing and delivery timeline before payment.
        </div>
      ) : null}

      {value === "online-payment" ? (
        <div className="mt-5 rounded-xl border border-[#bfd7f5] bg-[#f8fbff] p-4 text-sm text-[#607287]">
          Online payment gateway can be connected later with Razorpay. For now, this
          order will be saved with payment status as Pending.
        </div>
      ) : null}
    </section>
  );
}