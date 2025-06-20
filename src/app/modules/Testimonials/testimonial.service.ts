import { ITestimonial } from "./testimonial.interfce";
import testimonialModel from "./testimonial.model";

const testimonialCreate = async (data: ITestimonial) => {

    const testimonial = await testimonialModel.create(data);
    return testimonial;
}


const findAllTestimonial = async () => {
    const testimonial = await testimonialModel.find().sort({ _id: -1 });
    return testimonial;
}


export const testimonialServices = {
    testimonialCreate,
    findAllTestimonial
}