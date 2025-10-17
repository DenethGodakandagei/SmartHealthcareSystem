import { Types } from "mongoose";

export interface IAppointment {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  appointmentDate: Date;
  timeSlot: {
    start: string;
    end: string;
  };
  reasonForVisit?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  payment: {
    amount: number;
    status: "Pending" | "Paid" | "Refunded";
    transactionId?: string;
  };
  reference?: string; // ✅ Add this line
}
