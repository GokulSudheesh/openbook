const socket = io();
const form = document.getElementById("input");
const messageContainer = document.querySelector(".container");

// Get username
const searchParams = new URLSearchParams(location.search);
const toUser = searchParams.get("to");

async function getMessages() {
    try {
        const response = await fetch(`/chat/messages?to=${toUser}`, {
            method: "GET"
        });
        if (!response.ok) throw new Error("Something went wrong.");
        const { messages } = await response.json();
        let prevDate = null;
        const todayDate = new Date().setHours(0,0,0,0);
        for (const message of messages) {
            const messageDate = new Date(message.date).setHours(0,0,0,0);
            if (!prevDate || prevDate != messageDate) {
                const time = (messageDate == todayDate) ? "Today" : new Date(message.date).toDateString();
                displayTime(time);
            }
            displayMessage(message);
            prevDate = messageDate;
        }
        // Scroll to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    } catch (err) {
        console.log(err);
    }
}

getMessages();

// Get theme
socket.on("theme", ({ theme }) => {
    changeTheme(theme);
});

// Get messages
socket.on("message", (message) => {
    if (message.from.username === toUser || message.from.username === "You") {
        displayMessage(message);
        // Scroll to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    } else {
        // Add notification?
        return;
    }
});

form.addEventListener("submit", event => {
    event.preventDefault();
    const msg = event.target.message.value.trim().slice(0, 500);
    event.target.message.value = "";
    event.target.message.focus();
    if (!msg) return
    // Emit message to server
    socket.emit("clientMessage", { message: msg, to: toUser });
});

function displayMessage(message) {
    const style = (message.from.username === "You") ? "to" : "from";
    const parentDiv = document.createElement("div");
    parentDiv.classList.add(style);
    const childDiv = document.createElement("div");
    childDiv.classList.add(`${style}-textbox`);
    const msgP = document.createElement("p");
    msgP.classList.add("text");
    const timeP = document.createElement("p");
    timeP.classList.add("meta");
    msgP.innerText = message.text;
    timeP.innerText += new Date(message.date).toLocaleString('en-US', { 
        hour: "numeric", 
        minute: "numeric", 
        hour12: true 
    });
    childDiv.appendChild(msgP);
    childDiv.appendChild(timeP);
    parentDiv.appendChild(childDiv);
    messageContainer.appendChild(parentDiv);
}

function displayTime(time){
    const div = document.createElement("div");
    div.classList.add("time");
    div.innerHTML = `<p>${time}</p>`;
    messageContainer.appendChild(div);
}
