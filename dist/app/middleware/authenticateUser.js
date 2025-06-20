"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
// middlewares/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../error/appError");
const config_1 = require("../config");
const user_schema_1 = __importDefault(require("../modules/User/user.schema"));
/**
 * Middleware to authenticate user using access token.
 * Looks for token in cookies or Authorization header.
 * Verifies the token and attaches the user to req.user if valid.
 */
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_c = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1]);
        // Token not found
        if (!token) {
            throw new appError_1.AppError("Authentication required: No token provided", 401);
        }
        // Decode and verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.envVariable.JWT_ACCESS_TOKEN_SECRET);
        // Find user by ID from decoded token
        const user = yield user_schema_1.default.findById(decoded.id).select("role");
        // User not found in DB
        if (!user) {
            throw new appError_1.AppError("Authentication failed: User not found", 404);
        }
        req.user = user; // Attach user info to request object
        next();
    }
    catch (error) {
        // Token invalid or expired
        next(new appError_1.AppError("Invalid or expired token", 403));
    }
});
exports.authenticateUser = authenticateUser;
