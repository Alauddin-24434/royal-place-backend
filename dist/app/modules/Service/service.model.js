"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room", required: true },
    image: { type: String, required: false },
    description: { type: String, default: "" },
    pricePerDay: { type: Number, required: true },
    isServiceFree: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const ServiceModel = (0, mongoose_1.model)("Service", serviceSchema);
exports.default = ServiceModel;
