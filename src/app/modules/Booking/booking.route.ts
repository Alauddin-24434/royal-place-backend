import express from "express";
import { bookingController } from "./booking.controller";

const router = express.Router();

// ✅ Create a new booking
router.post("/",  bookingController.initiateBooking);

// ✅ Cancel booking (better: PATCH + ID)
router.patch("/:id",  bookingController.cancelBooking);

// ✅ Get all bookings (filter by query)
router.get("/",  bookingController.getFilteredBookings);

// ✅ Get booking by ID (or check availability if that's the actual intent)
router.get("/:id", bookingController.checkAvailableRoomsById);

export const bookingRoute= router;
