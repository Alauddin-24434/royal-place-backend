"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialRoute = void 0;
const express_1 = require("express");
const testimonial_controller_1 = require("./testimonial.controller");
const router = (0, express_1.Router)();
// ===========================Create a new testimonial==============================
router.post('/testimonial', testimonial_controller_1.testimonialController.testimonialCreate);
// =========================Get all testimonials==============================
router.get('/testimonials', testimonial_controller_1.testimonialController.findAllTestimonials);
//======================= Get testimonials by specific room ID===============================
router.get("/testimonial/:id", testimonial_controller_1.testimonialController.findTestimonialsByRoomId);
// =======================Delete testimonial by ID (hard delete)==============================
router.delete("/testimonial/:id", testimonial_controller_1.testimonialController.deleteTestimonialById); // 👈 added line
exports.testimonialRoute = router;
