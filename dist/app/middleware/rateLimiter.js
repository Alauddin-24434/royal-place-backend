"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// General rate limiter for less sensitive routes
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window (15 minutes)
    message: "Too many requests, please try again later.",
    standardHeaders: "draft-8", // Send rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
});
// Strict rate limiter for sensitive routes like booking cancellation or payments
exports.strictLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: "Too many requests, please slow down.",
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
