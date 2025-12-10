import express, { Router } from "express";

import { paymentController } from "../../controllers/v1/paymentControllers/payment.controllers";

const router = express.Router();

// payment sucess
router.post(
  "/success",

  paymentController.paymentSuccess
);
// payment fail
router.post(
  "/fail",

  paymentController.paymentFail
);

// payment fail
router.get(
  "/cancel",

  paymentController.paymentCancel
);
// get all paymnets
router.get("/", paymentController.getPayments);
// get payments by User id
router.get("/:id", paymentController.getPaymentsByUserId);

export const paymentRoute = router;
