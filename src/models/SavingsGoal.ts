import mongoose, { Schema, models, model } from "mongoose";

export interface ISavingsGoal {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  status: "active" | "completed" | "paused";
  createdAt: Date;
  updatedAt: Date;
}

const SavingsGoalSchema = new Schema<ISavingsGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 0 },
    savedAmount: { type: Number, required: true, min: 0, default: 0 },
    deadline: { type: String },
    status: { type: String, enum: ["active", "completed", "paused"], default: "active" },
  },
  { timestamps: true },
);

export const SavingsGoal =
  models.SavingsGoal ?? model<ISavingsGoal>("SavingsGoal", SavingsGoalSchema);
