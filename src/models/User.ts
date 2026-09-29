import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  currency: string;
  phone?: string;
  monthlyIncome?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    currency: { type: String, default: "PKR" },
    phone: { type: String, trim: true },
    monthlyIncome: { type: Number, min: 0 },
  },
  { timestamps: true },
);

export const User = models.User ?? model<IUser>("User", UserSchema);
