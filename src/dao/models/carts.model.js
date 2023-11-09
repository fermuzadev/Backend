import mongoose from "mongoose";
const { Schema } = mongoose;

const Products = new Schema(
  [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: { type: Number },
    },
  ],
  { _id: false }
);
const cartSchema = new mongoose.Schema(
  {
    products: { type: [Products], default: [] },
  },
  { timestamps: true }
);

cartSchema.pre("find", function () {
  this.populate("products.productId");
});

cartSchema.pre("save", function () {}); // Validation
export default mongoose.model("Carts", cartSchema);
