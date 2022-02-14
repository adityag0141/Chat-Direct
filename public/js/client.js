const socket = io();
const messageContainer = document.querySelector(".card-body");

const form = document.getElementById("form");
const messageInput = document.getElementById("message")
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    socket.emit("send", message, socket.id);
    append(message, "right");
    messageInput.value = "";
})

const append = (message, position)=>{
    const newMessage = document.createElement("div");
    newMessage.innerText = message;
    newMessage.classList.add(position);
    messageContainer.append(newMessage);

}

//Notifying new user has joined the chat
socket.on("user-joined", function(msg, newUserName){
    append(newUserName +" "+ msg, "left");
})

//Receiving message sended by other member
socket.on("received", function(msg, uname){
    append(uname+": " +`${msg}`, "left");
} )

socket.on("left", function(msg, userName){
    append(userName + " " + msg, "left");
})