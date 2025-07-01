"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoute = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = express_1.default.Router();
router.post("/", rateLimiter_1.strictLimiter, booking_controller_1.bookingController.initiateBooking);
router.patch("/:id", rateLimiter_1.strictLimiter, booking_controller_1.bookingController.cancelBooking);
router.get("/", booking_controller_1.bookingController.getFilteredBookings);
router.get("/:id", booking_controller_1.bookingController.checkAvailableRoomsById);
exports.bookingRoute = router;
