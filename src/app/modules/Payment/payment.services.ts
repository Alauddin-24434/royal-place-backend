import { verifyPayment } from "../../utils/payment.utills";
import BookingModel from "../Booking/booking.schema";
import mongoose from "mongoose";
import PaymentModel from "./payment.schema";
import { PaymentStatus } from "./payment.interface";
import { BookingStatus } from "../Booking/booking.interface";
import sanitize from "mongo-sanitize";

// ======================================================================Payment Verify with Success======================================================================
const paymentVerify = async (transactionIdRaw: string) => {
  // sanitize input
  const transactionId = sanitize(transactionIdRaw);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Step 1: Verify with AamarPay
    const verificationResponse = await verifyPayment(transactionId);
    console.log('AamarPay verification response:', verificationResponse);

    // ✅ Step 2: Get payment record
    const payment = await PaymentModel.findOne({ transactionId }).session(session);
    if (!payment) throw new Error('Payment not found');

    // ✅ Step 3: Update status based on AamarPay response
    if (
      verificationResponse &&
      verificationResponse.pay_status === "Successful"
    ) {
      payment.status = PaymentStatus.Completed;

      // ✅ Also update booking as booked
      await BookingModel.findByIdAndUpdate(
        payment.bookingId,
        { bookingStatus: BookingStatus.Booked },
        { session }
      );
    } else {
      payment.status = PaymentStatus.Failed;
    }

    // ✅ Step 4: Save changes
    await payment.save({ session });
    await session.commitTransaction();
    session.endSession();

    return {
      status: payment.status,
      pay_status: verificationResponse.pay_status,
      status_title: verificationResponse.status_title,
      payment_type: verificationResponse.payment_type,
      amount: verificationResponse.amount,

      transactionId,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ===============================================================Payment Failed===================================================================
const paymentFail = async (transactionIdRaw: string) => {
  const transactionId = sanitize(transactionIdRaw);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Step 1: Verify with AamarPay
    const verificationResponse = await verifyPayment(transactionId);
    console.log('AamarPay verification response:', verificationResponse);

    // ✅ Step 2: Get payment record
    const payment = await PaymentModel.findOne({ transactionId }).session(session);
    if (!payment) throw new Error('Payment not found');

    // ✅ Step 3: Update status based on AamarPay response
    if (
      verificationResponse &&
      verificationResponse.pay_status === "Failed"
    ) {
      // Update payment status
      payment.status = PaymentStatus.Failed;

      // Also update booking status
      const booking = await BookingModel.findOne({ transactionId }).session(session);
      if (!booking) throw new Error('Booking not found');

      booking.bookingStatus = BookingStatus.Failed;

      // Save both documents
      await payment.save({ session });
      await booking.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        status: payment.status,
        pay_status: verificationResponse.pay_status,
        status_title: verificationResponse.status_title,
        payment_type: verificationResponse.payment_type,
        amount: verificationResponse.amount,
        transactionId,
      };
    } else {
      throw new Error("Payment is not marked as failed by AamarPay");
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ===============================================================Payment Cancel===================================================================
const paymentCancel = async (transactionIdRaw: string) => {
  const transactionId = sanitize(transactionIdRaw);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Step 1: Verify with AamarPay
    const verificationResponse = await verifyPayment(transactionId);
    console.log('AamarPay verification response:', verificationResponse);

    // ✅ Step 2: Get payment record
    const payment = await PaymentModel.findOne({ transactionId }).session(session);
    if (!payment) throw new Error('Payment not found');

    // ✅ Step 3: Check if cancel is valid
    if (
      verificationResponse &&
      verificationResponse.pay_status === "Cancelled"
    ) {
      // Update payment status
      payment.status = PaymentStatus.Cancel;

      // Update booking status
      const booking = await BookingModel.findOne({ transactionId }).session(session);
      if (!booking) throw new Error('Booking not found');

      booking.bookingStatus = BookingStatus.Cancelled;

      // Save both documents
      await payment.save({ session });
      await booking.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        status: payment.status,
        pay_status: verificationResponse.pay_status,
        status_title: verificationResponse.status_title,
        payment_type: verificationResponse.payment_type,
        amount: verificationResponse.amount,
        transactionId,
      };
    } else {
      throw new Error("Payment is not marked as cancelled by AamarPay");
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// =====================Export services=============================
export const paymentServices = {
  paymentVerify,
  paymentFail,
  paymentCancel
};
