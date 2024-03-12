import { Router } from "express";
import MessagesController from "../controllers/messages.controller.js";
import { authorizationMiddleware } from "../utils.js";

const messagesRouter = Router();

messagesRouter.get("/messages", authorizationMiddleware("user"), async (req, res, next) => {
  try {
    const messages = await MessagesController.get();
    res.status(200).render("chat", messages);
  } catch (error) {
    console.log('An error has ocurred while trying to get messages', error.message)
    next(error)
  }
});

export default messagesRouter;
