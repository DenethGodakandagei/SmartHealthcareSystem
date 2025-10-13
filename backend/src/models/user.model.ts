import mongoose, { Schema  } from "mongoose";
import { IUser } from "../interfaces/user.interface.js";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["doctor", "staff", "manager", "patient"],
    default: "patient",
  },
});

export default mongoose.model<IUser>("User", userSchema);