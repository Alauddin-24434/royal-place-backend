// middlewares/authorizeRoles.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../error/appError";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      role?: string;
      [key: string]: any;
    }
    interface Request {
      user?: User;
    }
  }
}
/**
 * Middleware to check if the authenticated user has an allowed role.
 * Throws 403 Forbidden if user's role is not permitted.
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    // Role missing or not authorized
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new AppError("You do not have permission to access this resource", 403));
    }

    next();
  };
};
