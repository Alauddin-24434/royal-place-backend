import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/appError";
import { envVariable } from "../config";
import UserModel from "../modules/User/user.schema";

interface JwtDecodedPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Authentication required: No token provided", 401);
    }

    if (!envVariable.JWT_ACCESS_TOKEN_SECRET) {
      throw new Error("JWT secret is not defined in environment variables.");
    }

    const decoded = jwt.verify(token, envVariable.JWT_ACCESS_TOKEN_SECRET) as JwtDecodedPayload;

    if (!decoded?.id) {
      throw new AppError("Invalid token payload", 401);
    }

    const user = await UserModel.findById(decoded.id).select("role _id");

    if (!user) {
      throw new AppError("Authentication failed: User not found", 404);
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Access token expired. Please login again.", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please try logging in again.", 401));
    }

    return next(error);
  }
};
