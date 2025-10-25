import express from "express";

import { bookingController } from "../../../controllers/v1/bookingControllers/booking.controllers";

const router = express.Router();


router.post("/",bookingController.initiateBooking
);


router.patch("/:id",bookingController.cancelBooking
);


router.get("/", bookingController.getFilteredBookings);


router.get("/:roomId", bookingController.checkAvailableRoomsById);
router.get("/userId/:id", bookingController.checkbookingRoomsByUserId);

export const bookingRoute = router;