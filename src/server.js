//BACKEND
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import ProductManager from "./dao/ProductManager.js";
import { __dirname } from "./utils.js";
import path from "path";
import init from "./dao/mongodb.js";

await init(); //En type module se puede usar top level await

const prodPath = path.resolve(__dirname, "./dao/productos.json");

const testingProducts = new ProductManager(prodPath);
//Http server
const serverHttp = http.createServer(app);
//Socket io server
const io = new Server(serverHttp);
//Backend Emits
io.on("connection", async (socketClient) => {
  const productsJSON = await testingProducts.getProducts();
  console.log(`A new client is connected 👌 (${socketClient.id}) `);
  socketClient.emit("products", ...productsJSON);
  socketClient.on("disconnect", () => {
    console.log(`Client id ${socketClient.id} disconnected`);
  });

  socketClient.on("productSocket", async (newProduct) => {
    await testingProducts.addProduct(...newProduct);
    const productsUpdated = await testingProducts.getProducts();
    await socketClient.emit("productsUpdated", productsUpdated);
  });

  socketClient.on("idToDelete", async (deleteProduct) => {
    await testingProducts.deleteProduct(deleteProduct);
  });

  io.emit("message_everyone", `Client connected😎`);
});

const PORT = 8080;

serverHttp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
