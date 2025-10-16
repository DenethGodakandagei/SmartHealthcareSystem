import HealthcareReport from '../models/HealthcareReport.model'

export const createReport = async (data: any) => {
  const report = new HealthcareReport(data)
  return await report.save()
}

export const getAllReports = async () => {
  return await HealthcareReport.find()
}

export const getReportById = async (id: string) => {
  return await HealthcareReport.findById(id)
}

export const updateReport = async (id: string, data: any) => {
  return await HealthcareReport.findByIdAndUpdate(id, data, { new: true })
}

export const deleteReport = async (id: string) => {
  return await HealthcareReport.findByIdAndDelete(id)
}
