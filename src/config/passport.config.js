import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import userService from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import { register } from "module";

const opts = {
  userNameField: "email",
  passReqToCallback: true,
};

const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req, email, password, done) => {
        


    })
  );
};
