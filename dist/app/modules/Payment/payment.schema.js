"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true, },
    paymentMethod: { type: String, required: true, },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.Pending,
        required: true,
    },
    transactionId: { type: String, },
}, {
    timestamps: true,
});
const PaymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = PaymentModel;
