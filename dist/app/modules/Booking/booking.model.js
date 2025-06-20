"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("./booking.interface");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    rooms: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Room", required: true }],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: Object.values(booking_interface_1.PaymentStatus),
        default: booking_interface_1.PaymentStatus.Pending,
        required: true,
    },
    bookingUser: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
    },
    services: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "Service", required: false },
    ],
    transactionId: { type: String, required: true, unique: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    bookingStatus: {
        type: String,
        enum: Object.values(booking_interface_1.BookingStatus),
        default: booking_interface_1.BookingStatus.Pending,
        required: true,
    },
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        required: false,
    },
}, {
    timestamps: true,
});
const BookingModel = (0, mongoose_1.model)("Booking", bookingSchema);
exports.default = BookingModel;
