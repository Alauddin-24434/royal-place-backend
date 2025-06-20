import { Types } from "mongoose";

export interface ITestimonial{
    userId:Types.ObjectId;
    name:string;
    image: string;
    review: string;

}