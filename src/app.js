import express from "express";
import expressSession from "express-session";
import sessionFS from "session-file-store";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { uploader } from "./utils.js";
import prodRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import indexRouter from "./routes/index.router.js";
import messagesRouter from "./routes/messages.router.js";
import userRouter from "./routes/user.router.js";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const SESSION_SECRET = process.env.SESSION_SECRET;
app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new sessionFS({
      path: "./session",
      ttl: 100,
      retries: 0,
    }),
  })
);

app.use(express.json()); //Middleware incorporado
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("dev"));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

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
app.use(
  "/api",
  uploader.single("thumbnails"),
  userRouter,
  cartsRouter,
  prodRouter,
  messagesRouter
);

//Errorhandler middleware

const errorHandler = (error, req, res, next) => {
  console.error(`Ha ocurrido un error : ${error.message}`);
  console.error(`El stack es ${error.stack}`); //Muestra todo para saber donde esta el error
  res.status(500).send("Algo se rompio, intente mas tarde");
};

app.use(errorHandler);

export default app;
