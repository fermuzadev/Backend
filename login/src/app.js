import express from "express";
import expressSession from "express-session";
import sessionFS from "session-file-store";
import handlebars from "express-handlebars";
import path from "path";

import indexRouter from "./routers/index.router.js";
import { __dirname } from "./utils.js";

const app = express();

const SESSION_SECRET = "s2NWk`sljg]H!f20gG6~WS>PRam[t";
app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new sessionFS({
      path: "./session", //path
      ttl: 100, //segundos
      retries: 0, //reintentos
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
