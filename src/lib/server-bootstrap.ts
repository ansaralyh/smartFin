import { connectDB } from "@/lib/db";
import { getEnv } from "@/lib/env";

const LOG_PREFIX = "[SmartFin AI]";

export async function bootstrapServer() {
  const port = process.env.PORT ?? "3000";
  const env = process.env.NODE_ENV ?? "development";

  console.log("");
  console.log(`${LOG_PREFIX} Bootstrapping SmartFin AI...`);
  console.log(`${LOG_PREFIX} Environment: ${env}`);

  try {
    const { OPENAI_API_KEY } = getEnv();
    console.log(`${LOG_PREFIX} Environment variables validated`);

    await connectDB();

    console.log(
      `${LOG_PREFIX} OpenAI: ${OPENAI_API_KEY ? "configured" : "not configured"}`,
    );
    console.log(`${LOG_PREFIX} Server ready at http://localhost:${port}`);
    console.log(`${LOG_PREFIX} Health check: http://localhost:${port}/api/health`);
    console.log("");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`${LOG_PREFIX} Startup failed: ${message}`);
    console.error(`${LOG_PREFIX} Fix .env.local and restart the dev server`);
    console.log("");
  }
}
