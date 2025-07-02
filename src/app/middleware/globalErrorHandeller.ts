import { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import multer from "multer";
import { logger } from "../utils/logger";
import { envVariable } from "../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.statusCode === 401) {
  console.log("This is an Unauthorized error");
}

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errorName = err.name || "Error";
  let details = null;

  // Log the error
  // logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`);

  if (envVariable.ENV === "development" && err.stack) {
    logger.debug(err.stack);
  }

  // Customize Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    errorName = "Conflict";
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for "${field}": "${err.keyValue[field]}"`;
  }

  // Multer errors (file uploads)
  else if (err instanceof multer.MulterError) {
    statusCode = 400;
    errorName = "MulterError";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size too large. Maximum allowed is 5MB.";
    } else {
      message = `Multer error: ${err.message}`;
    }
  }

  // Mongoose validation errors
  else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    errorName = "ValidationError";
    const errors = Object.values(err.errors).map((e: any) => e.message);
    message = `Validation error: ${errors.join(", ")}`;
  }

  // Mongoose cast errors (invalid IDs)
  else if (err instanceof MongooseError.CastError) {
    statusCode = 400;
    errorName = "BadRequest";
    message = `Invalid ${err.path}: "${err.value}"`;
  }

  // Optionally you can add more custom errors here...

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    statusCode,
    error: errorName,
    message,
    details,
    stack: envVariable.ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
