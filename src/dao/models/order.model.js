import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    code: Number,
    business: {
      type: mongoose.Schema.ObjectId,
      ref: "Business",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    products: [],
    total: Number,
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", " cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", orderSchema);
