import { AppError } from "../../error/appError";
import { IService } from "./service.intercae";
import ServiceModel from "./service.schema";

// =============================================Create Service=====================================================
const crateService = async (serviceData: IService) => {
  const extistingService = await ServiceModel.findOne({
    name: serviceData.name,
  });
  if (extistingService) {
    throw new AppError("Service already exists for this room", 400);
  }

  const cratedService = await ServiceModel.create(serviceData);
  return cratedService;
};


// ===============================================Find all Services=======================================================
const getAllServices = async () => {
  const services = await ServiceModel.find({ isActive: true });
  return services;
};

// ==================================================Delete service by Id=======================================================

const deleteService = async (id: string) => {
  const extistingService = await ServiceModel.findOne({
    _id: id,
  });
  if (!extistingService) {
    throw new AppError("Service does not exist", 400);
  }

  const deleteService= await ServiceModel.deleteOne({_id:id})
  return deleteService;

};

// ==============================export service=============================
export const serviceServices = {
  crateService,
  getAllServices,
  deleteService
};
