import { Router } from "express";
import { __dirname } from "../utils.js";

import messagesModel from "../dao/models/messages.model.js";

const router = Router();

router.get("/messages", async (req, res) => {
  const messages = await messagesModel.find();
  res.status(200).json(messages);
});

export default router;
