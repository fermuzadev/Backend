import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";

import prodRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import indexRouter from "./routes/index.router.js";
import realTimeProducts from "./routes/realtimeproducts.router.js";

const app = express();

//HANDLEBARS
//Handlebars Motor
app.engine("handlebars", handlebars.engine());
//Set the path of the views for handlebars
app.set("views", path.join(__dirname, "views"));
//Set the extension of the files
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.use("/", indexRouter);
app.use("/realtimeproducts", realTimeProducts);

app.use("/api", prodRouter, cartsRouter);

app.use((error, req, res, next) => {
  const message = `😥 Unknown error ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
});

export default app;
