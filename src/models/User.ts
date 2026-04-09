import mongoose, { Schema, model, models } from "mongoose";

export type Role = "buyer" | "mediator" | "admin";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["buyer", "mediator", "admin"],
      default: "buyer",
      required: true,
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", userSchema);
export default User as mongoose.Model<{
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
}>;
