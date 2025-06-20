import express from "express";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/initiate", bookingController.initiateBooking);


router.get("/filter-bookings", bookingController.getFilteredBookings);
router.get("/booking-check/:id", bookingController.checkAvailableRooms);
router.post("/cancel-booking", bookingController.cancelBooking);

export const bookingRoute= router;
