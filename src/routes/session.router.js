import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
const router = Router();

router.post("/session/register", async (req, res) => {
  const { body } = req;
  try {
    if (!body) {
      res.status(404).send("No data or one field wrong");
      return;
    } else {
      const newUser = await UserModel.create(body);
      res.status(200).redirect("./login");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/session/login", async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const userFound = await UserModel.findOne({ email });
  try {
    if (!body || !userFound) {
      return res.status(401).send("User or password wrong");
    }
    if (!user) {
      return res.status(401).send("User or password wrong");
    }
    const isValidPass = user.password === password;
    if (!isValidPass) {
      return res.status(401).send("User or password wrong");
    }
    const { first_name, last_name, email } = user;
    req.session.user = { first_name, last_name, email };
    res.status(200).redirect("/profile");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
