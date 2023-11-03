import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

//Funcion para arrancar la db
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
