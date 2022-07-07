import { Schema, model } from "mongoose";
import { IProduct } from "../utils/interface";

const productSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    price: { type: Number, required: true},
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text"
});

export default model<IProduct>('Product', productSchema);