const socket = io();
const chatContainer = document.getElementById("chat-box");
let emptyContainer = document.getElementById("empty-box");

function createTextBox(message) {
    const chatItem = document.createElement("a")
    chatItem.classList.add("chat-item")
    chatItem.id = message.from.username
    chatItem.href = `/chat?to=${message.from.username}`
    const image = document.createElement("img")
    image.src = message.from.profilePic
    const chatDetail = document.createElement("div")
    chatDetail.classList.add("chat-detail")

    const username = document.createElement("div")
    username.classList.add("username")
    username.innerText = message.from.username

    const text = document.createElement("div")
    text.innerText = message.text
    text.classList.add("unread")

    chatDetail.appendChild(username)
    chatDetail.appendChild(text)

    const notify = document.createElement("div")
    notify.classList.add("notify")

    chatItem.appendChild(image)
    chatItem.appendChild(chatDetail)
    chatItem.appendChild(notify)
    chatContainer.prepend(chatItem)
}

// Get messages
socket.on("message", (message) => {
    const textBox = document.getElementById(message.from.username)

    textBox && chatContainer.removeChild(textBox)
    emptyContainer && chatContainer.removeChild(emptyContainer)
    emptyContainer = null

    createTextBox(message)
});
