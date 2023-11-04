(function () {
  const socket = io();
  let username;

  const formMessage = document.getElementById("form-message");
  const inputMessage = document.getElementById("input-message");
  const logMessages = document.getElementById("log-message");

  formMessage.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = inputMessage.value;
    socket.emit("new-message", { username, text });
    inputMessage.value = "";
    inputMessage.focus();
  });

  function updateLogMessages(messages) {
    logMessages.innerText = "";

    if (Array.isArray(messages)) {
      messages.forEach((msg) => {
        const p = document.createElement("p");
        p.innerText = `${msg.user} : ${msg.message}`;
        logMessages.appendChild(p);
      });
    } else {
      const p = document.createElement("p");
      p.innerText = `${messages.user} : ${messages.message}`;
      logMessages.appendChild(p);
    }
  }
  socket.on("messages", (messages) => {
    updateLogMessages(messages);
  });
  
  socket.on("new-client", () => {
    Swal.fire({
      text: "Nuevo usuario conectado",
      toast: true,
      position: "top-right",
    });
  });

  Swal.fire({
    title: "Identificate por favor",
    input: "text",
    inputLabel: "Ingresa tu username",
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) {
        return "Necesitamos que ingreses tu username!";
      }
    },
  }).then((result) => {
    username = result.value.trim();
    console.log(`Hola ${username} bienvenido`);
  });
})();
