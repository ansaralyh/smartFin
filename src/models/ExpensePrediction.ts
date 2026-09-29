import mongoose, { Schema, models, model } from "mongoose";

export interface IExpensePrediction {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  predictedAmount: number;
  category?: string;
  period: string;
  modelUsed: string;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExpensePredictionSchema = new Schema<IExpensePrediction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    predictedAmount: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
    period: { type: String, required: true, trim: true },
    modelUsed: { type: String, required: true, trim: true },
    confidence: { type: Number, min: 0, max: 1 },
  },
  { timestamps: true },
);

export const ExpensePrediction =
  models.ExpensePrediction ??
  model<IExpensePrediction>("ExpensePrediction", ExpensePredictionSchema);
