import { Types } from "mongoose";

export enum RoomType {
  Luxury = "luxury",
  Suite = "suite",
  Deluxe = "deluxe",
  Twin = "twin",
}

export interface Iroom {
  roomNumber: string;
  images?: string[]; 
  floor: number;
  description?: string;
  type: RoomType;
  features: string[];
  pricePerNight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
