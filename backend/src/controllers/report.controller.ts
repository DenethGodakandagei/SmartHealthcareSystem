import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * Create (Generate) a new report
 */
export const generateReport = async (req: Request, res: Response) => {
  try {
    const { reportType, department, startDate, endDate, metrics, scheduleType } = req.body;

    const report = await prisma.report.create({
      data: {
        reportType,
        department,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        metrics: JSON.stringify(metrics),
        scheduleType,
      },
    });

    res.status(201).json(report);
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ message: "Failed to generate report", error: err });
  }
};

/**
 * Get all reports
 */
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports", error: err });
  }
};

/**
 * Get a single report by ID
 */
export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({ where: { id: Number(id) } });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch report", error: err });
  }
};

/**
 * Update a report
 */
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reportType, department, startDate, endDate, metrics, scheduleType } = req.body;

    const existingReport = await prisma.report.findUnique({ where: { id: Number(id) } });
    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        reportType,
        department,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        metrics: JSON.stringify(metrics),
        scheduleType,
      },
    });

    res.status(200).json(updatedReport);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update report", error: err });
  }
};

/**
 * Delete a report
 */
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingReport = await prisma.report.findUnique({ where: { id: Number(id) } });
    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    await prisma.report.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete report", error: err });
  }
};
