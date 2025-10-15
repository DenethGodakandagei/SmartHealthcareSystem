import mongoose from "mongoose";

export interface IReport {
  reportType: string;                        // e.g. "Appointment Summary"
  department?: string;                       // optional
  generatedBy: mongoose.Types.ObjectId;      // ref -> User
  startDate: Date;
  endDate: Date;
  metrics: Record<string, any>;              // analytics summary
  relatedDoctors?: mongoose.Types.ObjectId[];
  relatedPatients?: mongoose.Types.ObjectId[];
  scheduleType?: string;                     // e.g. "Daily", "Weekly"
  status: "Pending" | "Generated" | "Failed";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
