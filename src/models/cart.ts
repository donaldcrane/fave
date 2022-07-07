import { Schema, model } from "mongoose";
import { ICart } from "../utils/interface";

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<ICart>('Cart', cartSchema);