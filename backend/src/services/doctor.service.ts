import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import type { IDoctor } from "../interfaces/doctor.interface.js";
import type { IUser } from "../interfaces/user.interface.js";

export class DoctorService {
  // Create doctor + user together
  async createDoctor(data: any): Promise<IDoctor> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 1: Check if email already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("Email is already registered.");
      }

      // Step 2: Create User
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user: IUser = await User.create(
        [
          {
            name: data.doctorName,
            email: data.email,
            password: hashedPassword,
            role: "doctor",
          },
        ],
        { session }
      ).then((res) => res[0]);

      // Step 3: Create Doctor profile
      const doctorData: Partial<IDoctor> = {
        userId: user._id,
        doctorName: data.doctorName,
        specialization: data.specialization,
        experienceYears: data.experienceYears,
        qualification: data.qualification,
        consultationFee: data.consultationFee,
        contactNumber: data.contactNumber,
        availableDays: data.availableDays,
        availableTimeSlots: data.availableTimeSlots,
        bio: data.bio,
        hospitalName: data.hospitalName,
        profileImage: data.profileImage,
        ratings: [],
        isAvailable: true,
      };

      const doctor = await Doctor.create([doctorData], { session }).then((res) => res[0]);

      await session.commitTransaction();
      session.endSession();

      return doctor;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Get all doctors
  async getAllDoctors(): Promise<IDoctor[]> {
    return await Doctor.find().populate("userId", "name email role").sort({ createdAt: -1 });
  }

  // Get doctor by ID
  async getDoctorById(id: string): Promise<IDoctor | null> {
    return await Doctor.findById(id).populate("userId", "name email role");
  }

  // Get doctors by specialization
  async getDoctorsBySpecialization(specialization: string): Promise<IDoctor[]> {
    return await Doctor.find({
      specialization: { $regex: specialization, $options: "i" },
    }).populate("userId", "name email").sort({ doctorName: 1 });
  }
// In DoctorService
async getDoctorByUserId(userId: string): Promise<IDoctor | null> {
  return await Doctor.findOne({ userId }).populate("userId", "name email role");
}

  // Update doctor details
  async updateDoctor(id: string, data: Partial<IDoctor>): Promise<IDoctor | null> {
    return await Doctor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // Delete doctor (and user)
  async deleteDoctor(id: string): Promise<{ message: string }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const doctor = await Doctor.findById(id).session(session);
      if (!doctor) throw new Error("Doctor not found");

      // Delete both doctor and user
      await Doctor.deleteOne({ _id: id }).session(session);
      await User.deleteOne({ _id: doctor.userId }).session(session);

      await session.commitTransaction();
      session.endSession();

      return { message: "Doctor and associated user deleted successfully" };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Search doctors
  async searchDoctors(query: { specialization?: string; hospitalName?: string }): Promise<IDoctor[]> {
    const filter: Record<string, any> = {};

    if (query.specialization) {
      filter.specialization = { $regex: query.specialization, $options: "i" };
    }
    if (query.hospitalName) {
      filter.hospitalName = { $regex: query.hospitalName, $options: "i" };
    }

    return await Doctor.find(filter).populate("userId", "name email");
  }
}
