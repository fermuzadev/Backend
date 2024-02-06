import { Router } from "express";
import passport from "passport";
import UserModel from "../../dao/models/user.model.js";
import { createHash, isValidPassword } from "../../utils.js";
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

  router.post('/auth/register', async(req, res) => {
    const {
      first_name,
      last_name,
      dni,
      email,
      password
    } = req.body;
    if (!first_name || !last_name || !dni || !email || !password) {
      return res.status(400).json({message: "Missing fields"})
  }
  let user = await UserModel.findOne({email});
  if (user)
{
  return res.status(409).json({message: "User already exists."})
}
  user = await UserModel.create({
      first_name,
      last_name,
      dni,
      email,
      password: createHash(password)
  })

  res.status(201).json({message: 'User successfully created'})

  })

  export default router;