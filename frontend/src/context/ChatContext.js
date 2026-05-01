"use client";

import { createContext, useContext, useState } from "react";
import { API_BASE } from "@/lib/api";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token || "";
  };

  const startChat = async (orderId) => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await fetch(`${API_BASE}/api/chat/start/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to start chat");
      }

      setChat(data.chat);
      return data.chat;
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await fetch(`${API_BASE}/api/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load chat");
      }

      setChat(data.chat);
      return data.chat;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId, message) => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await fetch(`${API_BASE}/api/chat/${chatId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Message failed");
      }

      setChat(data.chat);
      return data.chat;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        setChat,
        loading,
        startChat,
        loadChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}