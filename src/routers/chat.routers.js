import { Router } from "express";
import { emitFromAPI } from "../socket.js";
const chatRouter = Router();

chatRouter.get("/", (req, res) => {
  res.render("chat");
});

chatRouter.post("/messages", (req, res) => {
  emitFromAPI("new-message-from-api", {
    username: "api",
    text: "Hola desde la API 😍",
  });
  res.status(200).json({
    ok: true,
  });
});

export default chatRouter;
