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
exports.getCancelRiskForUser = void 0;
// services/risk.service.ts
const axios_1 = __importDefault(require("axios"));
const booking_schema_1 = __importDefault(require("../../modules/Booking/booking.schema"));
const getCancelRiskForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔢 ইউজার কতবার cancel করেছে
    const pastCancellations = yield booking_schema_1.default.countDocuments({
        userId,
        status: 'cancelled',
    });
    // ✅ ইউজার কতবার সফলভাবে বুক করেছে
    const bookingFrequency = yield booking_schema_1.default.countDocuments({
        userId,
        status: 'booked',
    });
    // 🔁 ML API-তে পাঠানো
    const response = yield axios_1.default.post('http://localhost:8000/predict-cancel-risk', {
        user_id: parseInt(userId.slice(-4), 16),
        past_cancellations: pastCancellations,
        booking_frequency: bookingFrequency,
    });
    return response.data.cancel_risk_percentage;
});
exports.getCancelRiskForUser = getCancelRiskForUser;
