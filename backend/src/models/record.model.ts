import mongoose, { Schema } from "mongoose";
import { IRecord } from "../interfaces/record.interface.js";


const recordSchema = new Schema<IRecord>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    treatment: {
      diagnosis: { type: String, required: true },
      notes: String,
      procedures: String,
      updatedAt: { type: Date, default: Date.now },
    },
    prescription: {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRecord>("Record", recordSchema);
