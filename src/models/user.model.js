import mongoose, { Schema } from "mongoose";
//adress es subesquema
const Address = new Schema(
  {
    street: { type: String },
    city: { type: String },
    country: { type: String },
  },
  { _id: false }
);
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    edad: { type: Number, required: true },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    adress: { type: Address, default: {} }, //type puede ser Array o [] lo reconoce igual
  },
  { timestamps: true }
);
//Como va a ser nuestros usuarios se le pasa al constructor
//el timestamps va a crear fecha de update y creacion

export default mongoose.model("User", userSchema); //User sera el nombre de la coleccion y en plural lo convertira mongoose

//asi se definen productos , cart , etc
