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
import { log } from "console";

//----------------------------- regitration -------------------------------------------------
const regestrationUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    // Register user into DB
    const user = await userServices.registerUserIntoDb(body);

    const payload = { id: user._id, role: user.role };

    // accessToken
    const accessToken = createAccessToken(payload);

    //refresstoken
    const refresstoken = createRefreshToken(payload);

    //  Set refresh token in secure HttpOnly cookie
    res.cookie("refreshToken", refresstoken, {
      httpOnly: true,
      secure: envVariable.ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // send response

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        accessToken,
        user,
      },
    });
  }
);

//----------------------------------------login user-----------------------------------
const loginUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //  Check if user exists
    const user = await userServices.loginUserByEmail(email);

    if (!user) {
      logger.warn("⚠️ Login failed: User not found");
      throw new AppError("Invalid email or password", 401);
    }

    //  Compare passwords
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      logger.warn("⚠️ Login failed: Incorrect password");
      throw new AppError("Invalid email or password", 401);
    }

    // Create tokens
    const payload = { id: user._id, role: user.role };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    //  Set refresh token in secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: envVariable.ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //  Send response
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

//---------------------------------find single user------------------------------------------

const getSingleUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await userServices.findUserById(id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  }
);

// ------------------------------ find all user------------------------------------------------

const getAllUsers = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
  
   
   

    const users = await userServices.getAllUsers();
    logger.info("All users fetched successfully");

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  }
);

// -------------------------------delete user--------------------------------------------------
const deleteUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedUser = await userServices.deleteUserById(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  }
);

//------------------------------- update user--------------------------------------------------
const updateUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await userServices.updateUserById(id, updatedData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

// -------------------------------refresh token ----------------------------------------


export const refreshAccessToken = catchAsyncHandeller(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.refreshToken || req.headers["x-refresh-token"];

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const accessToken = await userServices.handleRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
    });
  }
);


export const userController = {
  regestrationUser,
  loginUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  updateUser,
  refreshAccessToken
};
