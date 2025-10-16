import mongoose, { Schema, Document } from 'mongoose'
import { HealthcareReport } from '../interfaces/HealthcareReport'

interface HealthcareReportDocument extends HealthcareReport, Document {}

const MedicationSchema = new Schema(
  {
    medicationName: String,
    dosage: String,
    frequency: String,
    duration: String,
  },
  { _id: false }
)

const LabResultSchema = new Schema(
  {
    testName: String,
    result: String,
    normalRange: String,
    interpretation: String,
  },
  { _id: false }
)

const HealthcareReportSchema = new Schema(
  {
    patientName: { type: String, required: true },
    patientId: { type: String, required: true, unique: true },
    age: Number,
    gender: String,
    dateOfBirth: Date,
    contactNumber: String,
    address: String,

    bloodPressure: String,
    heartRate: String,
    respiratoryRate: String,
    temperature: String,
    oxygenSaturation: String,
    height: String,
    weight: String,

    primaryDiagnosis: String,
    secondaryDiagnosis: String,
    icdCode: String,
    clinicalNotes: String,

    medications: [MedicationSchema],
    labResults: [LabResultSchema],

    reportDate: { type: Date, default: Date.now },
    createdBy: String,
  },
  { timestamps: true }
)

export default mongoose.model<HealthcareReportDocument>('healthcare_reports', HealthcareReportSchema)
