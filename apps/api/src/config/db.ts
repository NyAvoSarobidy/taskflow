import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error("MONGODB_URI non défini dans .env");
  process.exit(1);
}

// Reuse existing connection (pool de connexions)
let cachedConnection: typeof mongoose | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "taskflow",
    });
    cachedConnection = conn;
    console.log(`MongoDB connecté : ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
}
