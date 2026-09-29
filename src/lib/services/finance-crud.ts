import { connectDB } from "@/lib/db";
import { serializeDoc, serializeDocs } from "@/lib/serialize";
import { Budget } from "@/models/Budget";
import { Category } from "@/models/Category";
import { Notification } from "@/models/Notification";
import { RecurringTransaction } from "@/models/RecurringTransaction";
import { SavingsGoal } from "@/models/SavingsGoal";
import { Transaction } from "@/models/Transaction";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { currentMonthPrefix, logActivity, syncBudgetSpent, userObjectId } from "@/lib/services/core";
import type {
  Budget as BudgetType,
  Category as CategoryType,
  RecurringTransaction as RecurringType,
  SavingsGoal as SavingsGoalType,
  Transaction as TransactionType,
} from "@/types";

function addMonths(dateStr: string, months: number) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

export async function updateTransaction(
  userId: string,
  id: string,
  data: Partial<{ amount: number; category: string; description: string; date: string }>,
) {
  await connectDB();
  const doc = await Transaction.findOneAndUpdate(
    { _id: id, userId: userObjectId(userId) },
    data,
    { new: true },
  );
  if (!doc) throw new Error("Transaction not found");
  await syncBudgetSpent(userId);
  await logActivity("transaction_updated", doc.description, userId);
  return serializeDoc<TransactionType>(doc);
}

export async function deleteTransaction(userId: string, id: string) {
  await connectDB();
  const doc = await Transaction.findOneAndDelete({ _id: id, userId: userObjectId(userId) });
  if (!doc) throw new Error("Transaction not found");
  await syncBudgetSpent(userId);
  await logActivity("transaction_deleted", doc.description, userId);
  return serializeDoc<TransactionType>(doc);
}

export async function createTransactionWithSync(
  userId: string,
  data: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date?: string;
  },
) {
  await connectDB();
  const doc = await Transaction.create({
    userId: userObjectId(userId),
    ...data,
    date: data.date ?? new Date().toISOString().split("T")[0],
  });
  if (data.type === "expense") await syncBudgetSpent(userId);
  await logActivity("transaction_created", data.description, userId);
  return serializeDoc<TransactionType>(doc);
}

export async function createBudget(
  userId: string,
  data: { category: string; limit: number; period?: BudgetType["period"]; startDate?: string },
) {
  await connectDB();
  const doc = await Budget.create({
    userId: userObjectId(userId),
    category: data.category,
    limit: data.limit,
    spent: 0,
    period: data.period ?? "monthly",
    startDate: data.startDate ?? `${currentMonthPrefix()}-01`,
  });
  await syncBudgetSpent(userId);
  await logActivity("budget_created", data.category, userId);
  const updated = await Budget.findById(doc._id);
  return serializeDoc<BudgetType>(updated!);
}

export async function updateBudget(
  userId: string,
  id: string,
  data: Partial<{ category: string; limit: number; period: BudgetType["period"] }>,
) {
  await connectDB();
  const doc = await Budget.findOneAndUpdate(
    { _id: id, userId: userObjectId(userId) },
    data,
    { new: true },
  );
  if (!doc) throw new Error("Budget not found");
  await syncBudgetSpent(userId);
  return serializeDoc<BudgetType>(doc);
}

export async function deleteBudget(userId: string, id: string) {
  await connectDB();
  const doc = await Budget.findOneAndDelete({ _id: id, userId: userObjectId(userId) });
  if (!doc) throw new Error("Budget not found");
  await logActivity("budget_deleted", doc.category, userId);
  return serializeDoc<BudgetType>(doc);
}

export async function createSavingsGoal(
  userId: string,
  data: { name: string; targetAmount: number; deadline?: string },
) {
  await connectDB();
  const doc = await SavingsGoal.create({
    userId: userObjectId(userId),
    name: data.name,
    targetAmount: data.targetAmount,
    savedAmount: 0,
    deadline: data.deadline,
    status: "active",
  });
  await logActivity("savings_goal_created", data.name, userId);
  return serializeDoc<SavingsGoalType>(doc);
}

export async function updateSavingsGoal(
  userId: string,
  id: string,
  data: Partial<{ name: string; targetAmount: number; deadline: string; status: SavingsGoalType["status"] }>,
) {
  await connectDB();
  const doc = await SavingsGoal.findOneAndUpdate(
    { _id: id, userId: userObjectId(userId) },
    data,
    { new: true },
  );
  if (!doc) throw new Error("Savings goal not found");
  return serializeDoc<SavingsGoalType>(doc);
}

export async function contributeToSavings(userId: string, id: string, amount: number) {
  await connectDB();
  const doc = await SavingsGoal.findOne({ _id: id, userId: userObjectId(userId) });
  if (!doc) throw new Error("Savings goal not found");
  doc.savedAmount += amount;
  if (doc.savedAmount >= doc.targetAmount) doc.status = "completed";
  await doc.save();
  await logActivity("savings_contribution", `Added Rs. ${amount} to ${doc.name}`, userId);
  return serializeDoc<SavingsGoalType>(doc);
}

