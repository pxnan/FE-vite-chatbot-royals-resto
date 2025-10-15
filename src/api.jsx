export async function sendQuestion(question) {
    const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pertanyaan: question }),
    });

    if (!response.ok) {
        throw new Error("Gagal menghubungi server");
    }

    return await response.json();
}
