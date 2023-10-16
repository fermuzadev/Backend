import { Router } from "express";
import { __dirname } from "../utils.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello people 😎!</h1>");
});

export default router;
