import React from 'react';
import { useState, useEffect, useRef } from "react";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import { sendQuestion } from "../../api";


const UserPage = () => {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chatHistory");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify(messages));
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (question) => {
        const userMessage = { sender: "user", text: question };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const data = await sendQuestion(question);
            const botMessage = {
                sender: "bot",
                text: data.jawaban || "Mohon maaf, saya belum mengerti pertanyaan Anda.",
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Terjadi kesalahan koneksi dengan server." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-7 bg-base-300">
            <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-7 text-center">
                🤖 Royal's Resto Chatbot
            </h1>

            <div className="w-full bg-base-200 shadow-xl rounded-box flex flex-col h-[80vh] p-2 sm:p-4">
                {/* Chat window */}
                <div className="flex-1 overflow-y-auto flex flex-col-reverse space-y-2 space-y-reverse scrollbar-thin scrollbar-thumb-dark">
                    <ChatWindow messages={[...messages].reverse()} loading={loading} />
                </div>
                <div ref={chatEndRef} />
                {/* Input */}
                <ChatInput onSend={handleSend} loading={loading} />
            </div>
        </div>
    );
};

export default UserPage;