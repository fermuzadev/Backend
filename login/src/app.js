import express from "express";
import expressSession from "express-session";
import handlebars from "express-handlebars";
import path from "path";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import sessionRouter from "./routers/session.router.js";
import userRouter from "./routers/index.router.js";
import { __dirname } from "./utils.js";
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
      ttl: 20, //por defecto tiene 14 dias
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/", userRouter, sessionRouter);
app.use((error, req, res, next) => {
  const message = `Ha ocurrido un error : ${error.message}`;
  res.status(500).json({ status: "error", message });
});
export default app;
