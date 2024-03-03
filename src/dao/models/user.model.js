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
const Carts = new Schema(
  [
    {
      cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
    },
  ], { _id: false }
)
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    dni: { type: String, required: true, unique: true, index: true, default: `${Math.random() * 10000}` },
    provider: { type: String, default: "Register", enum: ["Github", "Google", "Register", "Postman"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    adress: { type: Address, default: {} },
    role: { type: String, default: "user", enum: ["user", "seller", "admin"] },
    carts: { type: [Carts], default: [] },
  },
  { timestamps: true }

);

userSchema.pre("find", function () {
  this.populate("carts.cartId");
});

userSchema.plugin(paginator);
export default mongoose.model("users", userSchema);

