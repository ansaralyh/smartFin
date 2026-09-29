import mongoose, { Schema, models, model } from "mongoose";

export interface IRecurringTransaction {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDueDate: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringTransactionSchema = new Schema<IRecurringTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: "monthly" },
    nextDueDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const RecurringTransaction =
  models.RecurringTransaction ??
  model<IRecurringTransaction>("RecurringTransaction", RecurringTransactionSchema);
