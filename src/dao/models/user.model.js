import mongoose, { Schema } from "mongoose";

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
    adress: { type: Address, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
