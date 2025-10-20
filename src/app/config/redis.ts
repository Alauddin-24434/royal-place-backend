import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

// Convert env variable to boolean
const isDocker: boolean = true;

const url = isDocker
  ? "redis://royalplace_redis:6379" // Docker
  : "redis://localhost:6379"; // Local Redis

export const redisClient = createClient({ url });

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

export const connectRD = async () => {
  try {
    await redisClient.connect();
    console.log(`✅ Connected to Redis (${isDocker ? "Docker" : "Local"})`);
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
};
