import mongoose from "mongoose";
const { Schema } = mongoose;

const messagesSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Messages", messagesSchema); //User sera el nombre de la coleccion y en plural lo convertira mongoose

//asi se definen productos , cart , etc
