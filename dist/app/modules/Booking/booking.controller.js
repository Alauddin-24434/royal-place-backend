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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const booking_services_1 = require("./booking.services");
// =====================================================Initiate Booking========================================
const initiateBooking = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = req.body;
    const result = yield booking_services_1.bookingServices.bookingInitialization(bookingData);
    res.status(200).json({
        success: true,
        payment_url: result.payment_url,
        message: "Booking Initiate",
        transactionId: result.transactionId,
        data: bookingData,
    });
}));
// ========================================Avalabe rooms For Booking=================================================
const checkAvailableRoomsById = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blockedDates = yield booking_services_1.bookingServices.getBookedDatesForRoom(id);
    res.status(200).json({
        success: true,
        data: blockedDates,
    });
}));
// =====================================filter booking===========================================
const getFilteredBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_services_1.bookingServices.filterBookings(req.query);
    res.status(200).json(result);
});
const cancelBooking = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.body;
    const result = yield booking_services_1.bookingServices.cancelBookingService(transactionId);
    res.status(200).json({
        message: "Booking cancelled successfully",
        success: true,
        booking: result.booking,
    });
}));
// ========================Exxport Controller=============================
exports.bookingController = {
    initiateBooking,
    checkAvailableRoomsById,
    cancelBooking,
    getFilteredBookings
};
