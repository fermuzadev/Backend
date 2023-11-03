import mongoose from "mongoose";

//Funcion para arrancar la db
const init = async () => {
  try {
    const URI =
      "mongodb+srv://developer:QMpu2kTgBV8EJH6J@cluster0.ot4ow88.mongodb.net/ecommerce";
    await mongoose.connect(URI);
    console.log("Database connected👽");
  } catch (error) {
    console.error("Error to connect to database🚧", error.message);
  }
};

export default init;
