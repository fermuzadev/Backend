import { fileURLToPath } from "url";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import multer from "multer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export const tokenGenerator = (user) => {
  const { _id, first_name, last_name, email } = user;

  const payload = {
    id: _id,
    first_name,
    last_name,
    email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m" });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_TOKEN, (error, payload) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};

export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, user, info) {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message ? info.message : info.toString() });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderPath = path.join(__dirname, "../public/img");
    console.log("Destination folder", folderPath);
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log("filename", filename);
    callback(null, filename);
  },
});
export const uploader = multer({ storage });

export const getRandomId = (array) => {
  let numId = parseInt(Math.random() * (10000 - 1) + 1);
  if (numId === array.id) {
    numId = parseInt(Math.random() * (10000 - 1) + 1);
  } else {
    return numId;
  }
};

export const existFile = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export const getJSONFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  } else {
    let content;
    try {
      content = await fs.readFile(path, "utf-8");
    } catch (error) {
      throw new Error(`The file ${path} could not be read`);
    }
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`The file ${path} hasn't a JSON format`);
    }
  }
};

export const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  try {
    await fs.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error(`The file ${path} couldn't be write`);
  }
};

export class Exception extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
}
