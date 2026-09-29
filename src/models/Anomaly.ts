import mongoose, { Schema, models, model } from "mongoose";

export interface IAnomaly {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  transactionId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  expectedRange: { min: number; max: number };
  severity: "low" | "medium" | "high";
  detectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnomalySchema = new Schema<IAnomaly>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    expectedRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    detectedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Anomaly = models.Anomaly ?? model<IAnomaly>("Anomaly", AnomalySchema);
