import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../utils/catchAsyncHandeller";
import { serviceServices } from "./service.services";


// =============================================Create Service=====================================================
const createService = catchAsyncHandeller(
  async (req: Request, res: Response) => {
 
    const imageUrl = req.file?.path;

    const serviceData = {
      ...req.body,
      image: imageUrl,
      pricePerDay: Number(req.body.pricePerDay),
    };

    const service = await serviceServices.crateService(serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data:service,
    });
  }
);


// ===============================================Find all Services=======================================================

const getAllServices = catchAsyncHandeller(
  async (req: Request, res: Response) => {
    const services = await serviceServices.getAllServices();
    res.status(200).json({
      success: true,
      message: "All services fetched successfully",
     data: services,
    });
  }
);

// ==================================================Delete service by Id=======================================================
const deleteService = catchAsyncHandeller(
  async (req: Request, res: Response) => {
   const service= serviceServices.deleteService(req.params.id)
    res.status(200).json({
      success: true,
      message: "Service delete successfully",
     data: service,
    });
  }
);


// ==============================export controller=============================
export const serviceController = {
  createService,
  getAllServices,
  deleteService
};
