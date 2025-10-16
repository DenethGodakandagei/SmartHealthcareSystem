// controllers/HealthcareReportController.ts
import { Request, Response } from "express";
import { HealthcareReportService } from "../services/HealthcareReport.service";

const service = new HealthcareReportService();

export class HealthcareReportController {
  async createReport(req: Request, res: Response) {
    try {
      const report = await service.createReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to create report", details: error });
    }
  }

  async getAllReports(req: Request, res: Response) {
    try {
      const reports = await service.getAllReports();
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports", details: error });
    }
  }

  async getReportById(req: Request, res: Response) {
    try {
      const report = await service.getReportById(req.params.id);
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch report", details: error });
    }
  }

  async updateReport(req: Request, res: Response) {
    try {
      const report = await service.updateReport(req.params.id, req.body);
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to update report", details: error });
    }
  }

  async deleteReport(req: Request, res: Response) {
    try {
      const report = await service.deleteReport(req.params.id);
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete report", details: error });
    }
  }
}
