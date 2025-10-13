import mongoose, { Schema, Document } from "mongoose";

export interface IRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  treatment: {
    diagnosis: string;
    notes: string;
    procedures: string;
    updatedAt: Date;
  };
  prescription: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    updatedAt: Date;
  };
}
