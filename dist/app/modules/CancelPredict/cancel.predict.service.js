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
exports.cancelPredictService = void 0;
const booking_interface_1 = require("../Booking/booking.interface");
const booking_schema_1 = __importDefault(require("../Booking/booking.schema"));
const getBookedRoomsWithCancelPrediction = () => __awaiter(void 0, void 0, void 0, function* () {
    // ১. সব booked বুকিং নিয়ে আসো
    const bookedBookings = yield booking_schema_1.default.find({ bookingStatus: booking_interface_1.BookingStatus.Cancelled })
        .populate('rooms') // যদি rooms ডিটেইলস লাগে
        .populate('userId'); // ইউজার ডিটেইলস লাগলে
    console.log("booking", bookedBookings);
    // ২. প্রতিটি বুকিং এর ইউজার আইডি নিয়ে cancel risk ML মডেল কল করো
    // const results: BookingWithPrediction[] = [];
    // for (const booking of bookedBookings) {
    //     // userId কে স্ট্রিং এ কনভার্ট করো (যদি ObjectId হয়)
    //     const userIdStr = booking.userId.toString();
    //     // এখানে তোমার cancel history নিয়ে ML মডেল কল করবে
    //     // আমি ধরে নিচ্ছি getCancelRiskForUser(userIdStr) মডেল কল করছে এবং score দিচ্ছে
    //     const cancelRiskScore = await getCancelRiskForUser(userIdStr);
    //     results.push({
    //         booking,
    //         cancelRiskScore,
    //     });
    // }
    // return results;
    return bookedBookings;
});
exports.cancelPredictService = {
    getBookedRoomsWithCancelPrediction
};
