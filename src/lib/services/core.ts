import { connectDB } from "@/lib/db";
import { ActivityLog } from "@/models/ActivityLog";
import { Budget } from "@/models/Budget";
import { Notification } from "@/models/Notification";
import { Transaction } from "@/models/Transaction";
import mongoose from "mongoose";

export function userObjectId(userId: string) {
  return new mongoose.Types.ObjectId(userId);
}

export function currentMonthPrefix() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(dateStr: string) {
  return new Date(`${dateStr}-01`).toLocaleString("en-US", { month: "short" });
}

export async function logActivity(action: string, details: string, userId?: string) {
  await connectDB();
  await ActivityLog.create({
    userId: userId ? userObjectId(userId) : undefined,
    action,
    details,
  });
}

export async function syncBudgetSpent(userId: string) {
  await connectDB();
  const oid = userObjectId(userId);
  const month = currentMonthPrefix();
  const budgets = await Budget.find({ userId: oid });
  const expenses = await Transaction.find({
    userId: oid,
    type: "expense",
    date: { $regex: `^${month}` },
  });

  const totals = new Map<string, number>();
  for (const tx of expenses) {
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }

  for (const budget of budgets) {
    budget.spent = totals.get(budget.category) ?? 0;
    await budget.save();

    if (budget.spent > budget.limit) {
      const over = budget.spent - budget.limit;
      await Notification.findOneAndUpdate(
        { userId: oid, sourceId: `budget-${budget.category.toLowerCase()}` },
        {
          userId: oid,
          sourceId: `budget-${budget.category.toLowerCase()}`,
          title: "Budget Alert",
          message: `${budget.category} budget exceeded by Rs. ${over.toLocaleString()}`,
          type: "warning",
          read: false,
        },
        { upsert: true, new: true },
      );
    }
  }
}
