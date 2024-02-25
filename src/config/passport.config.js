import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
import dotenv from 'dotenv'

dotenv.config();

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
        return done(
          new Error(`Error while User Authenticated  => ${error.message}`)
        );
      }
    })
  );
};

function cookieExtractor(req) {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies["access_token"];
  }
  return token;
}
export const initJWT = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      (payload, done) => {
        return done(null, payload);
      }
    )
  );
};
