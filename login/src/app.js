import express from "express";
import expressSession from "express-session";
import FileStore from "session-file-store";
import handlebars from "express-handlebars";
import path from "path";
import dotenv from "dotenv";
import indexRouter from "./routers/index.router.js";
import { __dirname } from "./utils.js";
dotenv.config();
const SESSION_SECRET = process.env.SESSION_SECRET;
const app = express();

const SessionFS = FileStore(expressSession);
app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SessionFS({
      path: path.join(__dirname, "session"),
      ttl: 100,
      retries: 0,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/", indexRouter);
app.use((error, req, res, next) => {
  const message = `Ha ocurrido un error : ${error.message}`;
  res.status(500).json({ status: "error", message });
});
export default app;
