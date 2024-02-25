import mongoose, { Schema } from "mongoose";
import paginator from 'mongoose-paginate-v2'

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
    first_name: { type: String, required: true },
    last_name: { type: String },
    dni: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    adress: { type: Address, default: {} },
    role: { type: String, default: "student", enum: ["student", "professor", "admin"] },
  },
  { timestamps: true }
);
userSchema.plugin(paginator);
export default mongoose.model("User", userSchema);
