import mongoose, { Schema, models, model } from "mongoose";

export interface IBudget {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true, min: 0 },
    spent: { type: Number, required: true, min: 0, default: 0 },
    period: { type: String, enum: ["monthly", "weekly", "yearly"], default: "monthly" },
    startDate: { type: String, required: true },
  },
  { timestamps: true },
);

export const Budget = models.Budget ?? model<IBudget>("Budget", BudgetSchema);
