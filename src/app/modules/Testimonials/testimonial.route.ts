import { Router } from "express";
import { testimonialController } from "./testimonial.controller";

const router = Router();

// ===========================Create a new testimonial==============================
router.post('/testimonial', testimonialController.testimonialCreate);

// =========================Get all testimonials==============================
router.get('/testimonials', testimonialController.findAllTestimonials);

//======================= Get testimonials by specific room ID===============================
router.get("/testimonial/:roomId", testimonialController.findTestimonialsByRoomId);

export const testimonialRoute = router;
