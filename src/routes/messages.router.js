import { Router } from "express";
import { __dirname } from "../utils.js";

import messagesModel from "../dao/models/messages.model.js";

const messagesRouter = Router();

messagesRouter.get("/messages", async (req, res) => {
  const messages = await messagesModel.find();
  res.status(200).render("chat");
});

messagesRouter.post("/messages", async (req, res) => {
  await emitFromAPI("new-message-from-api", {
    username: "api",
    text: "Hola desde la API 😍",
  });
  res.status(200).json({
    ok: true,
  });
});

export default messagesRouter;
