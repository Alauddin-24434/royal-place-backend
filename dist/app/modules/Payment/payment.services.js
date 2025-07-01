"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
const payment_utills_1 = require("../../utils/payment.utills");
const booking_schema_1 = __importDefault(require("../Booking/booking.schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const payment_schema_1 = __importDefault(require("./payment.schema"));
const payment_interface_1 = require("./payment.interface");
const booking_interface_1 = require("../Booking/booking.interface");
// ======================================================================Payment Verify with Success======================================================================
const paymentVerify = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // ✅ Step 1: Verify with AamarPay
        const verificationResponse = yield (0, payment_utills_1.verifyPayment)(transactionId);
        console.log('AamarPay verification response:', verificationResponse);
        // ✅ Step 2: Get payment record
        const payment = yield payment_schema_1.default.findOne({ transactionId }).session(session);
        if (!payment)
            throw new Error('Payment not found');
        // ✅ Step 3: Update status based on AamarPay response
        if (verificationResponse &&
            verificationResponse.pay_status === "Successful") {
            payment.status = payment_interface_1.PaymentStatus.Completed;
            // ✅ Also update booking as booked
            yield booking_schema_1.default.findByIdAndUpdate(payment.bookingId, { bookingStatus: booking_interface_1.BookingStatus.Booked }, { session });
        }
        else {
            payment.status = payment_interface_1.PaymentStatus.Failed;
        }
        // ✅ Step 4: Save changes
        yield payment.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            status: payment.status,
            pay_status: verificationResponse.pay_status,
            status_title: verificationResponse.status_title,
            payment_type: verificationResponse.payment_type,
            amount: verificationResponse.amount,
            transactionId,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// ===============================================================Payment Faild===================================================================
const paymentFail = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // ✅ Step 1: Verify with AamarPay
        const verificationResponse = yield (0, payment_utills_1.verifyPayment)(transactionId);
        console.log('AamarPay verification response:', verificationResponse);
        // ✅ Step 2: Get payment record
        const payment = yield payment_schema_1.default.findOne({ transactionId }).session(session);
        if (!payment)
            throw new Error('Payment not found');
        // ✅ Step 3: Update status based on AamarPay response
        if (verificationResponse &&
            verificationResponse.pay_status === "Failed") {
            // Update payment status
            payment.status = payment_interface_1.PaymentStatus.Failed;
            // Also update booking status
            const booking = yield booking_schema_1.default.findOne({ transactionId }).session(session);
            if (!booking)
                throw new Error('Booking not found');
            booking.bookingStatus = booking_interface_1.BookingStatus.Failed;
            // Save both documents
            yield payment.save({ session });
            yield booking.save({ session });
            yield session.commitTransaction();
            session.endSession();
            return {
                status: payment.status,
                pay_status: verificationResponse.pay_status,
                status_title: verificationResponse.status_title,
                payment_type: verificationResponse.payment_type,
                amount: verificationResponse.amount,
                transactionId,
            };
        }
        else {
            throw new Error("Payment is not marked as failed by AamarPay");
        }
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// ===============================================================Payment Cancel===================================================================
const paymentCancel = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // ✅ Step 1: Verify with AamarPay
        const verificationResponse = yield (0, payment_utills_1.verifyPayment)(transactionId);
        console.log('AamarPay verification response:', verificationResponse);
        // ✅ Step 2: Get payment record
        const payment = yield payment_schema_1.default.findOne({ transactionId }).session(session);
        if (!payment)
            throw new Error('Payment not found');
        // ✅ Step 3: Check if cancel is valid
        if (verificationResponse &&
            verificationResponse.pay_status === "Cancelled") {
            // Update payment status
            payment.status = payment_interface_1.PaymentStatus.Cancel;
            // Update booking status
            const booking = yield booking_schema_1.default.findOne({ transactionId }).session(session);
            if (!booking)
                throw new Error('Booking not found');
            booking.bookingStatus = booking_interface_1.BookingStatus.Cancelled;
            // Save both documents
            yield payment.save({ session });
            yield booking.save({ session });
            yield session.commitTransaction();
            session.endSession();
            return {
                status: payment.status,
                pay_status: verificationResponse.pay_status,
                status_title: verificationResponse.status_title,
                payment_type: verificationResponse.payment_type,
                amount: verificationResponse.amount,
                transactionId,
            };
        }
        else {
            throw new Error("Payment is not marked as cancelled by AamarPay");
        }
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// =====================Export services=============================
exports.paymentServices = {
    paymentVerify,
    paymentFail,
    paymentCancel
};
