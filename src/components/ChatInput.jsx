import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim() || loading) return;
        onSend(input);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex gap-2 flex-wrap mt-5">
            <input
                type="text"
                placeholder="Tulis pertanyaan..."
                className="input input-bordered input-primary p-3 flex-1 min-w-[150px] focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
            />

            <button
                className="btn btn-primary flex items-center gap-2 min-w-[100px]"
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
