import Record from "../models/record.model.js";
import type { IRecord } from "../interfaces/record.interface.js";

export class RecordService {
  async getAllRecords(): Promise<IRecord[]> {
    return await Record.find().populate("patientId doctorId");
  }

  async getRecordById(id: string): Promise<IRecord | null> {
    return await Record.findById(id).populate("patientId doctorId");
  }

  async createRecord(data: Partial<IRecord>): Promise<IRecord> {
    return await Record.create(data);
  }

  async updateRecord(id: string, data: Partial<IRecord>): Promise<IRecord | null> {
    return await Record.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteRecord(id: string): Promise<IRecord | null> {
    return await Record.findByIdAndDelete(id);
  }
}
