// =======================================
// AI Buddy - script.js
// Part 1
// =======================================

// Elements
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const sidebar = document.getElementById("sidebar");

// Chat History
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

// =======================================
// Sidebar
// =======================================

function toggleSidebar() {
    sidebar.classList.toggle("active");
}

// =======================================
// Scroll Chat
// =======================================

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// =======================================
// Save History
// =======================================

function saveHistory() {
    localStorage.setItem(
        "chatHistory",
        JSON.stringify(chatHistory)
    );
}

// =======================================
// Load History
// =======================================

function loadHistory() {

    console.log("loadHistory called");

    console.log(chatHistory);

    if (chatHistory.length === 0) {
        return;
    }

    chatBox.innerHTML = "";

   chatHistory.forEach(msg => {
    console.log("Adding message:", msg);
    addMessage(msg.text, msg.sender, false);
    });

}

// =======================================
// Add Message
// =======================================

function addMessage(text, sender, save = true) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    if (sender === "ai") {

        message.innerHTML = `
            <div class="avatar">🤖</div>

            <div class="bubble">
                ${text}
            </div>
        `;

    } else {

        message.innerHTML = `
            <div class="bubble">
                ${text}
            </div>
        `;

    }

    chatBox.appendChild(message);

    scrollBottom();

    if (save) {

        chatHistory.push({
            text: text,
            sender: sender
        });

        saveHistory();

    }

}

// =======================================
// Typing Bubble
// =======================================

function typingBubble() {

    const typing = document.createElement("div");

    typing.className = "message ai";

    typing.id = "typing";

    typing.innerHTML = `
        <div class="avatar">🤖</div>

        <div class="bubble">
            AI Buddy is typing...
        </div>
    `;

    chatBox.appendChild(typing);

    scrollBottom();

}

// =======================================
// Remove Typing
// =======================================

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing) {
        typing.remove();
    }

}

// =======================================
// Send Message
// =======================================

async function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    addMessage(text, "user");

    input.value = "";

    typingBubble();

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        removeTyping();

        if (data.reply) {
            addMessage(data.reply, "ai");
        } else {
            addMessage("⚠️ No response received.", "ai");
        }

    } catch (error) {

        console.error(error);

        removeTyping();

        addMessage("⚠️ Unable to connect to AI Buddy.", "ai");

    }

}

// =======================================
// New Chat
// =======================================

function newChat() {

    chatHistory = [];

    saveHistory();

    chatBox.innerHTML = `
        <div class="message ai">
            <div class="avatar">🤖</div>

            <div class="bubble">
                <strong>Hello 👋</strong><br><br>
                Welcome to <b>AI Buddy</b>.<br><br>
                Ask me anything.
            </div>
        </div>
    `;

}

// =======================================
// Enter Key
// =======================================

input.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        sendMessage();
    }

});

// =======================================
// Load Saved Chat
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    loadHistory();

});
