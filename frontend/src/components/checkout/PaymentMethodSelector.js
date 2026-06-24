"use client";

import { useEffect, useState } from "react";
import { CreditCard, IndianRupee, Truck } from "lucide-react";

const iconMap = {
  razorpay: CreditCard,
  cod: Truck,
};

export default function PaymentMethodSelector({ value, onChange }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMethods([
      {
        id: "razorpay",
        label: "Razorpay",
        enabled: true,
        recommended: true,
        description: "UPI, Cards, Net Banking, Wallets",
      },

      {
        id: "cod",
        label: "Cash on Delivery",
        enabled: true,
        recommended: false,
        description: "Pay when order is delivered",
      },
    ]);

    if (!value) {
      onChange("razorpay");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5">
        Loading...
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-[#dbe5f0] bg-white p-5 shadow-sm">
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

      <div className="overflow-hidden rounded-[28px] border border-[#dbe5f0] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="grid md:grid-cols-[320px_1fr]">
          {/* LEFT PAYMENT MENU */}
          <div className="border-r border-slate-200 bg-gradient-to-b from-[#f8fbff] to-white p-2">
            {methods.map((method) => {
              const Icon = iconMap[method.id] || CreditCard;
              const active = value === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onChange(method.id)}
                  className={`
        relative m-4 overflow-hidden rounded-3xl border-2 p-5 text-left
        transition-all duration-300
${active
                      ? method.id === "cod"
                        ? "border-green-500 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-[0_18px_50px_rgba(22,163,74,0.20)] ring-2 ring-green-100 scale-[1.02]"
                        : "border-[#2874f0] bg-gradient-to-br from-[#eef5ff] via-white to-[#f8fbff] shadow-[0_18px_50px_rgba(36,84,181,0.25)] ring-2 ring-[#dbeafe] scale-[1.02]"
                      : "border-[#e5e7eb] bg-white hover:border-[#c7d7ff] hover:shadow-lg"
                    }
      `}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${method.id === "razorpay"
                            ? "bg-blue-50 text-[#2874f0]"
                            : "bg-green-50 text-green-600"
                          }`}
                      >
                        <Icon size={28} />
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-[#102033]">
                          {method.label}
                        </h4>

                        <p className="text-red-500 font-bold">
                          value = {value}
                        </p>

                        <p className="mt-1 text-sm text-[#607287]">
                          {method.description}
                        </p>

                        {method.id === "razorpay" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                              UPI
                            </span>

                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                              Cards
                            </span>

                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                              Wallets
                            </span>

                            <span className="rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                              SSL Secured
                            </span>

                            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700">
                              PCI DSS
                            </span>
                          </div>
                        )}

                        {method.id === "cod" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                              No Advance Payment
                            </span>

                            <span className="rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                              SSL Secured
                            </span>

                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                              100% Safe Checkout
                            </span>
                          </div>
                        )}

                        <div className="mt-3">
                          {method.id === "razorpay" ? (
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                Recommended
                              </span>

                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                Instant Payment
                              </span>
                            </div>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Easy & Secure
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                  <div
  className="absolute top-5 right-5 z-50"
>
  {active ? (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-xl
      ${
        method.id === "razorpay"
          ? "bg-blue-600"
          : "bg-green-600"
      }`}
    >
      ✓
    </div>
  ) : (
    <div className="h-10 w-10 rounded-full border-2 border-slate-300 bg-white" />
  )}
</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT DETAILS PANEL */}
          <div className="p-6">
            {value === "razorpay" && (
              <>
                <h3 className="text-xl font-bold text-slate-900">
                  Razorpay Secure Checkout
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Pay securely using UPI, Cards, Net Banking and Wallets.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {/* UPI */}

                  <div className="group relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-5 shadow-[0_10px_30px_rgba(14,165,233,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,165,233,0.25)]">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-200/30" />

                    <p className="text-lg font-bold text-[#102033]">
                      UPI Payments
                    </p>

                    <p className="mt-2 text-[#607287]">
                      Google Pay, PhonePe, Paytm, BHIM
                    </p>

                    <div className="mt-4 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                      Instant Payment
                    </div>
                  </div>

                  {/* CARDS */}

                  <div className="group relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5 shadow-[0_10px_30px_rgba(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(99,102,241,0.25)]">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-200/30" />

                    <p className="text-lg font-bold text-[#102033]">
                      Credit / Debit Cards
                    </p>

                    <p className="mt-2 text-[#607287]">
                      Visa, Mastercard, RuPay
                    </p>

                    <div className="mt-4 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                      Secure Cards
                    </div>
                  </div>

                  {/* NET BANKING */}

                  <div className="group relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-[0_10px_30px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,185,129,0.25)]">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/30" />

                    <p className="text-lg font-bold text-[#102033]">
                      Net Banking
                    </p>

                    <p className="mt-2 text-[#607287]">50+ Banks Supported</p>

                    <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Trusted Banks
                    </div>
                  </div>

                  {/* WALLETS */}

                  <div className="group relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-5 shadow-[0_10px_30px_rgba(245,158,11,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(245,158,11,0.25)]">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/30" />

                    <p className="text-lg font-bold text-[#102033]">Wallets</p>

                    <p className="mt-2 text-[#607287]">
                      Paytm Wallet, Mobikwik
                    </p>

                    <div className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                      Fast Checkout
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="font-semibold text-green-700">
                    Secure Payment Protection
                  </p>

                  <p className="mt-1 text-sm text-green-600">
                    All transactions are encrypted and processed securely
                    through Razorpay.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#bfd7f5] bg-[#f8fbff] p-4">
        {value === "razorpay" ? (
          <>
            <div className="mb-3 flex items-center gap-2 font-bold">
              <CreditCard size={18} />
              Secure Razorpay Payment
            </div>

            <p>✔ UPI</p>
            <p>✔ Credit Card</p>
            <p>✔ Debit Card</p>
            <p>✔ Net Banking</p>
            <p>✔ Wallets</p>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 font-bold">
              <Truck size={18} />
              Cash On Delivery
            </div>

            <p>✔ Pay After Delivery</p>
            <p>✔ No Advance Payment</p>
            <p>✔ Order Confirmation Instant</p>
          </>
        )}
      </div>
    </section>
  );
}
