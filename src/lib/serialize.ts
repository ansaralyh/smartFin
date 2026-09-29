function toIso(value: unknown) {
  if (!value) return value;
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}

export function serializeDoc<T>(doc: {
  toObject?: () => Record<string, unknown>;
  _id?: unknown;
} & Record<string, unknown>): T {
  const raw = doc.toObject ? doc.toObject() : { ...doc };
  const result: Record<string, unknown> = { ...raw, id: String(raw._id) };
  delete result._id;
  delete result.__v;

  if (raw.userId) result.userId = String(raw.userId);
  if (raw.transactionId) result.transactionId = String(raw.transactionId);
  if (raw.createdAt) result.createdAt = toIso(raw.createdAt);
  if (raw.updatedAt) delete result.updatedAt;
  if (raw.date) result.date = String(raw.date).slice(0, 10);
  if (raw.deadline) result.deadline = String(raw.deadline).slice(0, 10);
  if (raw.startDate) result.startDate = String(raw.startDate).slice(0, 10);
  if (raw.nextDueDate) result.nextDueDate = String(raw.nextDueDate).slice(0, 10);
  if (raw.detectedAt) result.detectedAt = toIso(raw.detectedAt);

  return result as T;
}

export function serializeDocs<T>(
  docs: Array<{ toObject?: () => Record<string, unknown>; _id?: unknown } & Record<string, unknown>>,
): T[] {
  return docs.map((doc) => serializeDoc<T>(doc));
}
