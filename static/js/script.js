const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const sidebar = document.getElementById("sidebar");

/* -----------------------------
   Sidebar Toggle
------------------------------*/

function toggleSidebar(){

    sidebar.classList.toggle("active");

}

/* -----------------------------
   Scroll Chat
------------------------------*/

function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}

/* -----------------------------
   Add Message
------------------------------*/

function addMessage(text,sender){

    const msg=document.createElement("div");

    msg.className="message "+sender;

    if(sender==="ai"){

        msg.innerHTML=`
        <div class="avatar">🤖</div>
        <div class="bubble">${text}</div>
        `;

    }else{

        msg.innerHTML=`
        <div class="bubble">${text}</div>
        `;

    }

    chatBox.appendChild(msg);

    scrollBottom();

}

/* -----------------------------
   Typing Bubble
------------------------------*/

function typingBubble(){

    const typing=document.createElement("div");

    typing.className="message ai";

    typing.id="typing";

    typing.innerHTML=`
    <div class="avatar">🤖</div>
    <div class="bubble">
    AI Buddy is typing...
    </div>
    `;

    chatBox.appendChild(typing);

    scrollBottom();

}

/* -----------------------------
   Remove Typing
------------------------------*/

function removeTyping(){

    const typing=document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}

/* -----------------------------
   Send Message
------------------------------*/

async function sendMessage(){

    const text=input.value.trim();

    if(text==="") return;

    addMessage(text,"user");

    input.value="";

    typingBubble();

    try{

        const response=await fetch("/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                message:text
            })

        });

        const data=await response.json();

        removeTyping();

        addMessage(data.reply,"ai");

    }

    catch(error){

        removeTyping();

        addMessage("⚠️ Unable to connect to AI.","ai");

    }

}

/* -----------------------------
   New Chat
------------------------------*/

function newChat(){

    chatBox.innerHTML=`
    <div class="message ai">

        <div class="avatar">

            🤖

        </div>

        <div class="bubble">

            <strong>Hello 👋</strong>

            <br><br>

            New chat started.

            <br><br>

            Ask me anything!

        </div>

    </div>
    `;

}

/* -----------------------------
   Enter Key
------------------------------*/

input.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});
