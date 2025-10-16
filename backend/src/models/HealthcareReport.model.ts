// models/HealthcareReport.ts
import mongoose, { Schema, Document } from "mongoose";
import { IHealthcareReport } from "../interfaces/HealthcareReport";

export interface IHealthcareReportDocument extends IHealthcareReport, Document {}

const MedicationSchema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  duration: { type: String },
});

const LabResultSchema = new Schema({
  test: { type: String, required: true },
  result: { type: String },
  normalRange: { type: String },
  interpretation: { type: String },
});

const DoctorInfoSchema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String },
  licenseNumber: { type: String },
  signature: { type: String },
});

const HealthcareReportSchema = new Schema(
  {
    patientInfo: {
      patientName: { type: String, required: true },
      patientId: { type: String, required: true },
      age: { type: String },
      gender: { type: String },
      dateOfBirth: { type: String },
      contactNumber: { type: String },
      address: { type: String },
    },
    vitalSigns: {
      bloodPressure: { type: String },
      heartRate: { type: String },
      respiratoryRate: { type: String },
      temperature: { type: String },
      oxygenSaturation: { type: String },
      height: { type: String },
      weight: { type: String },
    },
    diagnosis: {
      primaryDiagnosis: { type: String },
      secondaryDiagnosis: { type: String },
      icdCode: { type: String },
      notes: { type: String },
    },
    medications: [MedicationSchema],
    labResults: [LabResultSchema],
    reportDate: { type: String, required: true },
    doctorInfo: DoctorInfoSchema,
  },
  { timestamps: true }
);

export default mongoose.models.HealthcareReport ||
  mongoose.model<IHealthcareReportDocument>(
    "HealthcareReport",
    HealthcareReportSchema
  );
