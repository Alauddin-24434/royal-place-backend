import dotenv from "dotenv";

dotenv.config();

export const envVariable = {
  PORT: process.env.PORT || "5000",
  DB_URL: process.env.DB_URL || "",
  ENV: process.env.ENV || "development",

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "",
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
  JWT_REFRESH_TOKEN_EXPIRES_IN:
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",

  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
  COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY === "true",
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || "lax",
};
