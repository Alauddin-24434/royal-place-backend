import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";

import { AppError } from "../../error/appError";
import { dashboardService } from "./dashboard.service";

const getDashboardData = catchAsyncHandeller(async (req: Request, res: Response) => {
  const role = req.query.role as string;
  const userId = req.user?._id; // যদি auth middleware থাকে
  console.log(role);
  console.log(userId)

  if (!role) {
    throw new AppError ("Role is required", 400 );
  }

  const data = await dashboardService.getStatsByRole(role, userId);

  res.status(200).json({
    success: true,
    ...data,
  });
});

export const dashboardController = {
  getDashboardData,
};