export async function deleteSavingsGoal(userId: string, id: string) {
  await connectDB();
  const doc = await SavingsGoal.findOneAndDelete({ _id: id, userId: userObjectId(userId) });
  if (!doc) throw new Error("Savings goal not found");
  return serializeDoc<SavingsGoalType>(doc);
}

export async function getCategories(userId: string) {
  await connectDB();
  const oid = userObjectId(userId);
  let docs = await Category.find({ userId: oid }).sort({ name: 1 });
  if (docs.length === 0) {
    await Category.insertMany(
      DEFAULT_CATEGORIES.map((name) => ({ userId: oid, name, type: "both" as const })),
    );
    docs = await Category.find({ userId: oid }).sort({ name: 1 });
  }
  return serializeDocs<CategoryType>(docs);
}

export async function createCategory(
  userId: string,
  data: { name: string; type?: CategoryType["type"]; color?: string },
) {
  await connectDB();
  const doc = await Category.create({
    userId: userObjectId(userId),
    name: data.name.trim(),
    type: data.type ?? "both",
    color: data.color,
  });
  await logActivity("category_created", data.name, userId);
  return serializeDoc<CategoryType>(doc);
}

export async function updateCategory(
  userId: string,
  id: string,
  data: Partial<{ name: string; type: CategoryType["type"]; color: string }>,
) {
  await connectDB();
  const doc = await Category.findOneAndUpdate(
    { _id: id, userId: userObjectId(userId) },
    data,
    { new: true },
  );
  if (!doc) throw new Error("Category not found");
  return serializeDoc<CategoryType>(doc);
}

export async function deleteCategory(userId: string, id: string) {
  await connectDB();
  const doc = await Category.findOneAndDelete({ _id: id, userId: userObjectId(userId) });
  if (!doc) throw new Error("Category not found");
  return serializeDoc<CategoryType>(doc);
}

export async function getRecurring(userId: string) {
  await connectDB();
  const docs = await RecurringTransaction.find({ userId: userObjectId(userId) }).sort({
    nextDueDate: 1,
  });
  return serializeDocs<RecurringType>(docs);
}

export async function createRecurring(
  userId: string,
  data: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    frequency?: RecurringType["frequency"];
    nextDueDate?: string;
  },
) {
  await connectDB();
  const doc = await RecurringTransaction.create({
    userId: userObjectId(userId),
    ...data,
    frequency: data.frequency ?? "monthly",
    nextDueDate: data.nextDueDate ?? new Date().toISOString().split("T")[0],
    isActive: true,
  });
  await logActivity("recurring_created", data.description, userId);
  return serializeDoc<RecurringType>(doc);
}

export async function updateRecurring(
  userId: string,
  id: string,
  data: Partial<{
    amount: number;
    category: string;
    description: string;
    frequency: RecurringType["frequency"];
    nextDueDate: string;
    isActive: boolean;
  }>,
) {
  await connectDB();
  const doc = await RecurringTransaction.findOneAndUpdate(
    { _id: id, userId: userObjectId(userId) },
    data,
    { new: true },
  );
  if (!doc) throw new Error("Recurring transaction not found");
  return serializeDoc<RecurringType>(doc);
}

export async function deleteRecurring(userId: string, id: string) {
  await connectDB();
  const doc = await RecurringTransaction.findOneAndDelete({
    _id: id,
    userId: userObjectId(userId),
  });
  if (!doc) throw new Error("Recurring transaction not found");
  return serializeDoc<RecurringType>(doc);
}

export async function processDueRecurring(userId: string) {
  await connectDB();
  const oid = userObjectId(userId);
  const today = new Date().toISOString().split("T")[0];
  const due = await RecurringTransaction.find({
    userId: oid,
    isActive: true,
    nextDueDate: { $lte: today },
  });

  for (const item of due) {
    await Transaction.create({
      userId: oid,
      type: item.type,
      amount: item.amount,
      category: item.category,
      description: `${item.description} (recurring)`,
      date: today,
    });

    const months = item.frequency === "yearly" ? 12 : item.frequency === "weekly" ? 0 : 1;
    if (item.frequency === "weekly") {
      const d = new Date(item.nextDueDate);
      d.setDate(d.getDate() + 7);
      item.nextDueDate = d.toISOString().split("T")[0];
    } else if (item.frequency === "daily") {
      const d = new Date(item.nextDueDate);
      d.setDate(d.getDate() + 1);
      item.nextDueDate = d.toISOString().split("T")[0];
    } else {
      item.nextDueDate = addMonths(item.nextDueDate, months);
    }
    await item.save();
  }

  if (due.length > 0) await syncBudgetSpent(userId);
  return due.length;
}

export async function markNotificationRead(userId: string, id: string) {
  await connectDB();
  const doc = await Notification.findOneAndUpdate(
    { _id: id, userId: userObjectId(userId) },
    { read: true },
    { new: true },
  );
  if (!doc) throw new Error("Notification not found");
  return serializeDoc(doc);
}

export async function markAllNotificationsRead(userId: string) {
  await connectDB();
  await Notification.updateMany({ userId: userObjectId(userId), read: false }, { read: true });
}

export async function deleteNotification(userId: string, id: string) {
  await connectDB();
  await Notification.findOneAndDelete({ _id: id, userId: userObjectId(userId) });
}
