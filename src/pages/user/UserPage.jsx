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

    useEffect(() => {
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

            if (data.status === "ambigu" && data.opsi_pertanyaan) {
                // Jika ambiguous, tampilkan tombol opsi pertanyaan
                const botMessage = {
                    sender: "bot",
                    text: data.jawaban,
                    ambiguousOptions: data.opsi_pertanyaan,
                };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                // Status ok atau unknown
                const botMessage = {
                    sender: "bot",
                    text: data.jawaban,
                };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Terjadi kesalahan koneksi dengan server." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ==== Fungsi untuk menangani klik opsi pertanyaan ambigu ====
    const handleAmbiguousOptionClick = (option) => {
        // Hapus seluruh pesan bot terakhir yang punya ambiguousOptions
        setMessages(prev => {
            const newMessages = [...prev];
            for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].sender === "bot" && newMessages[i].ambiguousOptions) {
                    newMessages.splice(i, 1); // hapus pesan itu
                    break; // hapus hanya satu pesan terakhir
                }
            }
            return newMessages;
        });

        // Kirim pertanyaan yang dipilih
        handleSend(option);
    };


    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            <Navbar />

            <div className="flex-1 overflow-y-auto">
                <div className="min-h-full flex flex-col-reverse p-4 sm:p-6">
                    <div className="max-w-3xl mx-auto w-full space-y-3">
                        <ChatWindow messages={messages} loading={loading} />

                        {/* Tampilkan tombol opsi pertanyaan ambigu */}
                        {messages.map((msg, idx) =>
                            msg.sender === "bot" && msg.ambiguousOptions ? (
                                <div key={`ambiguity-${idx}`} className="flex flex-col space-y-2 my-2">
                                    {msg.ambiguousOptions.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAmbiguousOptionClick(opt)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 text-left mx-5 cursor-pointer"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : null
                        )}

                        <div ref={chatEndRef} />
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 z-50 bg-black">
                <div className="max-w-3xl mx-auto md:mb-3 w-auto p-3 sm:p-4 border-t md:border md:rounded-xl border-neutral-800">
                    <ChatInput onSend={handleSend} loading={loading} />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default UserPage;
