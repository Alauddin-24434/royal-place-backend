import express from "express";
import { bookingController } from "./booking.controller";
import { strictLimiter } from "../../middleware/rateLimiter";

const router = express.Router();


router.post("/",strictLimiter,bookingController.initiateBooking
);


router.patch("/:id",strictLimiter,bookingController.cancelBooking
);


router.get("/", bookingController.getFilteredBookings);


router.get("/check/:id", bookingController.checkAvailableRoomsById);

export const bookingRoute = router;
