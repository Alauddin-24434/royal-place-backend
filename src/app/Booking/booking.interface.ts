import { Schema, model, Types, Document } from "mongoose";

export enum BookingStatus {
  Pending = "pending",
  Booked = "booked",
  Cancelled = "cancelled",
}

export interface IBooking extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  roomId: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  status: BookingStatus;
  paymentId?: Types.ObjectId;  // Payment এর রেফারেন্স
  createdAt: Date;
  updatedAt: Date;
}

