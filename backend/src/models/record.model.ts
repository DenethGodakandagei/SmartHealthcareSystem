import mongoose, {  Schema } from "mongoose";
import { IRecord } from "../interfaces/record.interface.js";

const recordSchema = new Schema<IRecord>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
  treatment: {
    diagnosis: { type: String, required: true },
    notes: { type: String, required: true },
    procedures: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  prescription: {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
}, { timestamps: true });

export default mongoose.model<IRecord>("Record", recordSchema);