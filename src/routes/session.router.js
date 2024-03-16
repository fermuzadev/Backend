import { Router } from "express";
import passport from "passport";
import UsersController from "../controllers/users.controller.js";
import { createHash, isValidPassword, tokenGenerator } from "../utils.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/api/login");
  }
);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    const {
      body: { email, password },
    } = req;
    let user = await UsersController.get({ email });
    user = user[0]
    if (!user) {
      return res.status(401).json({ message: "Email or password not valid" });
    }
    const isValidPass = isValidPassword(password, user)
    if (!isValidPass) {
      return res.status(401).json({ message: "Email or password not valid" });
    }
    const token = tokenGenerator(user);
    res
      .cookie("access_token", token, { maxAge: 300000, httpOnly: true })
      .status(200)
      .redirect("/realtimeproducts");
  }
);

router.post("/login", async (req, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    let user = await UsersController.get({ email });
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      let user = {
        first_name: "Coderhouse",
        last_name: "Administrator",
        email: "adminCoder@coder.com",
        age: 9,
        password: "adminCod3r123",
        rol: "admin",
      };
      const { first_name, last_name, rol } = user;
      req.session.user = { first_name, last_name, email, rol, carts };
      res.redirect("/realtimeproducts");
      return;
    } else {
      if (user) {
        const isValidPass = await isValidPassword(password, user);
        if (!isValidPass) {
          return res.status(401).send("User or password wrong");
        }
        const { first_name, last_name, rol } = user;
        req.session.user = { first_name, last_name, email, rol };
        res.redirect("/realtimeproducts");
        return;
      }
      return res.status(401).send("User or password wrong");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);


router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/login",
  }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      res.redirect("/realtimeproducts");
      return;
    } catch (error) {
      console.log("Github error session router", error.message);
    }
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ['profile'] })
);



router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      res.redirect("/realtimeproducts");
      return;
    } catch (error) {
      console.log("Google error session router", error.message);
    }
  }
);

router.post("/recovery-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await UsersController.get({ email });
  if (!user) {
    return res.status(401).send("User not found");
  }
  await UsersController.update(
    { email },
    { password: createHash(newPassword) }
  );
  res.redirect("/api/login");
});
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/api/login");
  });
});
export default router;
