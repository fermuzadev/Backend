import mongoose from "mongoose";
import config from "../config/config.js";
import dotenv from 'dotenv'
const init = async () => {
  try {
    const URI = process.env.MONGODB_URI;
    await mongoose.connect(URI);
    console.log("Database connected👽");
  } catch (error) {
    console.error("Error to connect to database🚧", error.message);
  }
};

export default init;
