import { createClient } from "redis";
// import { envVariable } from ".";

// const redisUrl = envVariable.REDIS_URL_DOCKER;
// console.log(redisUrl)
// console.log(envVariable.DOCKER_CONTAINER);
export const redisClient = createClient({ url: "redis://royalplace_redis:6379" });
redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRD = async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
};
