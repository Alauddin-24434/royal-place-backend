"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const multer_1 = __importDefault(require("multer"));
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const globalErrorHandler = (err, req, res, next) => {
    if (err.statusCode === 401) {
        console.log("This is an Unauthorized error");
    }
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";
    let errorName = err.name || "Error";
    let details = null;
    // Log the error
    logger_1.logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`);
    if (config_1.envVariable.ENV === "development" && err.stack) {
        logger_1.logger.debug(err.stack);
    }
    // Customize Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        errorName = "Conflict";
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for "${field}": "${err.keyValue[field]}"`;
    }
    // Multer errors (file uploads)
    else if (err instanceof multer_1.default.MulterError) {
        statusCode = 400;
        errorName = "MulterError";
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File size too large. Maximum allowed is 5MB.";
        }
        else {
            message = `Multer error: ${err.message}`;
        }
    }
    // Mongoose validation errors
    else if (err instanceof mongoose_1.Error.ValidationError) {
        statusCode = 400;
        errorName = "ValidationError";
        const errors = Object.values(err.errors).map((e) => e.message);
        message = `Validation error: ${errors.join(", ")}`;
    }
    // Mongoose cast errors (invalid IDs)
    else if (err instanceof mongoose_1.Error.CastError) {
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
        stack: config_1.envVariable.ENV === "development" ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
