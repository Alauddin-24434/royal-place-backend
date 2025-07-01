"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoute = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
// ✅ Create a new booking
router.post("/", booking_controller_1.bookingController.initiateBooking);
// ✅ Cancel booking (better: PATCH + ID)
router.patch("/:id", booking_controller_1.bookingController.cancelBooking);
// ✅ Get all bookings (filter by query)
router.get("/", booking_controller_1.bookingController.getFilteredBookings);
// ✅ Get booking by ID (or check availability if that's the actual intent)
router.get("/:id", booking_controller_1.bookingController.checkAvailableRoomsById);
exports.bookingRoute = router;
