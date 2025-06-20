"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("../Booking/booking.interface");
const paymentSchema = new mongoose_1.Schema({
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: Object.values(booking_interface_1.PaymentStatus),
        default: booking_interface_1.PaymentStatus.Pending,
        required: true,
    },
    transactionId: { type: String, trim: true },
}, {
    timestamps: true,
});
const PaymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = PaymentModel;
