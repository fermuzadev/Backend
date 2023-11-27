import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";

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
          console.log("estoy aca");
        }
        const newUser = await userModel.create({
          ...req.body,
          password: createHash(password),
        });
        done(null, newUser);
        console.log("estoy aca 2");
      } catch (error) {
        done(new Error(`Error while User Authenticated  => ${error.message}`));
      }
    })
  );
  passport.use(
    "login",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return done(new Error("Email or password invalid"));
        }
        const isValidPass = isValidPassword(password, user);
        if (!isValidPass) {
          return done(new Error("Email or password not valid"));
        }
        console.log("Here");
        done(null, user);
      } catch (error) {
        done(new Error(`Error while user authenticated ${error.message}`));
      }
    })
  );
};
