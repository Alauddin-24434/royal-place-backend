import {  Types, Document } from "mongoose";

export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Cancelled = "cancelled",
  Refunded = "refunded",
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

