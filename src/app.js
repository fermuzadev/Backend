import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { fileURLToPath } from "url";
import prodRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import indexRouter from "./routes/index.router.js";
import realTimeProducts from "./routes/realtimeproducts.router.js";
import userRouter from "./routes/user.router.js";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.json()); //Middleware incorporado
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));

//App middleware
const middleware = (req, res, next) => {
  const today = new Date();
  const message = `📅${today.toLocaleDateString()} - ⌚${today.toLocaleTimeString()}`;
  console.log(message);
  next();
};

app.use(middleware);

//Endpoint middlewares

app.use("/", indexRouter);
app.use("/realtimeproducts", realTimeProducts);
app.use("/api", userRouter, cartsRouter, prodRouter);

//Errorhandler middleware

const errorHandler = (error, req, res, next) => {
  console.error(`Ha ocurrido un error : ${error.message}`);
  console.error(`El stack es ${error.stack}`); //Muestra todo para saber donde esta el error
  res.status(500).send("Algo se rompio, intente mas tarde");
};

app.use(errorHandler);

export default app;
