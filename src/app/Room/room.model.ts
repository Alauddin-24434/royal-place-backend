import mongoose, { Schema } from "mongoose";
import { Iroom, RoomType } from "./room.interface";

// Room schema definition
const RoomSchema = new Schema<Iroom>(
  {
    roomNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(RoomType),
      required: true,
    },
    pricePerNight: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createdAt, updatedAt auto managed
  }
);

// Export Mongoose model
const RoomModel = mongoose.model<Iroom>("Room", RoomSchema);
export default RoomModel;