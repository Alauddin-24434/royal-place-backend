import { Request, Response } from "express";
import { cancelPredictService } from "./cancel.predict.service";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";

export const getBookingCancelPredictionController = catchAsyncHandeller(
    async (req: Request, res: Response) => {

        const data = await cancelPredictService.getBookedRoomsWithCancelPrediction();

        res.status(200).json({
            success: true,
            data,
        });

    }
);


export const cancelPredictController={
    getBookingCancelPredictionController
}
