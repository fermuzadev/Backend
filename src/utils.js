import { fileURLToPath } from "url";
import path from "path";
import jwt from 'jsonwebtoken'
import bcrypt, { compare } from "bcrypt";
import fs from "fs/promises";
import multer from "multer";
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

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

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);


  export const tokenGenerator = (user) => {
    const { _id,first_name, last_name, email } = user;
    const payload = {
      id : _id,
      first_name,
      last_name,
      email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1m'});
    return token;
  }

  export const jwtAuth = (req,res, next) => {
    const {authorization : token} = req.headers;
    if(!token) {
      return res.status(401).json({message: 'Unauthorized'})
    }
    jwt.verify(token , JWT_SECRET, (error, payload) => {
      if(error) {
        return res.status(403).json({message: 'No authorized'})
      }
      
    }) 
  }
