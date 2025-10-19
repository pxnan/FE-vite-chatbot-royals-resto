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
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify(messages));
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Effect untuk mengirim pesan selamat datang
    useEffect(() => {
        // Jika chat history kosong, kirim pesan selamat datang
        if (messages.length === 0 && !hasWelcomed) {
            const welcomeMessage = {
                sender: "bot",
                text: "Hai selamat datang! Ada yang bisa saya bantu?",
            };
            setMessages([welcomeMessage]);
            setHasWelcomed(true);
        }
    }, [messages, hasWelcomed]);

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
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            {/* === Navbar (tetap di atas) === */}
            <Navbar />

            {/* === Area Chat Scrollable === */}
            <div className="flex-1 overflow-y-auto">
                <div className="min-h-full flex flex-col-reverse p-4 sm:p-6">
                    <div className="max-w-3xl mx-auto w-full space-y-3">
                        <ChatWindow messages={messages} loading={loading} />
                        <div ref={chatEndRef} />
                    </div>
                </div>
            </div>

            {/* === Input tetap di bawah === */}
            <div className="sticky bottom-0 z-50 bg-black">
                <>
                <div className="max-w-3xl mx-auto md:mb-3 w-auto p-3 sm:p-4 border-t md:border md:rounded-xl border-neutral-800">
                    <ChatInput onSend={handleSend} loading={loading} />
                </div>
                <Footer />
                </>
            </div>
        </div>
    );
};

export default UserPage;