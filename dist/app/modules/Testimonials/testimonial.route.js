"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialRoute = void 0;
const express_1 = require("express");
const testimonial_controller_1 = require("./testimonial.controller");
const router = (0, express_1.Router)();
router.post('/testimonial', testimonial_controller_1.testimonialController.testimonialCreate);
router.get('/testimonials', testimonial_controller_1.testimonialController.findAllTestimonials);
exports.testimonialRoute = router;
