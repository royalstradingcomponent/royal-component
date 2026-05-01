"use client";

import { useRef, useEffect } from "react";
import OrderSupportCard from "./OrderSupportCard";

const quickQuestions = [
  "Where is my order?",
  "Order kaha hai?",
  "When will my order dispatch?",
  "Dispatch kab hoga?",
  "Delivery date",
  "Delivery kab hogi?",
  "GST invoice",
  "GST bill chahiye",
  "Change address",
  "Address change karna hai",
  "Cancel order",
  "Order cancel karna hai",
  "Payment status",
  "Amount deducted but order pending",
  "Refund status",
  "Return / replacement",
  "Wrong or damaged product",
  "Bulk quantity",
  "Bulk quotation",
  "MOQ / minimum quantity",
  "Product stock available?",
  "Best price / discount",
  "Alternate part",
  "Datasheet",
  "Warranty",
  "Tracking number",
  "AWB / courier tracking",
  "Urgent delivery",
  "Same day dispatch possible?",
  "Pincode delivery check",
  "Packaging / ESD packing",
  "Purchase order / PO",
  "Product not found",
  "Technical support",
  "Talk to human agent",
];

export default function ChatMessages({ chat, onQuickQuestion }) {
  const bottomRef = useRef(null);
  const messages = chat?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#eef4fa] px-4 py-5">
      <div className="mx-auto max-w-5xl space-y-4">
        <OrderSupportCard order={chat?.order} />

        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg._id || index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isUser
                    ? "bg-[#2454b5] text-white"
                    : "border border-[#dbe5f0] bg-white text-[#102033]"
                }`}
              >
                <p className="whitespace-pre-line leading-6">{msg.message}</p>

                <p className="mt-1 text-right text-[10px] opacity-70">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl border border-[#dbe5f0] bg-white p-4">
          <div className="mb-3">
            <p className="font-black text-[#102033]">Quick questions</p>
            <p className="mt-1 text-xs font-semibold text-[#607287]">
              Select a common order, delivery, payment or technical support query.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onQuickQuestion(q)}
                className="rounded-full border border-[#cbdff4] bg-[#f8fbff] px-4 py-2 text-sm font-bold text-[#2454b5] transition hover:border-[#2454b5] hover:bg-[#eaf3ff]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}