"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const appError_1 = require("../error/appError");
/**
 * Middleware to check if the authenticated user has an allowed role.
 * Throws 403 Forbidden if user's role is not permitted.
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        // Role missing or not authorized
        if (!userRole || !allowedRoles.includes(userRole)) {
            return next(new appError_1.AppError("Forbidden: You do not have permission to access this resource", 403));
        }
        next();
    };
};
exports.checkRole = checkRole;
