import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
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

const googleOpts = {
  clientID: process.env.CLIENT_GOOGLE_ID,
  clientSecret: process.env.CLIENT_GOOGLE_SECRET,
  callbackURL: process.env.GOOGLECALLBACK,
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
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email;
          if (profile._json.email) {
            email = profile._json.email;
          } else {
            const githubId = profile.id;
            email = githubId; // Asignar el ID de GitHub como email en caso de no haber email en el perfil.
          }
          let user = await UserModel.findOne({ email });
          if (user) {
            let nameSeparator = profile._json.name.split(" ");
            user = {
              first_name: nameSeparator[0],
              last_name: nameSeparator[1],
              email,
              age: "",
              password: "",
              provider: "Github",
            };
            let newUser = await UserModel.create(user);
            return done(null, newUser);
          }
          let nameSeparator = profile._json.name.split(" ");
          user = {
            first_name: nameSeparator[0],
            last_name: nameSeparator[1],
            email,
            age: "",
            password: "",
            provider: "Github",
          };
          let newUser = await UserModel.create(user); // Asegurarse de usar await aquí
          console.log("newUser", newUser);
          done(null, newUser);
        } catch (error) {
          console.log("Github error passport config", error.message);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      googleOpts,
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email;
          console.log(profile);
          if (profile._json.email) {
            email = profile._json.email;
          } else {
            email = profile.email;
          }
          let user = await UserModel.findOne({ email });
          if (user) {
            user = {
              first_name: profile._json.given_name,
              last_name: profile._json.last_name,
              email,
              age: " ",
              password: "",
              provider: "Google",
            };
            let newUser = await UserModel.create(user);
            return done(null, newUser);
          }
          user = {
            first_name: profile._json.given_name,
            last_name: profile._json.given_name,
            email,
            age: "",
            password: "",
            provider: "Google",
          };
          let newUser = await UserModel.create(user); // Asegurarse de usar await aquí
          done(null, newUser);
        } catch (error) {
          console.log("Google error passport config", error.message);
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

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
}
export const initJWT = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
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
