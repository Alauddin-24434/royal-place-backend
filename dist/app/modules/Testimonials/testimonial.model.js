"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const testimonialSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: [true, "UserName is required"] },
    userImage: { type: String, required: [true, "User Image is required"] },
    roomId: { type: String, required: [true, "Room ID is required"] },
    rating: { type: Number, required: [true, "Rating is required"] },
    reviewText: { type: String, required: [true, "Review is required"] },
    reviewDate: { type: String, required: [true, "Review Date is required"] },
}, {
    timestamps: true, // optional: adds createdAt and updatedAt
});
const testimonialModel = (0, mongoose_1.model)("Testimonial", testimonialSchema);
exports.default = testimonialModel;
