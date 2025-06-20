"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoute = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/initiate", booking_controller_1.bookingController.initiateBooking);
router.get("/filter-bookings", booking_controller_1.bookingController.getFilteredBookings);
router.get("/booking-check/:id", booking_controller_1.bookingController.checkAvailableRooms);
router.post("/cancel-booking", booking_controller_1.bookingController.cancelBooking);
exports.bookingRoute = router;
