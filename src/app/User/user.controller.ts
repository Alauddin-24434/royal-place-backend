import { NextFunction, Request, Response } from "express";
import { catchAsyncHandeller } from "../utils/catchAsyncHandeller";
import bcrypt from "bcryptjs";

import { envVariable } from "../config";
import { userServices } from "./user.sevices";
import { logger } from "../utils/logger";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/generateTokens/generateTokens";
import { AppError } from "../error/appError";

const regestrationUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    //
    // Register user into DB
    const user = await userServices.registerUserIntoDb(body);

    const payload = { _id: user.id, role: user.role };

    // accessToken
    const accessToken = createAccessToken(payload);

    //refresstoken
    const refresstoken = createRefreshToken(payload);



    //  Set refresh token in secure HttpOnly cookie
    res.cookie("refreshToken", refresstoken,{
        httpOnly:true,
        secure: envVariable.ENV==="production",
        sameSite:"strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // send response

    res.status(201).json({
        success:true,
        message:"User registered successfully",
        data: {
            accessToken,
            user,
        }
    })

  }
);
const loginUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await userServices.loginUserByEmail(email);

    if (!user) {
      logger.warn("⚠️ Login failed: User not found");
      throw new AppError("Invalid email or password", 401);
    }

    // 2. Compare passwords
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      logger.warn("⚠️ Login failed: Incorrect password");
      throw new AppError("Invalid email or password", 401);
    }

    // 3. Create tokens
    const payload = { _id: user.id, role: user.role };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // 4. Set refresh token in secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: envVariable.ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  }
);

export const userController = {
  regestrationUser,
  loginUser,
};