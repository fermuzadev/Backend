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
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    dni: {type:String, required:true, unique:true, index:true,default: "active"},
    provider: { type: String, enum: ["Github", "Google", "Register"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    adress: { type: Address, default: {} },
    role: { type: String, default: "user", enum: ["user","seller", "admin"] },
    cart: { type: Schema.Types.ObjectId, ref: "Carts" },
  },
  { timestamps: true }
);

userSchema.plugin(paginator);
export default mongoose.model("users", userSchema);

