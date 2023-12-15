import mongoose from "mongoose";
import config from "../config/config.js";

//!Function for init database
export const init = async () => {
  try {
    const URI = config.mongodbUri;
    await mongoose.connect(URI);
    console.log("Database connected👽");
  } catch (error) {
    console.error("Error to connect to database🚧", error.message);
  }
};

export default init;
