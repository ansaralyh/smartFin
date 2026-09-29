export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  const { bootstrapServer } = await import("@/lib/server-bootstrap");
  await bootstrapServer();
}
