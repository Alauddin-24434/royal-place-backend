import { model, Schema } from "mongoose";
import { ITestimonial } from "./testimonial.interfce";


const testimonialSchema = new Schema<ITestimonial>({
    name: { type: String, required: [true, "Name is required"] },
    image: { type: String, required: [true, "Image is required"] },
    review: { type: String, required: [true, "Image is required"] },
    userId: { type: Schema.Types.ObjectId, ref: "User" },

})



const testimonialModel= model <ITestimonial>("Testimonial", testimonialSchema);
export default testimonialModel;