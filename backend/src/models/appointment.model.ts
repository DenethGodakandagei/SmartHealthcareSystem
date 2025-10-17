// import mongoose, { Schema } from "mongoose";
// import { IAppointment } from "../interfaces/appointment.interfaces.js";

// const appointmentSchema = new Schema<IAppointment>(
//   {
//     doctorId: {
//       type: Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: true,
//     },
//     patientId: {
//       type: Schema.Types.ObjectId,
//       ref: "Patient",
//       required: true,
//     },
//     appointmentDate: {
//       type: Date,
//       required: true,
//     },
//     timeSlot: {
//       start: { type: String, required: true }, // e.g., "10:00 AM"
//       end: { type: String, required: true },   // e.g., "10:30 AM"
//     },
//     reasonForVisit: {
//       type: String,
//       trim: true,
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
//       default: "Pending",
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//     payment: {
//       amount: { type: Number,},
//       status: {
//         type: String,
//         enum: ["Pending", "Paid", "Refunded"],
//         default: "Pending",
//       },
//       transactionId: { type: String },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model<IAppointment>("Appointment", appointmentSchema);


import mongoose, { Schema } from "mongoose";
import { IAppointment } from "../interfaces/appointment.interfaces.js";

const appointmentSchema = new Schema<IAppointment>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    reasonForVisit: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    payment: {
      amount: { type: Number },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Refunded"],
        default: "Pending",
      },
      transactionId: { type: String },
    },
    // Optional safe unique reference
    reference: {
      type: String,
      unique: true,
      default: () => `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);

