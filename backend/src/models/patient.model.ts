import mongoose, {  Schema } from "mongoose";
import { IPatient } from "../interfaces/patient.interfaces.js";

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
