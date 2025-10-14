import Report from "../models/report.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";

export const generateReport = async (title: string, params: any, userId: string) => {
  // For demo: gather counts based on params
  const from = params.from ? new Date(params.from) : new Date(0);
  const to = params.to ? new Date(params.to) : new Date();

  const admissions = await Appointment.countDocuments({
    scheduledAt: { $gte: from, $lte: to },
    status: { $in: ["confirmed", "completed"] },
  });

  const patients = await Patient.countDocuments();

  const data = { admissions, patients };

  const report = await Report.create({ title, parameters: params, generatedBy: userId, data });
  return report;
};
