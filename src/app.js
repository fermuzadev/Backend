import express from "express";
import expressSession from "express-session";
import passport from "passport";
import handlebars from "express-handlebars";
import path from "path";
import MongoStore from "connect-mongo";
import { __dirname } from "./utils.js";
import { uploader } from "./utils.js";
import sessionRouter from "./routes/session.router.js";
import prodRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import indexRouter from "./routes/index.router.js";
import realTimeRouter from "./routes/realtimeproducts.router.js";
import messagesRouter from "./routes/messages.router.js";
import UserRouter from "./routes/user.router.js";
import { init as initPassportConfig } from "./config/passport.config.js";
import morgan from "morgan";
import dotenv from "dotenv";
import usersRouter from "./routes/api/users.router.js";
import businessRouter from "./routes/api/business.router.js";
import ordersRouter from "./routes/api/orders.router.js";

dotenv.config();

const app = express();

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      mongoOptions: {},
      ttl: 120,
    }),
  })
);
//!Express
app.use(express.json()); //Middleware incorporado
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("dev"));
//!Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//!App middleware
//!Passport
initPassportConfig();

app.use(passport.initialize());
app.use(passport.session());

//!Endpoint middlewares

app.use(
  "/",
  uploader.single("thumbnails"),
  sessionRouter,
  UserRouter,
  realTimeRouter
);
app.use(
  "/api",
  sessionRouter,
  indexRouter,
  cartsRouter,
  prodRouter,
  messagesRouter,
  UserRouter
);

app.use("/api/users", usersRouter);
app.use("/api/business", businessRouter);
app.use("/api/orders", ordersRouter);

//!Errorhandler middleware

const middleware = (req, res, next) => {
  const today = new Date();
  const message = `📅${today.toLocaleDateString()} - ⌚${today.toLocaleTimeString()}`;
  console.log(message);
  next();
};
app.use(middleware);
app.use((error, req, res, next) => {
  if (error instanceof Exception) {
    return res
      .status(error.status)
      .json({ status: "error", message: "error.message" });
  }
  res.status(500).send("Algo se rompio, intente mas tarde");
});

export default app;
