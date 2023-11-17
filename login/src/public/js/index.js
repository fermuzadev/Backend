//Frontend

(function () {
  const socket = io();
  let messages = [];
  let date = new Date();
  const form = document.getElementById("from-message");
  const input = document.getElementById("input-message");
  const showMessage = document.getElementById("show-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    messages.push({
      socketId: socket.id,
      body: input.value,
    });
    socket.emit("new-message", input.value);
    input.value = "";
    input.focus();
    updateMessages(messages);
  });

  function updateMessages(messages) {
    showMessage.innerText = "";
    messages.forEach((message) => {
      const item = document.createElement("li");
      item.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} User: ${
        message.socketId
      } dice :${message.body} `;
      showMessage.appendChild(item);
    });
  }

  socket.on("notification", (message) => {
    messages.push(message);
    updateMessages(messages);
  });

  socket.on("start", (data) => {
    messages = data;
    updateMessages(messages);
  });
})();
