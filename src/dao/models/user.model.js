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
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    provider: { type: String, enum: ["Github", "Google", "Register"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    adress: { type: Address, default: {} },
    rol: { type: String, default: "user", enum: ["user", "admin"] },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);

