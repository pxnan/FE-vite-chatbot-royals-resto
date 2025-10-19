import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend, loading }) {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    // Fokus otomatis saat komponen mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Fokus otomatis setelah input dikirim
    useEffect(() => {
        if (!loading) {
            inputRef.current?.focus();
        }
    }, [loading]);

    const handleSend = () => {
        if (!input.trim() || loading) return;
        onSend(input);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex gap-2 flex-wrap items-center">
            <input
                ref={inputRef} // <-- ref ditambahkan
                type="text"
                placeholder="Tulis pertanyaan..."
                className="input bg-black rounded-md border-neutral-800 text-white input-primary p-3 flex-1 min-w-[150px] focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
            />

            <button
                className="btn bg-neutral-800 rounded-md text-neutral-400 hover:bg-neutral-700 hover:text-white border-none flex items-center gap-2 min-w-[100px]"
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="loading loading-spinner"></span>
                        Mengirim...
                    </>
                ) : (
                    "Kirim"
                )}
            </button>
        </div>
    );
}
