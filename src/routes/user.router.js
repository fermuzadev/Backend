import { Router } from "express";
import { __dirname } from "../utils.js";

import UserModel from "../models/user.model.js";

const router = Router();
router.get("/users", async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

export default router;
