import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userService from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const opts = {
  userNameField: "email",
  passReqToCallback: true,
};

export const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (user) {
          return done(new Error("User already register"));
        }
        const newUser = await userModel.create({
          ...req.body,
          password: createHash(password),
        });
        return done(null, newUser);
      } catch (error) {
        return done(
          new Error(`Error while User Authenticated  => ${error.message}`)
        );
      }
    })
  );
};

export default init;
