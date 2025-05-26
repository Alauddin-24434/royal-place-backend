import { AppError } from "../error/appError";
import { IUser } from "./user.interface";
import UserModel from "./user.model";

import { logger } from "../utils/logger";

//------------------- regitration ----------------------------------------

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


//-------------------------find user by email------------------------------
const loginUserByEmail = async (email: string) => {
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError("User does not exist!", 404);
  }

  return isUserExist;
};

//----------------------------------- find user by id---------------------------------

const findUserById = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  return user;
};



//--------------- find all user only access admin & receptponoist---------------------------


const getAllUsers = async () => {
  const users = await UserModel.find().sort({ createdAt: -1 }); // latest first
  return users;
};

// -----------------------delete user by id-------------------------------------------


const deleteUserById = async (id: string) => {
  const deletedUser = await UserModel.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new AppError("Failed to delete user. User not found!", 404);
  }

  return deletedUser;
};


// -----------------------------------update user by id--------------------------------------

const updateUserById = async (id: string, updateData: Partial<IUser>) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError("User not found!", 404);
  }

  return updatedUser;
};




export const userServices ={
    registerUserIntoDb,
    loginUserByEmail,
    findUserById,
    getAllUsers,
    deleteUserById,
    updateUserById,
}
