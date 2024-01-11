import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import {
  __dirname,
  verifyToken,
  isValidPassword,
  tokenGenerator,
  authMiddleware,
  createHash,
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

router.post("/auth/login", async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password not valid" });
  }
  const isValidPass = isValidPassword(password, user);
  if (!isValidPass) {
    return res.status(401).json({ message: "Email or password not valid" });
  }
  const token = tokenGenerator(user);
  res
    .cookie("access_token", token, { maxAge: 60000, httpOnly: true })
    .status(200)
    .json({ status: "success" });
});

router.get(
  "/current",
  authMiddleware("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

router.get("/profile", privateRouter, (req, res) => {
  res
    .status(200)
    .render("profile", { title: "User profile", user: req.session.user });
});

router.get("/register", publicRouter, (req, res) => {
  res.status(200).render("register", { title: "User register" });
});

router.get("/", publicRouter, (req, res) => {
  res.status(200).render("register", { title: "User register" });
});

router.get("/login", publicRouter, (req, res) => {
  res.status(200).render("login", { title: "User login" });
});

router.get("/user", async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

router.post("/user", async (req, res) => {
  try {
    let { body } = req;
    let { password } = req.body;
    password = createHash(password);
    let user = await UserModel.create({ ...body, password });
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
