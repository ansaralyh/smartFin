import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
  // eslint-disable-next-line no-var
  var mongooseEventsRegistered: boolean | undefined;
}

const LOG_PREFIX = "[SmartFin AI]";
const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

function registerConnectionEvents() {
  if (global.mongooseEventsRegistered) return;
  global.mongooseEventsRegistered = true;

  mongoose.connection.on("connected", () => {
    const { host, name } = mongoose.connection;
    console.log(`${LOG_PREFIX} MongoDB connected (${host}/${name})`);
  });

  mongoose.connection.on("error", (error) => {
    console.error(`${LOG_PREFIX} MongoDB error:`, error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn(`${LOG_PREFIX} MongoDB disconnected`);
  });
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const { MONGODB_URI } = getEnv();
  registerConnectionEvents();

  if (!cached.promise) {
    console.log(`${LOG_PREFIX} Connecting to MongoDB...`);
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .catch((error: Error) => {
        cached.promise = null;
        console.error(`${LOG_PREFIX} MongoDB connection failed: ${error.message}`);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
