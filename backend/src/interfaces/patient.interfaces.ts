import mongoose, { Document } from "mongoose";

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
