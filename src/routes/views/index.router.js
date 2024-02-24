//!FS
//!import ProductManager from "../dao/ProductManager.js";
//! import path from "path";
//!const prodPath = path.resolve(__dirname, "./dao/productos.json");
//! const productManager = new ProductManager(prodPath);

import { Router } from "express";
import UserModel from "../../dao/models/user.model.js";
import passport from "passport";
import {
  __dirname,
  verifyToken,
  isValidPassword,
  tokenGenerator,
  authenticationMiddleware,
  authorizationMiddleware,
  createHash,
} from "../../utils.js";

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
  res.render("recovery-password", { title: "Password Recover" })
});

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
    .cookie("access_token", token, { maxAge: 30000, httpOnly: true })
    .status(200)
    .json({ status: "success" });
});

router.get(
  "/current",
  authenticationMiddleware("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

router.get('/admin', authenticationMiddleware('jwt'), authorizationMiddleware('admin'), (req, res) => {
  res.status(200).json({ success: true });
})

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

router.get("/user", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
});

router.post("/user", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { body } = req;
    let { password } = req.body;
    password = createHash(password);
    let user = await UserModel.create({ ...body, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/:uid", passport.authenticate('jwt', { session: false }), async (req, res) => {
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

router.put("/user/:uid", passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { uid } = req.params;
  const { body } = req;
  const result = await UserModel.updateOne({ _id: uid }, { $set: body });
  res.status(204).end();
});

router.delete("/user/:uid", passport.authenticate('jwt', { session: false }), async (req, res) => {
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

export default router
