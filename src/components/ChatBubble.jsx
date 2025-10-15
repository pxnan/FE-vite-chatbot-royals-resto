export default function ChatBubble({ sender, text }) {
    const isUser = sender === "user";
    return (
        <div className="ml-5 mr-5">
            <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
                <div
                    className={`chat-bubble ${isUser ? "chat-bubble-primary text-white" : "chat-bubble-secondary text-white"}`}
                >
                    {text}
                </div>
            </div>
        </div>
    );
}
