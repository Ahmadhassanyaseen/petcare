import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // We avoid throwing to keep build from crashing; routes will return clear error.
  console.warn("MONGODB_URI is not set. Set it in .env.local");
}

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) throw new Error("Missing MONGODB_URI env var");
    console.log("Connecting to database:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@"));
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((m: typeof mongoose) => {
        console.log("Database connected successfully");
        return m;
      })
      .catch((err) => {
        console.error("Database connection failed:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
