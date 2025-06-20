"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPredictRoute = void 0;
const express_1 = __importDefault(require("express"));
const cancelpredict_controller_1 = require("./cancelpredict.controller");
const router = express_1.default.Router();
// Predict cancellation risk for currently booked rooms
router.get("/predict-cancel-risk", cancelpredict_controller_1.cancelPredictController.getBookingCancelPredictionController);
exports.cancelPredictRoute = router;
