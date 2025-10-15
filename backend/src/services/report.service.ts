import Report from "../models/report.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import { IReport } from "../interfaces/report.interface.js";

/**
 * Generate a new report with metrics (business logic)
 */
export const generateReportService = async (data: IReport) => {
  const { reportType, department, startDate, endDate, generatedBy, scheduleType, notes } = data;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Fetch appointments in range
  const appointments = await Appointment.find({
    appointmentDate: { $gte: start, $lte: end },
  });

  // Calculate key metrics
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

  // Related entities
  const relatedDoctors = await Doctor.find().distinct("_id");
  const relatedPatients = await Patient.find().distinct("_id");

  // Create and save report
  const report = await Report.create({
    reportType,
    department,
    generatedBy,
    startDate: start,
    endDate: end,
    metrics,
    relatedDoctors,
    relatedPatients,
    scheduleType,
    notes,
    status: "Generated",
  });

  return report;
};

/**
 * Fetch all reports
 */
export const getAllReportsService = async () => {
  return await Report.find()
    .populate("generatedBy", "name email role")
    .sort({ createdAt: -1 });
};

/**
 * Get single report by ID
 */
export const getReportByIdService = async (id: string) => {
  return await Report.findById(id)
    .populate("generatedBy", "name email")
    .populate("relatedDoctors", "doctorName specialization")
    .populate("relatedPatients", "userId");
};

/**
 * Update report by ID
 */
export const updateReportService = async (id: string, updateData: Partial<IReport>) => {
  return await Report.findByIdAndUpdate(id, updateData, { new: true });
};

/**
 * Delete report by ID
 */
export const deleteReportService = async (id: string) => {
  return await Report.findByIdAndDelete(id);
};
