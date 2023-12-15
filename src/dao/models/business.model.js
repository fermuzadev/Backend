import mongoose, { Schema } from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    products: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Business", businessSchema);
