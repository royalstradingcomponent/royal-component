"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MessageSquareText,
  RefreshCcw,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { adminRequest } from "@/lib/api";

const chatStatuses = ["open", "waiting", "resolved"];

export default function AdminChatsPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await adminRequest("/api/admin/chats");
      const list = data.chats || [];
      setChats(list);

      if (!activeChat && list.length) {
        setActiveChat(list[0]);
      } else if (activeChat) {
        const fresh = list.find((item) => item._id === activeChat._id);
        if (fresh) setActiveChat(fresh);
      }
    } catch (error) {
      toast.error(error.message || "Chats load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const filteredChats = useMemo(() => {
    const q = search.toLowerCase();

    return chats.filter((chat) => {
      const user = chat.user || {};
      const order = chat.order || {};

      return (
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.toLowerCase().includes(q) ||
        order.orderNumber?.toLowerCase().includes(q) ||
        chat.status?.toLowerCase().includes(q)
      );
    });
  }, [chats, search]);

  const sendReply = async () => {
    if (!activeChat?._id) return;

    if (!reply.trim()) {
      toast.error("Reply message required");
      return;
    }

    try {
      setSending(true);

      const data = await adminRequest(`/api/admin/chats/${activeChat._id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: reply.trim() }),
      });

      toast.success("Reply sent");
      setReply("");

      setActiveChat(data.chat);
      await loadChats();
    } catch (error) {
      toast.error(error.message || "Reply failed");
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status) => {
    if (!activeChat?._id) return;

    try {
      setStatusSaving(true);

      const data = await adminRequest(`/api/admin/chats/${activeChat._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast.success("Chat status updated");
      setActiveChat(data.chat);
      await loadChats();
    } catch (error) {
      toast.error(error.message || "Status update failed");
    } finally {
      setStatusSaving(false);
    }
  };

  const lastMessage = (chat) => {
    const messages = chat.messages || [];
    return messages[messages.length - 1]?.message || "No messages";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#102033]">Support Chats</h1>
          <p className="text-sm text-slate-500">
            Manage customer order support conversations.
          </p>
        </div>

        <button
          onClick={loadChats}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold hover:bg-slate-50"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>
      </div>

      <div className="grid min-h-[680px] gap-5 xl:grid-cols-[380px_1fr]">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, order, status..."
                className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2454b5]"
              />
            </div>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="p-5 text-sm text-slate-500">Loading chats...</div>
            ) : filteredChats.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">No chats found.</div>
            ) : (
              filteredChats.map((chat) => {
                const user = chat.user || {};
                const order = chat.order || {};
                const active = activeChat?._id === chat._id;

                return (
                  <button
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className={`block w-full border-b p-4 text-left transition ${
                      active ? "bg-[#eef4ff]" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#2454b5]">
                        <UserRound size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-bold text-[#102033]">
                            {user.name || "Customer"}
                          </p>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              chat.status === "resolved"
                                ? "bg-green-50 text-green-600"
                                : chat.status === "waiting"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {chat.status}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {order.orderNumber || "No order number"}
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {lastMessage(chat)}
                        </p>

                        <p className="mt-2 text-[11px] text-slate-400">
                          {chat.updatedAt
                            ? new Date(chat.updatedAt).toLocaleString("en-IN")
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {!activeChat ? (
            <div className="flex h-full min-h-[680px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2454b5]">
                <MessageSquareText size={30} />
              </div>
              <h2 className="text-xl font-bold text-[#102033]">
                Select a chat
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a customer conversation from the left list.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[680px] flex-col">
              <div className="border-b p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <h2 className="text-xl font-bold text-[#102033]">
                      {activeChat.user?.name || "Customer"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {activeChat.user?.email || "No email"} •{" "}
                      {activeChat.user?.phone || "No phone"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#2454b5]">
                      Order: {activeChat.order?.orderNumber || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={activeChat.status || "open"}
                      disabled={statusSaving}
                      onChange={(e) => updateStatus(e.target.value)}
                      className="rounded-xl border px-4 py-3 text-sm font-semibold outline-none focus:border-[#2454b5]"
                    >
                      {chatStatuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-[#f6f9fc] p-5">
                {(activeChat.messages || []).map((msg, index) => {
                  const isUser = msg.sender === "user";
                  const isSupport = msg.sender === "support";

                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${
                        isUser ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                          isUser
                            ? "bg-white text-[#102033]"
                            : isSupport
                            ? "bg-[#2454b5] text-white"
                            : "bg-yellow-50 text-yellow-900"
                        }`}
                      >
                        <p className="mb-1 text-[11px] font-bold uppercase opacity-70">
                          {msg.sender}
                        </p>
                        <p className="whitespace-pre-line text-sm leading-6">
                          {msg.message}
                        </p>
                        <p className="mt-2 text-[11px] opacity-70">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleString("en-IN")
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t bg-white p-4">
                <div className="flex gap-3">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type admin reply..."
                    className="min-h-[54px] flex-1 resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2454b5]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                  />

                  <button
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl bg-[#2454b5] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <Send size={17} />
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Press Enter to send. Shift + Enter for new line.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}