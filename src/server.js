//Concentra las ejecuciones para arrancar el servidor, tiene mas herramientas http que express

import http from "http";

import app from "./app.js";

const server = http.createServer(app);
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
