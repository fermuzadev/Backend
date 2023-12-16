import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GithubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import UserModel from "../dao/models/user.model.js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const opts = {
  usernameField: "email",
  passReqToCallback: true,
};

const githubOpts = {
  clientID: process.env.GHCLIENTID,
  clientSecret: process.env.GHCLIENTSECRET,
  callbackURL: process.env.GHCALLBACK,
};

export const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (user) {
          return done(new Error("User already register"));
        }
        const newUser = await UserModel.create({
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

  passport.use(
    "login",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(new Error("Invalid user or password❌"));
        }
        const isValidPass = isValidPassword(password, user);
        if (!isValidPass) {
          return done(new Error("Invalid user or password❌"));
        }
        done(null, user);
      } catch (error) {
        return done(
          new Error(`Error while User Authenticated  => ${error.message}`)
        );
      }
    })
  );

  passport.use(
    "github",
    new GithubStrategy(
      githubOpts,
      async (accessToken, refreshToken, profile, done, next) => {
        try {
          let email = profile._json.email;
          let user = await UserModel.findOne({ email });
          if (user) {
            return done(null, user);
          }
          let nameSeparator = profile._json.name;
          user = {
            first_name: nameSeparator[0],
            last_name: nameSeparator[1],
            email: profile._json.email,
            age: 32,
            password: "",
            provider: "GitHub",
          };
          const newUser = UserModel.create(user);
          console.log("newUser", newUser);
          done(null, newUser);
        } catch (error) {
          console.log("Github error passport config", error.message);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (_id, done) => {
    const user = await UserModel.findById(_id);
    done(null, user);
  });
};
