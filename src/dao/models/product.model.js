import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: true, enum: [true, false] },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
