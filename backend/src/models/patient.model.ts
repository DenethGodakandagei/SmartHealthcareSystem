import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId; 
  age: number;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  address: string;
  medicalHistory?: string[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

const patientSchema = new Schema<IPatient>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: [String],
    default: [],
  },
  allergies: {
    type: [String],
    default: [],
  },
  emergencyContact: {
    name: String,
    phone: String,
  },
});

export default mongoose.model<IPatient>("Patient", patientSchema);
