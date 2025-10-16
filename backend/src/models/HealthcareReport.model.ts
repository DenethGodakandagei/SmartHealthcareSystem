// models/HealthcareReport.ts
import mongoose, { Schema } from "mongoose";
import { IHealthcareReport } from "../interfaces/HealthcareReport";

const medicationSchema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  duration: { type: String },
});

const doctorInfoSchema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String },
  licenseNumber: { type: String },
  signature: { type: String },
});

const patientInfoSchema = new Schema({
  patientName: { type: String, required: true },
  patientId: { type: String, required: true },
  age: { type: String },
  gender: { type: String },
  dateOfBirth: { type: String },
  contactNumber: { type: String },
  address: { type: String },
});

const vitalSignsSchema = new Schema({
  bloodPressure: { type: String },
  heartRate: { type: String },
  respiratoryRate: { type: String },
  temperature: { type: String },
  oxygenSaturation: { type: String },
  height: { type: String },
  weight: { type: String },
});

const healthcareReportSchema = new Schema<IHealthcareReport>(
  {
    patientInfo: { type: patientInfoSchema, required: true },
    vitalSigns: { type: vitalSignsSchema },
    medications: { type: [medicationSchema], default: [] },
    doctorInfo: { type: doctorInfoSchema, required: true },
    reportDate: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.HealthcareReport ||
  mongoose.model<IHealthcareReport>("HealthcareReport", healthcareReportSchema);
