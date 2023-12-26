import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
const router = Router();

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ['profile'] })
  );
  
  
  router.get(
    "/auth/google/callback",
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

  export default router;