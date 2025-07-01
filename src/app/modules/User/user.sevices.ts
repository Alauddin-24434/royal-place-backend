
import { envVariable } from "../../config";
import { AppError } from "../../error/appError";
import { logger } from "../../utils/logger";
import { IUser } from "./user.interface";

import jwt from "jsonwebtoken";
import UserModel from "./user.schema";


//======================================================== Regitration ===================================================================
const registerUserIntoDb = async (body: IUser) => {
  // Check if user already exists by email
  const isUserExist = await UserModel.findOne({ email: body.email });

  if (isUserExist) {
    logger.warn("⚠️ Registration failed: User already exists");
    throw new AppError("User already exists!", 400);
  }

  // Create new user - password hashing automatically handled by pre('save') middleware
  const newUser = await UserModel.create(body);

  logger.info(`✅ New user registered: ${newUser.email}`);
  return newUser;
};

// ============================================login user==============================================
const loginUserByEmail = async (email: string) => {
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError("User does not exist!", 404);
  }

  return isUserExist;
};

//================================find single user=============================================

const findUserById = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  return user;
};

// ===================================================== find all user==========================================

const getAllUsers = async () => {
  const users = await UserModel.find().sort({ createdAt: -1 }); // latest first
  return users;
};

// =====================================================delete user=================================================
const deleteUserById = async (id: string) => {
  //  Find the user by ID
  const user = await UserModel.findById(id);

  //  If user doesn't exist
  if (!user) {
    throw new AppError("Failed to delete user. User not found!", 404);
  }

  // Soft delete: set isDeleted = true
  user.isDeleted = true;

  await user.save();

  return user;
};

//=========================================== update user================================================================
const updateUserById = async (id: string, updateData: Partial<IUser>) => {
  // Only update if the user exists and is not soft deleted
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false }, // 👈 condition added here
    updateData,
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

// ======================================================refresh token ==============================================

export const handleRefreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, envVariable.JWT_REFRESH_TOKEN_SECRET) as { id: string };

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  

  return user;
};


// ============================== Export Services==========================================================

export const userServices = {
  registerUserIntoDb,
  loginUserByEmail,
  findUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
  handleRefreshToken,
};


