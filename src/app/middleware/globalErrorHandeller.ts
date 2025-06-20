// utils/globalErrorHandler.ts

import { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import multer from "multer";
import { logger } from "../utils/logger";
import { envVariable } from "../config"; // adjust path based on your project

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // Log the basic error
  logger.error(`[${req.method}] ${req.originalUrl} - ${message}`);

  // Show stack only in development
  if (envVariable.ENV === "development" && err.stack) {
    logger.debug(err.stack);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for "${field}": "${err.keyValue[field]}"`;
  }

  // Handle Multer errors (e.g. file size exceeded)
  else if (err instanceof multer.MulterError) {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size too large. Maximum allowed is 5MB.";
    } else {
      message = `Multer error: ${err.message}`;
    }
  }

  // Handle Mongoose Validation Error
  else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e: any) => e.message);
    message = `Validation error: ${errors.join(", ")}`;
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: "${err.value}"`;
  }

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: envVariable.ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
