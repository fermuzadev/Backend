import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter += 1;
  } else {
    req.session.counter = 1;
  }
  req.session.message = "Nuevo usuario";
  res.status(200).render("index", { title: "Socket.io " });
});

export default router;
