import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    order: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Orders",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
