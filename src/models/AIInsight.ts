import mongoose, { Schema, models, model } from "mongoose";

export interface IAIInsight {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "pattern" | "recommendation" | "warning";
  title: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIInsightSchema = new Schema<IAIInsight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["pattern", "recommendation", "warning"], required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const AIInsight =
  models.AIInsight ?? model<IAIInsight>("AIInsight", AIInsightSchema);
