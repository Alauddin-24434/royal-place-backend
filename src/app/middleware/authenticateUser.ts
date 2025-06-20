// middlewares/auth.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/appError";

import { envVariable } from "../config";
import { logger } from "../utils/logger";
import UserModel from "../modules/User/user.schema";

/**
 * Middleware to authenticate user using access token.
 * Looks for token in cookies or Authorization header.
 * Verifies the token and attaches the user to req.user if valid.
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];

    // Token not found
    if (!token) {
      throw new AppError("Authentication required: No token provided", 401);
    }

    // Decode and verify token
    const decoded = jwt.verify(token, envVariable.JWT_ACCESS_TOKEN_SECRET) as { id: string };

    // Find user by ID from decoded token
    const user = await UserModel.findById(decoded.id).select("role");

    // User not found in DB
    if (!user) {
      throw new AppError("Authentication failed: User not found", 404);
    }

    req.user = user; // Attach user info to request object
    next();
  } catch (error) {
    // Token invalid or expired
    next(new AppError("Invalid or expired token", 403));
  }
};
