"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useChat } from "@/context/ChatContext";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

export default function ChatPage() {
  const { chatId } = useParams();
  const { chat, loadChat, sendMessage, loading } = useChat();

  useEffect(() => {
    if (chatId) {
      loadChat(chatId).catch((err) => {
        toast.error(err.message || "Failed to load chat");
      });
    }
  }, [chatId]);

  const handleSend = async (message) => {
    try {
      await sendMessage(chatId, message);
    } catch (error) {
      toast.error(error.message || "Message failed");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#eef4fa]">
      <ChatHeader order={chat?.order} />

      {loading && !chat ? (
        <div className="flex flex-1 items-center justify-center text-[#607287]">
          Loading chat...
        </div>
      ) : (
        <ChatMessages chat={chat} onQuickQuestion={handleSend} />
      )}

      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}