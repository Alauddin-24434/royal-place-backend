import { Types } from "mongoose";

export enum UserRole {
  User = "guest",
  Admin = "admin",
  Receptionist = "receptionist",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  image:string;
  email: string;
  password: string; // hashed password
  role: UserRole;
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  
}




// update interfce 
export interface IUpdateUserInput {
  name?: string;
  phone?: string;
  image?: string;
}
