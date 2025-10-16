"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { jsPDF } from 'jspdf'
import {
  PrinterIcon,
  DownloadIcon,
  CalendarIcon,
  BarChart3Icon,
  UsersIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  FileTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BedIcon,
  StethoscopeIcon,
} from 'lucide-react'
// Mock data for demonstration
const mockData = {
  patientFlow: {
    daily: [42, 38, 56, 45, 50, 48, 62],
    weekly: [280, 310, 290, 340],
    monthly: [1200, 1350, 1100, 1450, 1300, 1250],
  },
  staffPerformance: {
    doctors: {
      efficiency: 87,
      patientsSeen: 245,
      avgConsultTime: 18,
      satisfaction: 92,
    },
    nurses: {
      efficiency: 91,
      tasksCompleted: 520,
      overtimeHours: 12,
      satisfaction: 88,
    },
    admin: {
      efficiency: 84,
      tasksCompleted: 340,
      overtimeHours: 8,
      satisfaction: 82,
    },
  },
  resourceUtilization: {
    bedOccupancy: 76,
    equipmentUsage: 68,
    medicineConsumption: {
      antibiotics: 120,
      painkillers: 210,
      cardiac: 85,
      respiratory: 65,
      other: 175,
    },
    roomUtilization: {
      icu: 92,
      emergency: 78,
      general: 82,
      surgery: 65,
      outpatient: 73,
    },
  },
  compliance: {
    documentationCompletion: 94,
    protocolAdherence: 91,
    incidentReports: 8,
    regulatoryViolations: 2,
    trainingCompletion: 87,
  },
}
// Department data
const departments = [
  'All Departments',
  'Emergency',
  'ICU',
  'General Medicine',
  'Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Orthopedics',
  'Neurology',
  'Cardiology',
  'Radiology',
  'Laboratory',
  'Pharmacy',
  'Outpatient',
]
export const OperationalReportGenerator = () => {
  const [reportType, setReportType] = useState('patientFlow')
  type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'custom'
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly')
  const [department, setDepartment] = useState('All Departments')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })
  const [metrics, setMetrics] = useState([
    'admissions',
    'discharges',
    'averageStay',
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [noDataError, setNoDataError] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [schedule, setSchedule] = useState({
    frequency: 'weekly',
    day: 'monday',
    time: '08:00',
    email: '',
  })
  const reportRef = useRef(null)
  // Handle report generation
  const generateReport = () => {
    // Reset states
    setNoDataError(false)
    setValidationError('')
    // Validation checks
    if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
      setValidationError('Start date cannot be after end date')
      return
    }
    if (metrics.length === 0) {
      setValidationError('Please select at least one metric')
      return
    }
    // Simulate API call
    setIsGenerating(true)
    setTimeout(() => {
      // Simulate no data scenario (10% chance)
      if (Math.random() < 0.1) {
        setNoDataError(true)
        setReportGenerated(false)
      } else {
        setReportGenerated(true)
      }
      setIsGenerating(false)
    }, 1500)
  }
  // Handle metric selection
  const toggleMetric = (metric: string) => {
    if (metrics.includes(metric)) {
      setMetrics(metrics.filter((m) => m !== metric))
    } else {
      setMetrics([...metrics, metric])
    }
  }
  // Handle print functionality
  const handlePrint = useReactToPrint(({
    getContent: () => reportRef.current,
    documentTitle: `${reportType}_${department}_${dateRange.startDate}_${dateRange.endDate}`,
  } as any))
  // Handle PDF export
  const handlePdfDownload = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })
    if (reportRef.current) {
      doc.html(reportRef.current, {
        callback: function (pdf) {
          pdf.save(
            `${reportType}_${department}_${dateRange.startDate}_${dateRange.endDate}.pdf`,
          )
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800,
      })
    }
  }
  // Handle CSV export (mock functionality)
  const handleCsvExport = () => {
    // In a real app, this would generate and download a CSV file
    alert('CSV export functionality would be implemented here')
  }
  // Handle schedule submission
  const handleScheduleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(
      `Report scheduled for ${schedule.frequency} delivery on ${schedule.day} at ${schedule.time}`,
    )
    setIsScheduling(false)
  }
  // Render chart based on report type (simplified for this example)
  const renderChart = () => {
    switch (reportType) {
      case 'patientFlow':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Patient Flow Trend
            </h3>
            <div className="h-64 flex items-end space-x-2">
              {((timeFrame === 'custom' ? [] : mockData.patientFlow[timeFrame]) as number[]).map((value: number, index: number) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 w-full rounded-t"
                    style={{
                      height: `${(value / 100) * 50}%`,
                    }}
                  ></div>
                  <span className="text-xs mt-1">{`Day ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'staffPerformance':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Staff Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Efficiency</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width: `${mockData.staffPerformance.doctors.efficiency}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">
                    {mockData.staffPerformance.doctors.efficiency}%
                  </span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Patients Seen</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {mockData.staffPerformance.doctors.patientsSeen}
                </div>
              </div>
            </div>
          </div>
        )
      case 'resourceUtilization':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Resource Utilization
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Bed Occupancy</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{
                        width: `${mockData.resourceUtilization.bedOccupancy}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">
                    {mockData.resourceUtilization.bedOccupancy}%
                  </span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Equipment Usage</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full"
                      style={{
                        width: `${mockData.resourceUtilization.equipmentUsage}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">
                    {mockData.resourceUtilization.equipmentUsage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'compliance':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Compliance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Documentation Completion</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width: `${mockData.compliance.documentationCompletion}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">
                    {mockData.compliance.documentationCompletion}%
                  </span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Protocol Adherence</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{
                        width: `${mockData.compliance.protocolAdherence}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">
                    {mockData.compliance.protocolAdherence}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p>Select a report type to view data</p>
          </div>
        )
    }
  }
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Report Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Report Configuration
          </h2>
          {/* Report Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="patientFlow">Patient Flow</option>
              <option value="staffPerformance">Staff Performance</option>
              <option value="resourceUtilization">Resource Utilization</option>
              <option value="compliance">Compliance & Quality</option>
            </select>
          </div>
          {/* Time Frame */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Frame
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {/* Date Range (visible when custom time frame is selected) */}
          {timeFrame === 'custom' && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          {/* Department */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          {/* Metrics */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metrics to Include
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="metric-admissions"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={metrics.includes('admissions')}
                  onChange={() => toggleMetric('admissions')}
                />
                <label
                  htmlFor="metric-admissions"
                  className="ml-2 text-sm text-gray-700"
                >
                  Admissions
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="metric-discharges"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={metrics.includes('discharges')}
                  onChange={() => toggleMetric('discharges')}
                />
                <label
                  htmlFor="metric-discharges"
                  className="ml-2 text-sm text-gray-700"
                >
                  Discharges
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="metric-averageStay"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={metrics.includes('averageStay')}
                  onChange={() => toggleMetric('averageStay')}
                />
                <label
                  htmlFor="metric-averageStay"
                  className="ml-2 text-sm text-gray-700"
                >
                  Average Length of Stay
                </label>
              </div>
              {reportType === 'staffPerformance' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="metric-productivity"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={metrics.includes('productivity')}
                    onChange={() => toggleMetric('productivity')}
                  />
                  <label
                    htmlFor="metric-productivity"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Staff Productivity
                  </label>
                </div>
              )}
              {reportType === 'resourceUtilization' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="metric-utilization"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={metrics.includes('utilization')}
                    onChange={() => toggleMetric('utilization')}
                  />
                  <label
                    htmlFor="metric-utilization"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Equipment Utilization
                  </label>
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex justify-center items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsScheduling(true)}
              className="w-full px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Schedule Report
            </button>
          </div>
          {/* Validation Error */}
          {validationError && (
            <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {validationError}
              </p>
            </div>
          )}
          {/* No Data Error */}
          {noDataError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-1">
                No Data Available
              </h4>
              <p className="text-sm text-yellow-700">
                No records found for the selected parameters. Try adjusting your
                filters or selecting a different time period.
              </p>
            </div>
          )}
        </div>
        {/* Right Panel - Report Display */}
        <div className="lg:col-span-2">
          {reportGenerated ? (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {reportType === 'patientFlow' && 'Patient Flow Report'}
                    {reportType === 'staffPerformance' &&
                      'Staff Performance Report'}
                    {reportType === 'resourceUtilization' &&
                      'Resource Utilization Report'}
                    {reportType === 'compliance' &&
                      'Compliance & Quality Report'}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      <PrinterIcon className="w-4 h-4 mr-1" />
                      Print
                    </button>
                    <button
                      type="button"
                      onClick={handlePdfDownload}
                      className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      <DownloadIcon className="w-4 h-4 mr-1" />
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleCsvExport}
                      className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      CSV
                    </button>
                  </div>
                </div>
                <div ref={reportRef} className="p-4 bg-white">
                  {/* Report Header */}
                  <div className="mb-6 pb-4 border-b">
                    <div className="flex justify-between">
                      <div>
                        <h1 className="text-xl font-bold text-gray-800">
                          {reportType === 'patientFlow' &&
                            'Patient Flow Report'}
                          {reportType === 'staffPerformance' &&
                            'Staff Performance Report'}
                          {reportType === 'resourceUtilization' &&
                            'Resource Utilization Report'}
                          {reportType === 'compliance' &&
                            'Compliance & Quality Report'}
                        </h1>
                        <p className="text-gray-600">
                          {department} |{' '}
                          {timeFrame === 'custom'
                            ? `${dateRange.startDate} to ${dateRange.endDate}`
                            : `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Report`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">
                          Generated on: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">Smart Healthcare System</p>
                      </div>
                    </div>
                  </div>
                  {/* Report Summary */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {reportType === 'patientFlow' && (
                        <>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                              <UsersIcon className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Total Patients
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {((timeFrame === 'custom' ? [] : mockData.patientFlow[timeFrame]) as number[]).reduce(
                                    (a: number, b: number) => a + b,
                                    0,
                                  )}
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              8.2% from previous period
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                              <BedIcon className="h-5 w-5 text-green-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Avg. Daily Admissions
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {Math.round(
                                ((timeFrame === 'custom' ? [] : mockData.patientFlow[timeFrame]) as number[]).reduce(
                                  (a: number, b: number) => a + b,
                                  0,
                                ) / ((timeFrame === 'custom' ? [] : mockData.patientFlow[timeFrame]) as number[]).length,
                              )}
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              3.5% from previous period
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center mb-2">
                              <ClockIcon className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Avg. Length of Stay
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                              3.2 days
                            </p>
                            <p className="text-xs text-red-600 flex items-center mt-1">
                              <ArrowDownIcon className="h-3 w-3 mr-1" />
                              1.4% from previous period
                            </p>
                          </div>
                        </>
                      )}
                      {reportType === 'staffPerformance' && (
                        <>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                              <StethoscopeIcon className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Doctor Efficiency
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {mockData.staffPerformance.doctors.efficiency}%
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              2.1% from previous period
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                              <UsersIcon className="h-5 w-5 text-green-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Nurse Efficiency
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {mockData.staffPerformance.nurses.efficiency}%
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              4.3% from previous period
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center mb-2">
                              <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Tasks Completed
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                              {mockData.staffPerformance.nurses.tasksCompleted +
                                mockData.staffPerformance.admin.tasksCompleted}
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              6.8% from previous period
                            </p>
                          </div>
                        </>
                      )}
                      {reportType === 'resourceUtilization' && (
                        <>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                              <BedIcon className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Bed Occupancy
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {mockData.resourceUtilization.bedOccupancy}%
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              3.2% from previous period
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                              <BarChart3Icon className="h-5 w-5 text-green-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Equipment Usage
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {mockData.resourceUtilization.equipmentUsage}%
                            </p>
                            <p className="text-xs text-red-600 flex items-center mt-1">
                              <ArrowDownIcon className="h-3 w-3 mr-1" />
                              1.8% from previous period
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center mb-2">
                              <ClockIcon className="h-5 w-5 text-purple-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Room Utilization
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                              {Object.values(
                                mockData.resourceUtilization.roomUtilization,
                              ).reduce((a, b) => a + b, 0) /
                                Object.keys(
                                  mockData.resourceUtilization.roomUtilization,
                                ).length}
                              %
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              2.5% from previous period
                            </p>
                          </div>
                        </>
                      )}
                      {reportType === 'compliance' && (
                        <>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center mb-2">
                              <FileTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Documentation
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {mockData.compliance.documentationCompletion}%
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              1.2% from previous period
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center mb-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Protocol Adherence
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {mockData.compliance.protocolAdherence}%
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                              3.5% from previous period
                            </p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <div className="flex items-center mb-2">
                              <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                              <h3 className="text-sm font-medium text-gray-700">
                                Incidents
                              </h3>
                            </div>
                            <p className="text-2xl font-bold text-red-700">
                              {mockData.compliance.incidentReports}
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                              <ArrowDownIcon className="h-3 w-3 mr-1" />2 fewer
                              than previous period
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Data Visualization */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Data Visualization
                    </h2>
                    {renderChart()}
                  </div>
                  {/* Detailed Data */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Detailed Data
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {reportType === 'patientFlow' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Admissions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Discharges
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Avg. Stay (days)
                                </th>
                              </>
                            )}
                            {reportType === 'staffPerformance' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Staff Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Efficiency
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tasks Completed
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Satisfaction
                                </th>
                              </>
                            )}
                            {reportType === 'resourceUtilization' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Resource
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Utilization Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Availability
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </>
                            )}
                            {reportType === 'compliance' && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Metric
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Compliance Rate
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Target
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Patient Flow Sample Data */}
                          {reportType === 'patientFlow' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date().toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  45
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  38
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  3.2
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    Date.now() - 86400000,
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  52
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  41
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  3.4
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    Date.now() - 172800000,
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  48
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  44
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  3.1
                                </td>
                              </tr>
                            </>
                          )}
                          {/* Staff Performance Sample Data */}
                          {reportType === 'staffPerformance' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Doctors
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.staffPerformance.doctors.efficiency}
                                  %
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    mockData.staffPerformance.doctors
                                      .patientsSeen
                                  }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    mockData.staffPerformance.doctors
                                      .satisfaction
                                  }
                                  %
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Nurses
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.staffPerformance.nurses.efficiency}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    mockData.staffPerformance.nurses
                                      .tasksCompleted
                                  }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    mockData.staffPerformance.nurses
                                      .satisfaction
                                  }
                                  %
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Administrative
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.staffPerformance.admin.efficiency}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    mockData.staffPerformance.admin
                                      .tasksCompleted
                                  }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.staffPerformance.admin.satisfaction}
                                  %
                                </td>
                              </tr>
                            </>
                          )}
                          {/* Resource Utilization Sample Data */}
                          {reportType === 'resourceUtilization' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Beds
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.resourceUtilization.bedOccupancy}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {100 -
                                    mockData.resourceUtilization.bedOccupancy}
                                  %
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Optimal
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Medical Equipment
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.resourceUtilization.equipmentUsage}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {100 -
                                    mockData.resourceUtilization.equipmentUsage}
                                  %
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Moderate
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ICU Rooms
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    mockData.resourceUtilization.roomUtilization
                                      .icu
                                  }
                                  %
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {100 -
                                    mockData.resourceUtilization.roomUtilization
                                      .icu}
                                  %
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    High
                                  </span>
                                </td>
                              </tr>
                            </>
                          )}
                          {/* Compliance Sample Data */}
                          {reportType === 'compliance' && (
                            <>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Documentation Completion
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.compliance.documentationCompletion}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  95%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Meeting Target
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Protocol Adherence
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.compliance.protocolAdherence}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  90%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Meeting Target
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Training Completion
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mockData.compliance.trainingCompletion}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  90%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Needs Improvement
                                  </span>
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Recommendations */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Recommendations
                    </h2>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {reportType === 'patientFlow' && (
                          <>
                            <li>
                              Consider increasing staffing during peak admission
                              times to improve patient processing.
                            </li>
                            <li>
                              Review discharge procedures to identify
                              opportunities for reducing length of stay.
                            </li>
                            <li>
                              Implement pre-admission protocols to streamline
                              the intake process and reduce waiting times.
                            </li>
                          </>
                        )}
                        {reportType === 'staffPerformance' && (
                          <>
                            <li>
                              Provide additional training to improve
                              administrative staff efficiency.
                            </li>
                            <li>
                              Review workload distribution among nursing staff
                              to optimize task completion.
                            </li>
                            <li>
                              Consider implementing recognition programs to
                              maintain high satisfaction levels.
                            </li>
                          </>
                        )}
                        {reportType === 'resourceUtilization' && (
                          <>
                            <li>
                              Develop a plan to optimize ICU bed utilization
                              which is currently at critical levels.
                            </li>
                            <li>
                              Schedule preventative maintenance for medical
                              equipment during low-usage periods.
                            </li>
                            <li>
                              Consider redistributing resources between
                              departments to balance utilization rates.
                            </li>
                          </>
                        )}
                        {reportType === 'compliance' && (
                          <>
                            <li>
                              Focus on improving training completion rates which
                              are currently below target.
                            </li>
                            <li>
                              Continue current documentation practices which are
                              exceeding compliance targets.
                            </li>
                            <li>
                              Implement additional safeguards to further reduce
                              incident reports.
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  {/* Report Footer */}
                  <div className="mt-10 pt-4 border-t text-sm text-gray-500">
                    <p>
                      This report is generated automatically by the Smart
                      Healthcare System. Data is sourced from patient records,
                      staff logs, and resource management systems.
                    </p>
                    <p className="mt-2">
                      For questions or additional analysis, please contact the
                      Healthcare Analytics Department.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow-md text-center">
              <BarChart3Icon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Report Generated Yet
              </h2>
              <p className="text-gray-500 mb-6">
                Configure your report parameters and click "Generate Report" to
                create a new report.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Schedule Report Modal */}
      {isScheduling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Schedule Report
            </h2>
            <form onSubmit={handleScheduleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={schedule.frequency}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      frequency: e.target.value,
                    })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {schedule.frequency === 'weekly' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={schedule.day}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        day: e.target.value,
                      })
                    }
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              )}
              {schedule.frequency === 'monthly' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day of Month
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={schedule.day}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        day: e.target.value,
                      })
                    }
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={schedule.time}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Recipients
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="email@example.com"
                  value={schedule.email}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsScheduling(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
