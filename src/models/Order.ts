import mongoose, { Schema, model, models } from "mongoose";

const statusHistoryEntry = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    address: { type: String, required: true, trim: true },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    statusHistory: { type: [statusHistoryEntry], default: [] },
  },
  { timestamps: true },
);

const Order = models.Order || model("Order", orderSchema);
export default Order as mongoose.Model<{
  _id: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  mediatorId: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  product: string;
  quantity: number;
  address: string;
  notes: string;
  status: "pending" | "completed";
  statusHistory: { status: string; at: Date; actorId?: mongoose.Types.ObjectId }[];
  createdAt: Date;
}>;
