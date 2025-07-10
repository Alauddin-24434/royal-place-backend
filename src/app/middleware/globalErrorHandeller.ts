import { ErrorRequestHandler } from "express";
import multer from "multer";
import mongoose from "mongoose";

import { AppError } from "../error/appError";
import { logger } from "../utils/logger";
import { envVariable } from "../config";

/**
 * ===== 🌐 Global Error Handler Middleware =====
 * 
 * 🚦 Purpose:
 *   Handle all errors thrown in the app in a centralized way.
 * 
 * 🔍 Error Types Handled:
 *   - 🚨 Operational errors (AppError)
 *   - 🧩 MongoDB duplicate key errors (code 11000)
 *   - 📁 Multer file upload errors
 *   - 📜 Mongoose validation errors
 *   - 🔧 Mongoose cast errors (invalid IDs)
 *   - 💥 Unexpected/unhandled errors
 * 
 * ⚙️ Behavior:
 *   - Sets appropriate HTTP status code & error message.
 *   - Logs unexpected errors in development or production.
 *   - Hides detailed error info in production (only generic message).
 * 
 * 📡 Response Format:
 *   JSON with success flag, status code, error name, message, and stack trace (dev only).
 */
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errorName = err.name || "Error";

  if (err instanceof AppError && err.isOperational) {
    // ✅ Operational app error, send as is
  } else if (err.code === 11000) {
    // 🧩 Mongo duplicate key error
    statusCode = 409;
    errorName = "Conflict";
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for "${field}": "${err.keyValue[field]}"`;
  } else if (err instanceof multer.MulterError) {
    // 📁 Multer file upload error
    statusCode = 400;
    errorName = "MulterError";
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File size too large. Maximum allowed is 5MB."
        : `Multer error: ${err.message}`;
  } else if (err instanceof mongoose.Error.ValidationError) {
    // 📜 Mongoose validation error
    statusCode = 400;
    errorName = "ValidationError";
    const errors = Object.values(err.errors).map((e: any) => e.message);
    message = `Validation error: ${errors.join(", ")}`;
  } else if (err instanceof mongoose.Error.CastError) {
    // 🔧 Mongoose invalid ObjectId error
    statusCode = 400;
    errorName = "BadRequest";
    message = `Invalid ${err.path}: "${err.value}"`;
  } else {
    // 💥 Unexpected error
    logger.error("🔥 Unexpected Error:", err);
    if (envVariable.ENV === "production") {
      message = "Internal Server Error";
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    error: errorName,
    message,
    stack: envVariable.ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
