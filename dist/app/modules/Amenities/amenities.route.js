"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amenityRoute = void 0;
const express_1 = require("express");
const amenities_controller_1 = require("./amenities.controller");
const router = (0, express_1.Router)();
router.post("/create-amenity", amenities_controller_1.amenitiesController.createAmenity);
router.get("/amenities", amenities_controller_1.amenitiesController.getAllAmenities);
exports.amenityRoute = router;
