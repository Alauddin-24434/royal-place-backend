import { Router } from "express";
import { testimonialController } from "./testimonial.controller";

const router = Router();

// ===========================Create a new testimonial==============================
router.post('/testimonial', testimonialController.testimonialCreate);

// =========================Get all testimonials==============================
router.get('/testimonials', testimonialController.findAllTestimonials);

//======================= Get testimonials by specific room ID===============================
router.get("/testimonial/:id", testimonialController.findTestimonialsByRoomId);
// =======================Delete testimonial by ID (hard delete)==============================
router.delete("/testimonial/:id", testimonialController.deleteTestimonialById); // 👈 added line

export const testimonialRoute = router;
