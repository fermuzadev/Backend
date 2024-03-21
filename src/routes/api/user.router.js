import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import passport from 'passport'
import {
  __dirname,
  createHash,
  verifyToken,
  isValidPassword,
  jwtAuth,
  tokenGenerator,
  authorizationMiddleware,
  authenticationMiddleware
} from "../../utils.js";
import EmailController from "../../controllers/email.controller.js";
// import RouterBase from '../RouterBase.js'

const router = Router();


// export class UserRouter extends RouterBase {
//   init() {
//     this.get('/test', ['PUBLIC'], function (req, res) {
//       res.sendSuccess('Hello Coders 👍🏿')
//     });

//   }
// }

const privateRouter = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

const publicRouter = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/realtimeproducts");
  }
  next();
};

router.post("/loginjwt", async (req, res) => {
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
    .json({ status: "success" });
});

router.get("/current", authenticationMiddleware("jwt", { session: false }), async (req, res) => {

  let filterData = await UsersController.getDtoData(req.user);
  res.status(200).json(filterData);
});


router.get("/profile", privateRouter, (req, res) => {
  res.render("profile", { title: "User profile", user: req.session.user });
});
router.get("/login", publicRouter, (req, res) => {
  res.render("login", { title: "User login" });
});

router.get("/register", publicRouter, async (req, res) => {
  res.render("register", { title: "User register" });
});

router.get("/", publicRouter, (req, res) => {
  res.render("register", { title: "User register" });
});

router.get("/recovery-password", publicRouter, (req, res) => {
  res.render("recovery-password", { title: "Password Recover" });
});

router.get("/user", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
  try {
    const users = await UsersController.get();
    let response = [];
    for (const user of users) {
      const dtoData = await UsersController.getDtoData(user);
      response.push(dtoData);
    }
    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

router.post("/user", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
  try {
    const { body } = req;
    const user = await UsersController.create(body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/:uid", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await UsersController.getById(uid)
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/user/:uid", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
  const { uid } = req.params;
  const { body } = req;
  await UsersController.updateById(uid, body)
  res.status(204).end();
});

router.delete("/user/:uid", passport.authenticate('jwt', { session: false }), authorizationMiddleware("admin"), async (req, res) => {
  const { uid } = req.params;
  try {
    const deleted = await UsersController.deleteById(uid)
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    } else {
      return res.status(204).end();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/user", async (req, res) => {
  try {
    const users = await UsersController.get();
    const twoDays = 2 * 24 * 60 * 60 * 1000;
    const usersFilter = users.filter((user) => Date.now() - user.last_time >= twoDays)
    for (const user of usersFilter) {
      await EmailController.sendInactivityEmail(user);
      await UsersController.deleteById(user._id);
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;
