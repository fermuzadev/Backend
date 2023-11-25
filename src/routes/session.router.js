import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
const router = Router();

router.post("/session/register", async (req, res) => {
  const { body } = req;
  try {
    if (!body) {
      res.status(404).send("No data or one field wrong");
      return;
    } else {
      const newUser = await UserModel.create({
        ...body,
        password: createHash(body.password),
      });
      res.status(200).redirect("/login");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/session/login", async (req, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      //HARDCODEO
      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        user = {
          first_name: "Coderhouse",
          last_name: "Administrator",
          email: "adminCoder@coder.com",
          age: 9,
          password: "adminCod3r123",
          rol: "admin",
        };
        const { first_name, last_name, rol } = user;
        req.session.user = { first_name, last_name, email, rol };
        res.redirect("/api/realtimeproducts");
        return;
      } else {
        return res.status(401).send("User or password wrong");
      }
    }
    const isValidPass = await isValidPassword(password, user);
    if (!isValidPass) {
      return res.status(401).send("User or password wrong");
    }
    const { first_name, last_name, rol } = user;
    req.session.user = { first_name, last_name, email, rol };
    res.redirect("/api/realtimeproducts");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post("/session/recovery-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send("User not found");
  }
  await userModel.updateOne(
    { email },
    { $set: { password: createHash(newPassword) } }
  );
  res.redirect("/login");
});
router.get("/session/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});
export default router;
