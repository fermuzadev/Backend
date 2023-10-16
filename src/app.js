import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";

import prodRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import indexRouter from "./routes/index.router.js";

const app = express();

//HANDLEBARS
//Le indicamos el motor a utilizar
app.engine("handlebars", handlebars.engine());
//Aca abajo establezco donde van a estar las vistas de handlebars
app.set("views", path.join(__dirname, "views"));
//Indicamos la extension de nuestros archivos
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/handlebars", (req, res) => {
  let testUser = {
    name: "Fer",
    last_name: "Muzaber",
  };
  res.render("index", testUser);
});
app.use("/", indexRouter);

app.use("/api", prodRouter, cartsRouter);

app.use((error, req, res, next) => {
  const message = `😥 Unknown error ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
});
/* app.get("/", (req, res) => {
  res.send("<h1>Proyecto Final - Primera Entrega</h1>");
}); */

export default app;
