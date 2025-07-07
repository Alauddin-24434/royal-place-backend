import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize";

import { catchAsyncHandeller } from "../../utils/handeller/catchAsyncHandeller";
import { userServices } from "./user.sevices";
import { createAccessToken, createRefreshToken } from "../../utils/handeller/generateTokens";
import { logger } from "../../utils/logger";
import { AppError } from "../../error/appError";
import { getIO } from "../../socket";
import { cookieOptions } from "../../config/cookie.config";

// ================= Registration =====================
const regestrationUser = catchAsyncHandeller(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = sanitize(req.body);

    const user = await userServices.registerUserIntoDb(body);
    const payload = { id: user._id, role: user.role };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // Set tokens as HttpOnly cookies
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    const io = getIO();
    io.to("admin").emit("user-created", user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
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
      logger.warn("Login failed: User not found");
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      logger.warn("Login failed: Incorrect password");
      throw new AppError("Invalid email or password", 401);
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    console.log('Access Token:', accessToken);
    console.log('Type of Access Token:', typeof accessToken);

    console.log('Refresh Token:', refreshToken);
    console.log('Type of Refresh Token:', typeof refreshToken);

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
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

    let updatedData;
    const imageUrl = req.file?.path;
    if (imageUrl) {
      updatedData = sanitize({ ...req.body, image: imageUrl });
    } else {
      updatedData = sanitize(req.body);
    }

    const user = await userServices.updateUserById(id, updatedData);
    const payload = { id: user._id, role: user.role };
    const refreshToken = createRefreshToken(payload);
    const accessToken = createAccessToken(payload);

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user,
      },
    });
  }
);

// ======================================================refresh token ==============================================
const refreshAccessToken = catchAsyncHandeller(
  async (req: Request, res: Response) => {
    const refreshTokenRaw = req.cookies?.refreshToken || req.headers["x-refresh-token"];
    const refreshToken = sanitize(refreshTokenRaw);

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const user = await userServices.handleRefreshToken(refreshToken);
    const payload = { id: user._id, role: user.role };

    const accessToken = createAccessToken(payload);


    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",

    });
  }
);


const logoutUser = catchAsyncHandeller(async (req: Request, res: Response, next: NextFunction) => {

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);


  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// ======================export controller===============================================
export const userController = {
  regestrationUser,
  loginUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  updateUser,
  refreshAccessToken,
  logoutUser
};
