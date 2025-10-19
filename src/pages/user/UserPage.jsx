import React from 'react';
import { useState, useEffect, useRef } from "react";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import { sendQuestion } from "../../api";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';


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
        <div className="flex flex-col h-screen bg-black">
            {/* === Navbar (tetap di atas) === */}
            <Navbar />

            {/* === Area Chat Scrollable (balon dari bawah) === */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col-reverse">
                <div className="max-w-3xl mx-auto w-full flex flex-col space-y-3">
                    {/* urutan dibalik agar pesan terbaru di bawah */}
                    <ChatWindow messages={[...messages]} loading={loading} />
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* === Input tetap di bawah === */}
            <div className="sticky bottom-0 z-50 md:pb-4">
                <div className="max-w-3xl bg-black border border-neutral-800 mx-auto w-full p-3 sm:p-4 md:rounded-2xl">
                    <ChatInput onSend={handleSend} loading={loading} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserPage;