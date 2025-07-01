"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Set error name to class name (helps identify error type)
        this.name = this.constructor.name;
        // Captures stack trace excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
