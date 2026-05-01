"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const msg = text.trim();
    if (!msg || loading) return;

    await onSend(msg);
    setText("");
  };

  return (
    <div className="border-t border-[#dbe5f0] bg-white px-4 py-4">
      <div className="mx-auto flex max-w-5xl gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about dispatch, delivery, invoice, payment, datasheet..."
          className="h-12 flex-1 rounded-xl border border-[#cbd5e1] px-4 outline-none focus:border-[#2454b5]"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={loading}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2454b5] px-5 font-black text-white disabled:opacity-60"
        >
          <Send size={17} />
          Send
        </button>
      </div>
    </div>
  );
}