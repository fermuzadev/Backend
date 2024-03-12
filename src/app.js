import express from "express";
import config from "./config/config.js";
import expressSession from "express-session";
import passport from "passport";
import handlebars from "express-handlebars";
import path from "path";
import MongoStore from "connect-mongo";
import { __dirname } from "./utils.js";
import { uploader } from "./utils.js";
import sessionRouter from "./routes/session.router.js";
import authRouter from "./routes/api/auth.router.js";
import prodRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";
// import indexRouter from "./routes/views/index.router.js";
import realTimeRouter from "./routes/realtimeproducts.router.js";
import messagesRouter from "./routes/messages.router.js";
import userRouter from "./routes/api/user.router.js";
// import { UserRouter } from './routes/api/user.router.js'
import { init as initPassportConfig, initJWT } from "./config/passport.config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";


// const User2Router = new UserRouter();
const app = express();

app.use(cookieParser(config.sessionSecret));
app.use(morgan("dev"));


app.use(
  expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.db.mongodbUri,
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
initJWT();

app.use(passport.initialize());
app.use(passport.session());

//!Endpoint middlewares

app.use(
  "/",
  uploader.single("thumbnails"),
  authRouter,
  sessionRouter,
  realTimeRouter,
);
app.use(
  "/api",
  sessionRouter,
  // indexRouter,
  cartsRouter,
  prodRouter,
  messagesRouter,
  userRouter,
  authRouter,
  // User2Router.getRouter()
);

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
})

//!Errorhandler middleware

const middleware = (req, res, next) => {
  const today = new Date();
  const message = `📅${today.toLocaleDateString()} - ⌚${today.toLocaleTimeString()}`;
  console.log(message);
  next();
};
app.use(middleware);
export const errorHandler = (error, req, res, next) => {
  console.error(`Ha ocurrido un error : ${error.message}`);
  console.error(`El stack es ${error.stack}`); //Muestra todo para saber donde esta el error
  if (error instanceof Error) {
    return res.status(401).send(error.message);
  }

  res.status(500).send("Algo se rompio, intente mas tarde");
};

app.use(errorHandler);

export default app;
