import { Server } from "socket.io";

let io;

let messages = [];

export const init = (httpServer) => {
  let io = new Server(httpServer);

  io.on("connection", (socketClient) => {
    console.log(`Se ha conectado un nuevo cliente ${socketClient.id}`);
    socketClient.emit("log-messages", { messages });
    socketClient.broadcast.emit("new-client");
    socketClient.on("new-message", (data) => {
      const { username, text } = data;
      messages.push({ username, text });
      io.emit("notification", { messages });
    });
  });
  console.log(`Server socket is running ❤️`);
};

export const emitFromAPI = (event, data) => {
  io.emit(event, data);
};
