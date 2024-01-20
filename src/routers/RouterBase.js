import { Router } from "express";

export default class RouterBase {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }
  init() {}

  get(path, policies, ...callback) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponse,
      this.applyCallbacks(callback)
    );
  }

  post(path, policies, ...callback) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponse,
      this.applyCallbacks(callback)
    );
  }

  put(path, policies, ...callback) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponse,
      this.applyCallbacks(callback)
    );
  }

  delete(path, policies, ...callback) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomeResponse,
      this.applyCallbacks(callback)
    );
  }

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => {
      return async (...params) => {
        try {
          await cb.apply(this, params);
        } catch (error) {
          console.error("Ha ocurrido un error 😥", error.message);
          //params[0] => req
          //params[1] => res
          //params[2] => next
          params[1].status(500).json({ message: error.message });
        }
      };
    });
  }
  generateCustomeResponse(req, res, next) {
    res.sendSuccess = (payload) => {
      res.status(200).json({ success: true, payload });
    };
    res.sendServerError = (error) => {
      res.status(500).json({ success: false, error });
    };
    res.sendUserError = (error) => {
      res.status(400).json({ success: false, error });
    };
    res.sendNotFoundError = (error) => {
      res.status(404).json({ success: false, error });
    };
    next();
  }

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") {
      return next();
    }
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: "unauthorized" });
    }

    //BEARE y el token
    const token = authorizationHeader.split(" ")[1];
    //admin
    //user
    //premium
    if (!policies.includes(token.toUpperCase())) {
      return res.status(403).json({ message: "unauthorized" });
    } else {
    }
  };
}
