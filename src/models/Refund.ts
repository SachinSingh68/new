import mongoose, { Schema, model, models } from "mongoose";

const statusHistoryEntry = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const refundSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    statusHistory: { type: [statusHistoryEntry], default: [] },
  },
  { timestamps: true },
);

const Refund = models.Refund || model("Refund", refundSchema);
export default Refund as mongoose.Model<{
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  mediatorId: mongoose.Types.ObjectId;
  reason: string;
  amount: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  statusHistory: { status: string; at: Date; actorId?: mongoose.Types.ObjectId }[];
  createdAt: Date;
}>;
