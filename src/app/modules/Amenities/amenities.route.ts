

import { Router } from "express";
import { amenitiesController } from "./amenities.controller";


const router = Router();

router.post("/create-amenity", amenitiesController.createAmenity);
router.get("/amenities", amenitiesController.getAllAmenities);

export const amenityRoute = router;
