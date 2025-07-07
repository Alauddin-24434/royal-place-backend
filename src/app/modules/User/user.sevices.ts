import { envVariable } from "../../config";
import { AppError } from "../../error/appError";
import { logger } from "../../utils/logger";
import { IUpdateUserInput, IUser } from "./user.interface";

import jwt from "jsonwebtoken";
import UserModel from "./user.schema";
import sanitize from "mongo-sanitize";

//======================================================== Registration ===================================================================
const registerUserIntoDb = async (body: IUser) => {
  const cleanBody = sanitize(body);

  // Check if user already exists by email
  const isUserExist = await UserModel.findOne({ email: cleanBody.email });

  if (isUserExist) {
    logger.warn("⚠️ Registration failed: User already exists");
    throw new AppError("User already exists!", 400);
  }

  // Create new user - password hashing automatically handled by pre('save') middleware
  const newUser = await UserModel.create(cleanBody);

  logger.info(`✅ New user registered: ${newUser.email}`);
  return newUser;
};

// ============================================ Login user ==============================================
const loginUserByEmail = async (email: string) => {
  const cleanEmail = sanitize(email);

  const isUserExist = await UserModel.findOne({ email: cleanEmail });

  if (!isUserExist) {
    throw new AppError("User does not exist!", 404);
  }

  return isUserExist;
};

//================================ Find single user =============================================
const findUserById = async (id: string) => {
  const cleanId = sanitize(id);

  const user = await UserModel.findById(cleanId);

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  return user;
};

// ===================================================== Find all users ==========================================
const getAllUsers = async () => {
  const users = await UserModel.find().sort({ createdAt: -1 }); // latest first
  return users;
};

// ===================================================== Delete user ===============================================
const deleteUserById = async (id: string) => {
  const cleanId = sanitize(id);

  // Find the user by ID
  const user = await UserModel.findById(cleanId);

  if (!user) {
    throw new AppError("Failed to delete user. User not found!", 404);
  }

  // Soft delete: set isDeleted = true
  user.isDeleted = true;

  await user.save();

  return user;
};

//=========================================== Update user ===========================================================
const updateUserById = async (id: string, updateData: IUpdateUserInput) => {
  const cleanId = sanitize(id);
  const cleanUpdateData = sanitize(updateData);
console.log( cleanId, cleanUpdateData);
  // Only update if the user exists and is not soft deleted
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: cleanId, isDeleted: false },
    cleanUpdateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new AppError("User not found or has been deleted!", 404);
  }

  return updatedUser;
};

// ====================================================== Refresh token ==============================================
export const handleRefreshToken = async (refreshToken: string) => {
  const cleanRefreshToken = sanitize(refreshToken);

  if (!envVariable.JWT_REFRESH_TOKEN_SECRET) {
    throw new AppError("JWT refresh token secret is not defined", 500);
  }
  const decoded = jwt.verify(
    cleanRefreshToken,
    envVariable.JWT_REFRESH_TOKEN_SECRET as string
  ) as unknown as { id: string };

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// ============================== Export Services ==========================================================
export const userServices = {
  registerUserIntoDb,
  loginUserByEmail,
  findUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
  handleRefreshToken,
};
