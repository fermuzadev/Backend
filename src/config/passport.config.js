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
        console.log(user);
        if (user) {
          throw new Error("User already register");
        }
        const newUser = await userModel.create({
          ...req.body,
          password: createHash(password),
        });
        done(null, newUser);
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
          return done(new Error("Invalid user or password❌"));
        }
        const isValidPass = await isValidPassword(password, user);
        if (!isValidPass) {
          return done(new Error("Invalid user or password❌"));
        }
        done(null, user);
      } catch (error) {
        done(new Error(`Error while User Authenticated  => ${error.message}`));
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (_id, done) => {
    const user = await userModel.findById(_id);
    done(null, user);
  });
};
