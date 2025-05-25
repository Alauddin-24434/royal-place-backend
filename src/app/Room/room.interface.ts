import { Types } from "mongoose";

export enum RoomType {
  Single = "single",
  Double = "double",
  Suite = "suite",
}

export interface Iroom extends Document {
  _id: Types.ObjectId;
  roomNumber: string;
  floor: number;
  type: RoomType;
  pricePerNight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
