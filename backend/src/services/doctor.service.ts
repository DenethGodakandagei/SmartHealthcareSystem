import Doctor from "../models/doctor.model.ts";
import type { IDoctor } from "../interfaces/doctor.interface.ts";

export class DoctorService {
  // Register a new doctor
  async createDoctor(data: IDoctor): Promise<IDoctor> {
    const doctor = new Doctor(data);
    return await doctor.save(); // MongoDB generates _id automatically
  }

  // Get all doctors
  async getAllDoctors(): Promise<IDoctor[]> {
    return await Doctor.find().sort({ createdAt: -1 });
  }

// Get doctors by specialty
async getDoctorsBySpecialization(specialization: string): Promise<IDoctor[]> {
  // Use $regex and $options: "i" for case-insensitive matching
  return await Doctor.find({
    specialization: { $regex: specialization, $options: "i" }
  }).sort({ doctorName: 1 });
}

  // Get a single doctor by ID
  async getDoctorById(id: string): Promise<IDoctor | null> {
    return await Doctor.findById(id);
  }

  // Update doctor details
  async updateDoctor(id: string, data: Partial<IDoctor>): Promise<IDoctor | null> {
    return await Doctor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // Delete doctor by ID
  async deleteDoctor(id: string): Promise<IDoctor | null> {
    return await Doctor.findByIdAndDelete(id);
  }

  // Search doctors by specialization or hospital name
  async searchDoctors(query: { specialization?: string; hospitalName?: string }): Promise<IDoctor[]> {
    const filter: Record<string, any> = {};

    if (query.specialization) {
      filter.specialization = { $regex: query.specialization, $options: "i" };
    }
    if (query.hospitalName) {
      filter.hospitalName = { $regex: query.hospitalName, $options: "i" };
    }

    return await Doctor.find(filter);
  }
}
