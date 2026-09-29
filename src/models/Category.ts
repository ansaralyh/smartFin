import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  type: "income" | "expense" | "both";
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["income", "expense", "both"], default: "both" },
    color: { type: String, trim: true },
  },
  { timestamps: true },
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = models.Category ?? model<ICategory>("Category", CategorySchema);
