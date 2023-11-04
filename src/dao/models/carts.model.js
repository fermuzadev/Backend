import mongoose from "mongoose";
const { Schema } = mongoose;

const Products = new Schema(
  [
    {
      productId: { type: String },
      quantity: { type: Number },
    },
  ],
  { _id: false }
);
const cartSchema = new mongoose.Schema(
  {
    products: { type: Products, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Carts", cartSchema);
