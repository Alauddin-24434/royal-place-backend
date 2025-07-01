import express from "express";
import { paymentController } from "./payment.controller";
import { strictLimiter } from "../../middleware/rateLimiter";

const router = express.Router();


router.post(
    "/verify-payment",
   
    strictLimiter,
    paymentController.paymentSuccess
);

router.post(
    "/fail",
   
    strictLimiter,
    paymentController.paymentFail
);

router.post(
    "/cancel",
   
    strictLimiter,
    paymentController.paymentCancel
);

export const paymentRoute = router;
