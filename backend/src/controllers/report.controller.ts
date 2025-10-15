import { Request, Response } from "express";
import Report from "../models/report.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

/**
 * Create (Generate) a new report
 */
export const generateReport = async (req: Request, res: Response) => {
  try {
    const { reportType, department, startDate, endDate, scheduleType, notes, generatedBy } = req.body;

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Example metrics generation using appointments
    const appointments = await Appointment.find({
      appointmentDate: { $gte: start, $lte: end },
    });

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === "Completed").length;
    const cancelledAppointments = appointments.filter(a => a.status === "Cancelled").length;
    const totalRevenue = appointments.reduce((sum, a) => sum + (a.payment?.amount || 0), 0);

    const metrics = {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      totalRevenue,
    };

    const relatedDoctors = await Doctor.find().distinct("_id");
    const relatedPatients = await Patient.find().distinct("_id");

    const report = new Report({
      reportType,
      department,
      generatedBy,
      startDate: start,
      endDate: end,
      metrics,
      relatedDoctors,
      relatedPatients,
      scheduleType,
      status: "Generated",
      notes,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report", error });
  }
};

/**
 * Get all reports
 */
export const getReports = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find()
      .populate("generatedBy", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
};

/**
 * Get a single report by ID
 */
export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("generatedBy", "name email")
      .populate("relatedDoctors", "doctorName specialization")
      .populate("relatedPatients", "userId");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch report", error });
  }
};

/**
 * Update a report
 */
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reportType, department, startDate, endDate, scheduleType, notes, status } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        reportType,
        department,
        startDate,
        endDate,
        scheduleType,
        notes,
        status,
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error });
  }
};

/**
 * Delete a report
 */
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report", error });
  }
};
