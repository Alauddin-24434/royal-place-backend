import {  Types } from "mongoose";
export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Refunded = "refunded",
  Cancel="cancled"
}


export interface IPayment  {
  userId: Types.ObjectId; 
  bookingId: Types.ObjectId;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}




export interface GetPaymentsOptions {
  page?: number;
  limit?: number;
  status?: string;       // "pending", "completed", "failed", "refunded", "cancel"
  searchTerm?: string;   // search by guest, transactionId or email
}
