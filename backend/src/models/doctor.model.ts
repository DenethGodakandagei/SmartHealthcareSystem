import mongoose, { Schema } from "mongoose";
import { IDoctor } from "../interfaces/doctor.interface";

const doctorSchema = new Schema<IDoctor>(
  {userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    doctorName: {
      type: String,
      requred: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    availableDays: {
      type: [String], // e.g. ["Monday", "Wednesday", "Friday"]
      required: true,
    },
    availableTimeSlots: {
      type: [
        {
          start: { type: String, required: true }, // e.g. "09:00 AM"
          end: { type: String, required: true },   // e.g. "01:00 PM"
        },
      ],
      required: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String, // store image URL or path
      default: "",
    },
    ratings: {
      type: [
        {
          patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
          rating: { type: Number, min: 1, max: 5 },
          comment: { type: String, trim: true },
        },
      ],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>("Doctor", doctorSchema);
