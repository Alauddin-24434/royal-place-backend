import { AppError } from "../../error/appError";
import { Iamenities } from "./amenities.interface";
import AmenitiesModel from "./amenities.model";

// ---------------------------Create Amenity-------------------------------
export const createAmenity = async (amenityData: Iamenities) => {

    const isAmenityExist = await AmenitiesModel.findOne({ name: amenityData.name });
    if (isAmenityExist) {
        throw new AppError("Amenity with this name already exists!", 409);
    }

    const newAmenity = await AmenitiesModel.create(amenityData);
    return newAmenity;  

}

// -------------------------------Get All Amenities-----------------

export const getAllAmenities = async () => {
    return AmenitiesModel.find({ isActive: true });
};


// ------------------------------- exporting service methods--------------------------------
export const amenitiesService = {
    createAmenity,  
    getAllAmenities,
};