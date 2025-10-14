import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  staffId?: mongoose.Types.ObjectId; // for confirmations
  scheduledAt: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reference: string;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "User" },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    reference: { type: String, required: true, unique: true },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
