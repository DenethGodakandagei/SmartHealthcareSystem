// Report Type Definitions
export interface Report {
  id: string
  title: string
  type: ReportType
  department: Department
  dateRange: {
    from: Date
    to: Date
  }
  metrics: Metric[]
  status: ReportStatus
  generatedBy: string
  generatedAt: Date
  scheduledFor?: Date
  data: ReportData
}

export type ReportType = "operational" | "compliance" | "financial" | "clinical" | "patient-flow" | "staff-performance"

export type Department = "emergency" | "cardiology" | "pediatrics" | "surgery" | "radiology" | "laboratory" | "all"

export type Metric =
  | "patient-admissions"
  | "staff-workload"
  | "resource-utilization"
  | "wait-times"
  | "bed-occupancy"
  | "treatment-outcomes"

export type ReportStatus = "draft" | "generating" | "completed" | "failed" | "scheduled"

export interface ReportData {
  summary: {
    totalPatients: number
    totalStaff: number
    averageWaitTime: number
    bedOccupancyRate: number
  }
  patientAdmissions?: {
    total: number
    byDay: Array<{ date: string; count: number }>
    byDepartment: Array<{ department: string; count: number }>
  }
  staffWorkload?: {
    totalHours: number
    averageHoursPerStaff: number
    byDepartment: Array<{ department: string; hours: number; staffCount: number }>
  }
  resourceUtilization?: {
    beds: { total: number; occupied: number; available: number }
    equipment: Array<{ name: string; utilizationRate: number }>
    rooms: { total: number; occupied: number; available: number }
  }
  insights: string[]
}

export interface GenerateReportRequest {
  reportType: ReportType
  department: Department
  dateRange: {
    from: string
    to: string
  }
  metrics: Metric[]
  scheduleFor?: string
}

export interface ExportReportRequest {
  reportId: string
  format: "pdf" | "excel" | "csv"
}

export interface ReportFilters {
  type?: ReportType
  department?: Department
  status?: ReportStatus
  dateFrom?: string
  dateTo?: string
}
