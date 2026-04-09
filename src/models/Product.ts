import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product = models.Product || model("Product", productSchema);
export default Product as mongoose.Model<{
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  isActive: boolean;
}>;
