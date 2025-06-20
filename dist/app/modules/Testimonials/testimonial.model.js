"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const testimonialSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Name is required"] },
    image: { type: String, required: [true, "Image is required"] },
    review: { type: String, required: [true, "Image is required"] },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
const testimonialModel = (0, mongoose_1.model)("Testimonial", testimonialSchema);
exports.default = testimonialModel;
