"use client";

import {
  Search,
  Send,
  Phone,
  Mail,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Amit Verma",
    message: "Need STM32 price",
  },
  {
    id: 2,
    name: "Global Tech",
    message: "Send quotation",
  },
  {
    id: 3,
    name: "Tech World",
    message: "Need BOM support",
  },
];

export default function InboxPage() {
  return (
    <div className="h-screen bg-[#f5f7fb]">

      <div className="grid h-full grid-cols-[320px_1fr_320px]">

        {/* LEFT PANEL */}

        <div className="border-r bg-white">

          <div className="p-4 border-b">

            <h1 className="text-2xl font-black">
              Inbox
            </h1>

            <div className="mt-4 relative">

              <Search
                className="absolute left-3 top-3"
                size={18}
              />

              <input
                placeholder="Search"
                className="w-full rounded-xl border pl-10 pr-4 py-3"
              />

            </div>

          </div>

          <div className="overflow-y-auto">

            {conversations.map((item) => (

              <div
                key={item.id}
                className="cursor-pointer border-b p-4 hover:bg-slate-50"
              >
                <h3 className="font-bold">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {item.message}
                </p>
              </div>

            ))}

          </div>

        </div>

        {/* CENTER CHAT */}

        <div className="flex flex-col">

          <div className="border-b bg-white p-4">

            <h2 className="font-bold">
              Amit Verma
            </h2>

          </div>

          <div className="flex-1 overflow-y-auto p-6">

            <div className="mb-4 max-w-md rounded-2xl bg-white p-4">
              Hello
            </div>

            <div className="ml-auto mb-4 max-w-md rounded-2xl bg-[#dcf8c6] p-4">
              Welcome to RoyalSMD
            </div>

          </div>

          <div className="border-t bg-white p-4">

            <div className="flex gap-3">

              <input
                placeholder="Type message..."
                className="flex-1 rounded-xl border px-4 py-3"
              />

              <button className="rounded-xl bg-[#25D366] px-5 text-white">
                <Send size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="border-l bg-white p-5">

          <div className="flex flex-col items-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-3xl font-bold text-white">
              A
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Amit Verma
            </h2>

          </div>

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3">
              <Phone size={18} />
              +91 9898989898
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              amit@gmail.com
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}   