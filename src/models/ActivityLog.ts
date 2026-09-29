import mongoose, { Schema, models, model } from "mongoose";

export interface IActivityLog {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const ActivityLog =
  models.ActivityLog ?? model<IActivityLog>("ActivityLog", ActivityLogSchema);
