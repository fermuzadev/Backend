import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routers/users.router.js";
import petsRouter from "./routers/pets.router.js";
import morgan from "morgan";

const PORT = 8080;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
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

app.get("/demo", middleware, (req, res) => {
  //throw new Error("Error de prueba"); //Para ver el handlerError
  res.send("Esta es una prueba");
});

app.get("/", (req, res) => {
  res.send("<h1>Hello people!❤️</h1>");
});

app.use("/api", userRouter, petsRouter);

//Errorhandler middleware

const errorHandler = (error, req, res, next) => {
  console.error(`Ha ocurrido un error : ${error.message}`);
  console.error(`El stack es ${error.stack}`); //Muestra todo para saber donde esta el error
  res.status(500).send("Algo se rompio, intente mas tarde");
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
