import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379"
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRD = async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
};
