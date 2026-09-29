import { connectDB } from "@/lib/db";
import { getCategories } from "@/lib/services/finance-crud";
import { AIInsight } from "@/models/AIInsight";
import { Anomaly } from "@/models/Anomaly";
import { Budget } from "@/models/Budget";
import { ExpensePrediction } from "@/models/ExpensePrediction";
import { Notification } from "@/models/Notification";
import { RecurringTransaction } from "@/models/RecurringTransaction";
import { Report } from "@/models/Report";
import { SavingsGoal } from "@/models/SavingsGoal";
import { Transaction } from "@/models/Transaction";
import { logActivity, userObjectId } from "@/lib/services/core";

/** Only creates default categories — no fake transactions or demo data. */
export async function ensureUserSetup(userId: string) {
  await connectDB();
  await getCategories(userId);
}

/** Wipe all financial records for a user (keeps account + categories). */
export async function resetUserFinancialData(userId: string) {
  await connectDB();
  const oid = userObjectId(userId);

  await Promise.all([
    Transaction.deleteMany({ userId: oid }),
    Budget.deleteMany({ userId: oid }),
    SavingsGoal.deleteMany({ userId: oid }),
    RecurringTransaction.deleteMany({ userId: oid }),
    ExpensePrediction.deleteMany({ userId: oid }),
    Anomaly.deleteMany({ userId: oid }),
    AIInsight.deleteMany({ userId: oid }),
    Notification.deleteMany({ userId: oid }),
    Report.deleteMany({ userId: oid }),
  ]);

  await logActivity("data_reset", "User cleared all financial data", userId);
}
