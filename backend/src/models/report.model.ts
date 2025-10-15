import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reportType: string;              // e.g. "Appointment Summary", "Revenue", "Doctor Performance"
  department?: string;             // optional: Cardiology, Pediatrics, etc.
  generatedBy: mongoose.Types.ObjectId;  // reference to the User who generated it
  startDate: Date;
  endDate: Date;
  metrics: Record<string, any>;    // key-value data (e.g., totalAppointments, totalRevenue)
  relatedDoctors?: mongoose.Types.ObjectId[]; // doctors involved
  relatedPatients?: mongoose.Types.ObjectId[]; // patients included
  scheduleType?: string;           // e.g. "Daily", "Weekly", "Monthly"
  status: "Pending" | "Generated" | "Failed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reportType: {
      type: String,
      required: [true, "Report type is required"],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    metrics: {
      type: Schema.Types.Mixed,
      default: {},
    },
    relatedDoctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    relatedPatients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    scheduleType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Custom"],
      default: "Custom",
    },
    status: {
      type: String,
      enum: ["Pending", "Generated", "Failed"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReport>("Report", reportSchema);
