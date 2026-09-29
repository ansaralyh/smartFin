import { connectDB } from "@/lib/db";
import { serializeDocs } from "@/lib/serialize";
import { ActivityLog } from "@/models/ActivityLog";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import type { ActivityLogEntry } from "@/types";

export async function getAdminStats() {
  await connectDB();
  const [users, transactions] = await Promise.all([
    User.countDocuments(),
    Transaction.countDocuments(),
  ]);

  return {
    users,
    activeSessions: Math.max(Math.round(users * 0.2), 1),
    transactions,
    uptime: 99.9,
  };
}

export async function getActivityLog(limit = 20) {
  await connectDB();
  const docs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);
  return serializeDocs<ActivityLogEntry>(docs);
}
