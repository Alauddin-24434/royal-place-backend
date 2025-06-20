"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const amenitiesSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});
const AmenitiesModel = (0, mongoose_1.model)("Amenities", amenitiesSchema);
// Export Mongoose model
exports.default = AmenitiesModel;
