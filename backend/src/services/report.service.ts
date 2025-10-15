import { createReport, getReportData } from "../models/report.model";
import { generateCSV } from "../utils/exportUtils";

export const generateReportService = async (reportInput: any) => {
  // Save report metadata
  const report = await createReport({
    ...reportInput,
    status: "completed",
    createdAt: new Date(),
  });

  // Optionally, generate CSV content
  const csvContent = generateCSV(reportInput.metrics, reportInput);

  return { report, fileContent: csvContent };
};

export const fetchReportDataService = async (filter: any) => {
  const data = await getReportData(filter);
  return data;
};
