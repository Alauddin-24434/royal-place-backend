import express from "express";
import { cancelPredictController } from "./cancelpredict.controller";

const router = express.Router();

// Predict cancellation risk for currently booked rooms
router.get("/predict-cancel-risk", cancelPredictController.getBookingCancelPredictionController);

export const cancelPredictRoute= router;
