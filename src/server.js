import http from "http";
import app from "./app.js";
import { init } from "./socket.js";
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Server is listening on http//localhost:${PORT}`);
});

init(httpServer);
