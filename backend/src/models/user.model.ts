import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; // ✅ Explicitly define _id type
  name: string;
  email: string;
  password: string;
  role: "doctor" | "staff" | "manager" | "patient";
}

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
