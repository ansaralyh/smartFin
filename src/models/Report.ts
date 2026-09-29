import mongoose, { Schema, models, model } from "mongoose";

export interface IReport {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  period: string;
  type: "monthly-summary" | "category-breakdown" | "budget-performance" | "forecast";
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["monthly-summary", "category-breakdown", "budget-performance", "forecast"],
      required: true,
    },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const Report = models.Report ?? model<IReport>("Report", ReportSchema);
