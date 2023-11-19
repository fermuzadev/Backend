import { Router } from "express";

const router = Router();

router.get("/profile", (req, res) => {
  res.status(200).render("profile", { title: "User profile" });
});

router.get("/register", (req, res) => {
  res.status(200).render("register", { title: "User register" });
});

router.get("/login", (req, res) => {
  res.status(200).render("login", { title: "User login" });
});
export default router;
