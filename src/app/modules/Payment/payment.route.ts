import express from "express";
import { paymentController } from "./payment.controller";

const router = express.Router();


router.post("/verify-payment", paymentController.paymentSuccess);
router.post("/payment/fail", paymentController.paymentFail);
router.post("/payment/cancel", paymentController.paymentCancel );

export const paymentRoute= router;
