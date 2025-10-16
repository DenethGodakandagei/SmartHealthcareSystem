import Record from "../models/record.model";
import { Types } from "mongoose";
import { IRecord } from "../interfaces/record.interface";

interface RecordData {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  treatment: {
    diagnosis: string;
    notes: string;
    procedures: string;
  };
  prescription: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
}

interface UpdateRecordData {
  treatment?: {
    diagnosis: string;
    notes: string;
    procedures: string;
  };
  prescription?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
}

class RecordService {
  // Get all records
  async getAllRecords(): Promise<IRecord[]> {
    return await Record.find()
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .populate("appointmentId", "appointmentDate timeSlot");
  }

  // Get records by patient
  async getRecordsByPatient(patientId: string): Promise<IRecord[]> {
    if (!Types.ObjectId.isValid(patientId)) throw new Error("Invalid patientId");
    return await Record.find({ patientId: new Types.ObjectId(patientId) })
      .populate("doctorId", "name")
      .populate("appointmentId", "appointmentDate timeSlot");
  }

  // Add new record
  async addRecord(data: RecordData): Promise<IRecord> {
    if (!Types.ObjectId.isValid(data.patientId)) throw new Error("Invalid patientId");
    if (!Types.ObjectId.isValid(data.doctorId)) throw new Error("Invalid doctorId");
    if (!Types.ObjectId.isValid(data.appointmentId)) throw new Error("Invalid appointmentId");

    const record = new Record({
      patientId: new Types.ObjectId(data.patientId),
      doctorId: new Types.ObjectId(data.doctorId),
      appointmentId: new Types.ObjectId(data.appointmentId),
      treatment: { ...data.treatment, updatedAt: new Date() },
      prescription: { ...data.prescription, updatedAt: new Date() },
    });

    return await record.save();
  }

  // Update record
  async updateRecord(recordId: string, updateData: UpdateRecordData): Promise<IRecord | null> {
    if (!Types.ObjectId.isValid(recordId)) throw new Error("Invalid recordId");

    const updatePayload: any = {};
    if (updateData.treatment) updatePayload.treatment = { ...updateData.treatment, updatedAt: new Date() };
    if (updateData.prescription) updatePayload.prescription = { ...updateData.prescription, updatedAt: new Date() };

    return await Record.findByIdAndUpdate(recordId, updatePayload, { new: true });
  }

  // Delete record
  async deleteRecord(recordId: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(recordId)) throw new Error("Invalid recordId");

    const deleted = await Record.findByIdAndDelete(recordId);
    if (!deleted) throw new Error("Record not found");

    return { message: "Record deleted successfully" };
  }
}

export default new RecordService();
