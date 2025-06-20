import { Schema, model } from "mongoose";
import { IUser, UserRole } from "./user.interface";
import bcrypt from "bcryptjs";

const saltRounds = 12;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ['guest', 'admin', 'receptionist'],
      required: [true, "Role is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashed = await bcrypt.hash(this.password, saltRounds);
    this.password = hashed;
    next();
  } catch (error: any) {
    next(error);
  }
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
