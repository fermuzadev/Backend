import { Router } from "express";
import bcrypt from "bcrypt";
import UserModel from "../dao/models/user.model.js";
import {
  __dirname,
  createHash,
  isValidPassword,
  jwtAuth,
  tokenGenerator,
} from "../utils.js";

const router = Router();

const privateRouter = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

const publicRouter = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  next();
};

router.post("/loginjwt", async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Correo o contraseña invalidos" });
  }
  if (!isValidPassword) {
    const isValidPassword = isValidPassword(password, user);
    return res.status(401).json({ message: "Correo o contraseña invalidos" });
  }
  const token = tokenGenerator(user);
  res.status(200).json({ access_token: token });
});

router.get("/current", jwtAuth, (req, res) => {
  res.status(200).json(req.user);
});
router.get("/profile", privateRouter, (req, res) => {
  res.render("profile", { title: "User profile", user: req.session.user });
});
router.get("/login", publicRouter, (req, res) => {
  res.render("login", { title: "User login" });
});

router.get("/register", publicRouter, (req, res) => {
  res.render("register", { title: "User register" });
});

router.get("/", publicRouter, (req, res) => {
  res.render("register", { title: "User register" });
});

router.get("/recovery-password", publicRouter, (req, res) => {
  res.render("recovery-password", { title: "Password Recover" });
});

router.get("/user", async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

router.post("/user", async (req, res) => {
  try {
    const { body } = req;
    const user = await UserModel.create(body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await UserModel.findById(uid);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  const { body } = req;
  const result = await UserModel.updateOne({ _id: uid }, { $set: body });
  res.status(204).end();
});

router.delete("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const deleted = await UserModel.deleteOne({ _id: uid });
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    } else {
      return res.status(204).end();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
