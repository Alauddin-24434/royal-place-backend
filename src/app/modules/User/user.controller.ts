

import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize";

import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { userServices } from "./user.sevices";
import { createAccessToken, createRefreshToken } from "../../utils/generateTokens";
import { envVariable } from "../../config";
import { logger } from "../../utils/logger";
import { AppError } from "../../error/appError";

// ================= Registration =====================
const regestrationUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = sanitize(req.body);

    const user = await userServices.registerUserIntoDb(body);
    const payload = { id: user._id, role: user.role };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: envVariable.ENV === "production",
      sameSite: envVariable.ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

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

// ================= Login ======================
const loginUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);

    const user = await userServices.loginUserByEmail(email);
    if (!user) {
      logger.warn("⚠️ Login failed: User not found");
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      logger.warn("⚠️ Login failed: Incorrect password");
      throw new AppError("Invalid email or password", 401);
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: envVariable.ENV === "production",
      sameSite: envVariable.ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

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









//================================find single user=============================================

const getSingleUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = sanitize(req.params.id);
    const user = await userServices.findUserById(id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  }
);

// ===================================================== find all user==========================================

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

// =====================================================delete user=================================================
const deleteUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
     const id = sanitize(req.params.id);

    const deletedUser = await userServices.deleteUserById(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  }
);

//=========================================== update user================================================================
const updateUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
   const id = sanitize(req.params.id);
    const updatedData = sanitize(req.body);

    const updatedUser = await userServices.updateUserById(id, updatedData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

// ======================================================refresh token ==============================================

export const refreshAccessToken = catchAsyncHandeller(
  async (req: Request, res: Response) => {
   
    const refreshTokenRaw = req.cookies?.refreshToken || req.headers["x-refresh-token"];
   
    const refreshToken = sanitize(refreshTokenRaw);
    if (!refreshToken) {
    
      throw new AppError("Refresh token missing", 401);
    }

    const user = await userServices.handleRefreshToken(refreshToken);
    const payload = { id: user._id, role: user.role };

    // accessToken
    const accessToken = createAccessToken(payload);



    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  }
);


// ======================export controller===============================================
export const userController = {
  regestrationUser,
  loginUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  updateUser,
  refreshAccessToken
};
