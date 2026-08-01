async function sendMessage() {

    const input = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();

    if (message === "") return;

    // User message
    chatBox.innerHTML += `
        <div class="message user">
            <div class="bubble">${message}</div>
        </div>
    `;

    input.value = "";

    // Typing indicator
    chatBox.innerHTML += `
        <div class="message ai" id="typing">
            <div class="bubble">🤖 AI Buddy is typing...</div>
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        document.getElementById("typing").remove();

        chatBox.innerHTML += `
            <div class="message ai">
                <div class="bubble">${data.reply}</div>
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    }

    catch (error) {

        document.getElementById("typing").remove();

        chatBox.innerHTML += `
            <div class="message ai">
                <div class="bubble">
                    ❌ Unable to connect to AI Buddy.
                </div>
            </div>
        `;

    }

}
