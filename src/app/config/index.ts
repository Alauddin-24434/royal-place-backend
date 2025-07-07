import dotenv from "dotenv";

dotenv.config();

// Environment variables used across the app
export const envVariable = {
  PORT: process.env.PORT,                    // Server port
  DB_URL: process.env.DB_URL,                   // MongoDB connection URI
  ENV: process.env.ENV,            // Environment mode

  // AamarPay Payment Config
  AAMARPAY_STORE_ID: process.env.AAMARPAY_STORE_ID || "",
  AAMARPAY_SIGNATURE_KEY: process.env.AAMARPAY_SIGNATURE_KEY || "",
  SUCCESS_URL: process.env.SUCCESS_URL || "",
  FAIL_URL: process.env.FAIL_URL || "",
  CANCEL_URL: process.env.CANCEL_URL || "",

  // ML Cancel Prediction API
  ML_CANCEL_PREDICT_API: process.env.ML_CANCEL_PREDICT_API,

  // JWT Secrets and Expiry
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
};
