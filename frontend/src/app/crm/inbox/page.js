"use client";

import { useEffect, useState } from "react";

import {
    Search,
    Phone,
    MoreVertical,
} from "lucide-react";

import {
    getConversations,
    getMessages,
    sendMessage,
} from "@/lib/crmApi";

export default function InboxPage() {
    const [loading, setLoading] =
        useState(true);

    const [conversations, setConversations] =
        useState([]);

    const [selectedChat, setSelectedChat] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [newMessage, setNewMessage] =
        useState("");

    const [sending, setSending] =
        useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations =
        async () => {
            try {
                const data =
                    await getConversations();

                const list =
                    data.conversations || [];

                setConversations(list);

                if (list.length > 0) {

                    setSelectedChat(
                        list[0]
                    );

                    loadMessages(
                        list[0]._id
                    );

                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };



    const loadMessages =
        async (conversationId) => {
            try {

                const data =
                    await getMessages(
                        conversationId
                    );

                setMessages(
                    data.messages || []
                );

            } catch (error) {

                console.error(error);

            }
        };

    const handleSendMessage =
        async () => {

            if (
                !newMessage.trim() ||
                !selectedChat
            ) {
                return;
            }

            try {

                setSending(true);

                await sendMessage(
                    selectedChat._id,
                    newMessage
                );

                setNewMessage("");

                await loadMessages(
                    selectedChat._id
                );

                await loadConversations();

            } catch (error) {

                console.error(error);

            } finally {

                setSending(false);

            }
        };

    if (loading) {
        return (
            <div className="p-8">
                Loading Inbox...
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] flex">

            {/* LEFT SIDEBAR */}

            <div className="w-[380px] border-r bg-white">

                <div className="border-b p-4">

                    <h2 className="text-xl font-bold">
                        Conversations
                    </h2>

                    <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2">

                        <Search size={18} />

                        <input
                            placeholder="Search..."
                            className="w-full outline-none"
                        />

                    </div>

                </div>

                <div className="overflow-y-auto">

                    {conversations.map(
                        (chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {

                                    setSelectedChat(chat);

                                    loadMessages(
                                        chat._id
                                    );

                                }}
                                className={`cursor-pointer border-b p-4 transition hover:bg-slate-50 ${selectedChat?._id ===
                                    chat._id
                                    ? "bg-green-50"
                                    : ""
                                    }`}
                            >
                                <h3 className="font-bold">
                                    {
                                        chat.contact
                                            ?.name
                                    }
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {
                                        chat.lastMessage
                                    }
                                </p>
                            </div>
                        )
                    )}

                </div>

            </div>

            {/* CHAT WINDOW */}

            <div className="flex flex-1 flex-col">

                {selectedChat ? (
                    <>

                        <div className="flex items-center justify-between border-b bg-white px-6 py-4">

                            <div>

                                <h3 className="font-bold text-lg">
                                    {
                                        selectedChat
                                            .contact
                                            ?.name
                                    }
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {
                                        selectedChat
                                            .contact
                                            ?.phone
                                    }
                                </p>

                            </div>

                            <div className="flex gap-4">

                                <Phone
                                    size={20}
                                />

                                <MoreVertical
                                    size={20}
                                />

                            </div>

                        </div>

                        <div className="flex-1 overflow-y-auto bg-[#efeae2] p-6">

                            <div className="space-y-4">

                                {messages.map(
                                    (msg) => (

                                        <div
                                            key={msg._id}
                                            className={`flex ${msg.direction ===
                                                "outgoing"
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >

                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.direction ===
                                                    "outgoing"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-white shadow"
                                                    }`}
                                            >

                                                <div>

                                                    <p>
                                                        {msg.message}
                                                    </p>

                                                    <p className="mt-2 text-right text-xs opacity-70">
                                                        {new Date(
                                                            msg.createdAt
                                                        ).toLocaleTimeString()}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="border-t bg-white p-4">

                            <div className="flex gap-3">

                                <input
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-xl border px-4 py-3 outline-none"
                                />

                                <button
                                    onClick={
                                        handleSendMessage
                                    }
                                    disabled={sending}
                                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
                                >
                                    {sending
                                        ? "Sending..."
                                        : "Send"}
                                </button>

                            </div>

                        </div>

                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        No Conversation Selected
                    </div>
                )}

            </div>

        </div>
    );
}