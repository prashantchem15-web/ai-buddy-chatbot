// =======================================
// AI Buddy - script.js
// =======================================


// =======================================
// Elements
// =======================================

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const sidebar = document.getElementById("sidebar");
const fileInput = document.getElementById("file-input");


// =======================================
// Sidebar
// =======================================

function toggleSidebar() {

    sidebar.classList.toggle("active");

}


// =======================================
// Scroll
// =======================================

function scrollBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}


// =======================================
// Add Message
// =======================================

function addMessage(text, sender, save = true) {

    const message = document.createElement("div");

    message.className = "message " + sender;


    // ===================================
    // AI Message
    // ===================================

    if (sender === "ai") {

        message.innerHTML = `
            <div class="avatar">🤖</div>

            <div class="bubble">

                <div class="message-text">
                    ${marked.parse(text)}
                </div>

                <button class="copy-btn" onclick="copyMessage(this)">
                    📋 Copy
                </button>

            </div>
        `;

    }


    // ===================================
    // User Message
    // ===================================

    else {

        message.innerHTML = `
            <div class="bubble">
                ${text}
            </div>
        `;

    }


    chatBox.appendChild(message);


    // ===================================
    // Highlight Code
    // ===================================

    message.querySelectorAll("pre code").forEach((block) => {

        hljs.highlightElement(block);

    });


    scrollBottom();


    // ===================================
    // Save to Firestore
    // ===================================

    if (save && window.currentUser) {

        if (typeof window.saveMessageToFirestore === "function") {

            window.saveMessageToFirestore(
                text,
                sender
            );

        }

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

        <div class="bubble typing-bubble">

            <span></span>
            <span></span>
            <span></span>

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

    if (text === "") {

        return;

    }


    // Show user message
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


        if (!response.ok) {

            throw new Error(
                "Server returned " + response.status
            );

        }


        const data = await response.json();


        removeTyping();


        if (data.reply) {

            addMessage(
                data.reply,
                "ai"
            );

        }

        else {

            addMessage(
                "⚠️ No response received.",
                "ai"
            );

        }

    }

    catch (error) {

        console.error(
            "Chat error:",
            error
        );

        removeTyping();

        addMessage(
            "⚠️ Unable to connect to AI Buddy.",
            "ai"
        );

    }

}


// =======================================
// Load Firestore History
// =======================================

async function loadChatHistory() {

    console.log(
        "Loading Firestore chat history..."
    );


    if (!window.currentUser) {

        console.log(
            "No Google user logged in."
        );

        return;

    }


    if (
        typeof window.loadFirestoreHistory !==
        "function"
    ) {

        console.log(
            "Firestore history function not ready."
        );

        return;

    }


    const history =
        await window.loadFirestoreHistory();


    if (!Array.isArray(history)) {

        return;

    }


    // Clear current chat
    chatBox.innerHTML = "";


    // Display saved messages
    history.forEach((msg) => {

        addMessage(
            msg.text,
            msg.sender,
            false
        );

    });


    console.log(
        "Loaded",
        history.length,
        "messages."
    );

}


// =======================================
// Firebase Authentication Ready
// =======================================

window.addEventListener(
    "firebaseAuthReady",
    async function (event) {

        console.log(
            "Firebase authentication ready."
        );

        if (event.detail.user) {

            await loadChatHistory();

        }

    }
);


// =======================================
// New Chat
// =======================================

function newChat() {

    chatBox.innerHTML = `
        <div class="message ai">

            <div class="avatar">
                🤖
            </div>

            <div class="bubble">

                <strong>Hello 👋</strong>

                <br><br>

                Welcome to <b>AI Buddy</b>.

                <br><br>

                Ask me anything.

            </div>

        </div>
    `;

}


// =======================================
// Enter Key
// =======================================

input.addEventListener(
    "keypress",
    function (e) {

        if (e.key === "Enter") {

            sendMessage();

        }

    }
);


// =======================================
// Copy Message
// =======================================

function copyMessage(button) {

    const messageText =
        button.parentElement
        .querySelector(".message-text")
        .innerText;


    navigator.clipboard.writeText(
        messageText
    );


    button.innerHTML =
        "✅ Copied";


    setTimeout(() => {

        button.innerHTML =
            "📋 Copy";

    }, 2000);

}


// =======================================
// File Upload
// =======================================

async function uploadFile() {

    const file =
        fileInput.files[0];


    if (!file) {

        return;

    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    try {

        const response =
            await fetch(
                "/upload",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (data.success) {

            addMessage(
                `📎 Uploaded: <b>${data.filename}</b>`,
                "user"
            );

            addMessage(
                "✅ File uploaded successfully!",
                "ai"
            );

        }

        else {

            addMessage(
                "❌ Upload failed.",
                "ai"
            );

        }

    }

    catch (error) {

        console.error(
            "Upload error:",
            error
        );

        addMessage(
            "⚠️ Server error while uploading.",
            "ai"
        );

    }


    fileInput.value = "";

}


// =======================================
// Image Preview
// =======================================

const previewArea =
    document.getElementById(
        "preview-area"
    );

const previewImage =
    document.getElementById(
        "preview-image"
    );

const previewName =
    document.getElementById(
        "preview-name"
    );


if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                return;

            }


            if (previewArea) {

                previewArea.style.display =
                    "flex";

            }


            if (previewName) {

                previewName.innerText =
                    file.name;

            }


            if (
                file.type.startsWith(
                    "image/"
                )
            ) {

                const reader =
                    new FileReader();


                reader.onload =
                    function (e) {

                        if (previewImage) {

                            previewImage.src =
                                e.target.result;

                            previewImage.style.display =
                                "block";

                        }

                    };


                reader.readAsDataURL(
                    file
                );

            }

            else {

                if (previewImage) {

                    previewImage.style.display =
                        "none";

                }

            }

        }
    );

}


// =======================================
// Remove Preview
// =======================================

function removePreview() {

    if (fileInput) {

        fileInput.value = "";

    }


    if (previewArea) {

        previewArea.style.display =
            "none";

    }


    if (previewImage) {

        previewImage.src = "";

    }


    if (previewName) {

        previewName.innerText = "";

    }

}
