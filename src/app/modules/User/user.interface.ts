import { Types } from "mongoose";

export enum UserRole {
  User = "user",
  Admin = "admin",
  Receptionist = "receptionist",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string; // hashed password
  role: UserRole;
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
}

