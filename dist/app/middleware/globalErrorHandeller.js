"use strict";
// utils/globalErrorHandler.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const multer_1 = __importDefault(require("multer"));
const logger_1 = require("../utils/logger");
const config_1 = require("../config"); // adjust path based on your project
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";
    // Log the basic error
    logger_1.logger.error(`[${req.method}] ${req.originalUrl} - ${message}`);
    // Show stack only in development
    if (config_1.envVariable.ENV === "development" && err.stack) {
        logger_1.logger.debug(err.stack);
    }
    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for "${field}": "${err.keyValue[field]}"`;
    }
    // Handle Multer errors (e.g. file size exceeded)
    else if (err instanceof multer_1.default.MulterError) {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File size too large. Maximum allowed is 5MB.";
        }
        else {
            message = `Multer error: ${err.message}`;
        }
    }
    // Handle Mongoose Validation Error
    else if (err instanceof mongoose_1.Error.ValidationError) {
        statusCode = 400;
        const errors = Object.values(err.errors).map((e) => e.message);
        message = `Validation error: ${errors.join(", ")}`;
    }
    // Handle Mongoose CastError (e.g. invalid ObjectId)
    else if (err instanceof mongoose_1.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: "${err.value}"`;
    }
    // Send JSON response
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack: config_1.envVariable.ENV === "development" ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
