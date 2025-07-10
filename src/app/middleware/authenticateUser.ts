import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/appError";
import { envVariable } from "../config";
import UserModel from "../modules/User/user.schema";
import { catchAsyncHandeller } from "../utils/handeller/catchAsyncHandeller";

interface JwtDecodedPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * ===== 🔐 User Authentication Middleware =====
 * 
 * 🚀 Purpose:
 *   Verify JWT token from cookies and attach user info to the request.
 * 
 * 🛠️ Steps:
 *   1️⃣ Extract token from 'accessToken' cookie.
 *   2️⃣ Verify token validity using secret key.
 *   3️⃣ Fetch user data (role, _id) from database.
 *   4️⃣ Attach user to req.user for downstream use.
 *   5️⃣ Call next() to continue request processing.
 * 
 * ⚠️ Throws Errors:
 *   ❌ 401 Unauthorized — if token missing or invalid.
 *   ❌ 404 Not Found — if user does not exist.
 * 
 * 🔄 Wrapped in catchAsyncHandeller to catch async errors.
 */
export const authenticateUser = catchAsyncHandeller(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new AppError("Unauthorized: No token provided", 401);

  const decoded = jwt.verify(token, envVariable.JWT_ACCESS_TOKEN_SECRET as string) as JwtDecodedPayload;

  const user = await UserModel.findById(decoded.id).select("role _id");
  if (!user) throw new AppError("User not found", 404);

  req.user = user;
  next();
});
