import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).render("index", { title: "Socket.io " });
});

export default router;
