import { Router } from "express";
import { testimonialController } from "./testimonial.controller";

const router = Router();


router.post('/testimonial', testimonialController.testimonialCreate);
router.get('/testimonials', testimonialController.findAllTestimonials);


export const testimonialRoute = router;
