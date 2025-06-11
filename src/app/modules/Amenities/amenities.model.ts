import { model, Schema } from "mongoose";
import { Iamenities } from "./amenities.interface";

const amenitiesSchema = new Schema<Iamenities>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    }, {
    timestamps: true, 
});



const AmenitiesModel = model <Iamenities>("Amenities", amenitiesSchema);
// Export Mongoose model
export default AmenitiesModel;