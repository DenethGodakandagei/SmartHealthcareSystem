import mongoose ,{ Types } from "mongoose";

export interface IDoctor {
  userId: mongoose.Types.ObjectId;
  doctorName: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  consultationFee: number;
  contactNumber: string;
  availableDays: string[];
  availableTimeSlots: {
    start: string;
    end: string;
  }[];
  bio?: string;
  hospitalName: string;
  profileImage?: string;
  ratings?: {
    patientId: Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  isAvailable: boolean;
}
