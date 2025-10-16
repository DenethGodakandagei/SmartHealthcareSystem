// services/HealthcareReportService.ts
import HealthcareReport from "../models/HealthcareReport.model";
import { IHealthcareReport } from "../interfaces/HealthcareReport";
import { Document } from "mongoose";

type IHealthcareReportDocument = IHealthcareReport & Document;

export class HealthcareReportService {
  async createReport(data: IHealthcareReport): Promise<IHealthcareReportDocument> {
    const report = new HealthcareReport(data);
    return report.save();
  }

  async getAllReports(): Promise<IHealthcareReportDocument[]> {
    return HealthcareReport.find().sort({ createdAt: -1 });
  }

  async getReportById(id: string): Promise<IHealthcareReportDocument | null> {
    return HealthcareReport.findById(id);
  }

  async updateReport(id: string, data: Partial<IHealthcareReport>): Promise<IHealthcareReportDocument | null> {
    return HealthcareReport.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteReport(id: string): Promise<IHealthcareReportDocument | null> {
    return HealthcareReport.findByIdAndDelete(id);
  }
}
