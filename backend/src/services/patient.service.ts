import Patient from "../models/patient.model.js";
import type { IPatient } from "../interfaces/patient.interfaces.js";

export class PatientService {
  async getAllPatients(): Promise<IPatient[]> {
    return await Patient.find().populate("userId", "name email role");
  }

  async getPatientById(id: string): Promise<IPatient | null> {
    return await Patient.findById(id).populate("userId");
  }
  async getPatientByUserId(userId: string): Promise<IPatient | null> {
    return await Patient.findOne({ userId }).populate("userId", "name email role");
  }

  async updatePatient(id: string, data: Partial<IPatient>): Promise<IPatient | null> {
    return await Patient.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePatient(id: string): Promise<IPatient | null> {
    return await Patient.findByIdAndDelete(id);
  }
}
