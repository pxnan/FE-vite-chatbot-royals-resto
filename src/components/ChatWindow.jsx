import ChatBubble from "./ChatBubble";

export default function ChatWindow({ messages, loading }) {
    return (
        <>
            {messages.map((msg, idx) => (
                <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
            ))}
            {loading && <ChatBubble sender="bot" text="Chatbot sedang mengetik..." />}
        </>
    );
}
