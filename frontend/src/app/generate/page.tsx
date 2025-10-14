"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button" // ✅ Import Button
import { CalendarIcon, FileText, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ✅ Simple cn utility
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function GenerateReportPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [department, setDepartment] = useState<string>("")
  const [reportType, setReportType] = useState<string>("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [scheduleType, setScheduleType] = useState<string>("immediate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>("")

  const metrics = [
    { id: "patient-admissions", label: "Patient Admissions" },
    { id: "patient-discharges", label: "Patient Discharges" },
    { id: "staff-workload", label: "Staff Workload" },
    { id: "resource-utilization", label: "Resource Utilization" },
    { id: "bed-occupancy", label: "Bed Occupancy Rate" },
    { id: "wait-times", label: "Average Wait Times" },
    { id: "treatment-outcomes", label: "Treatment Outcomes" },
    { id: "equipment-usage", label: "Equipment Usage" },
  ]

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    )
  }

  const validateForm = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates")
      return false
    }
    if (startDate > endDate) {
      setError("Start date must be before end date")
      return false
    }
    if (!department) {
      setError("Please select a department")
      return false
    }
    if (!reportType) {
      setError("Please select a report type")
      return false
    }
    if (selectedMetrics.length === 0) {
      setError("Please select at least one metric")
      return false
    }
    setError("")
    return true
  }

  const handleGenerateReport = async () => {
    if (!validateForm()) return

    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsGenerating(false)

    router.push("/report")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="flex h-16 items-center px-8">
            <h1 className="text-2xl font-semibold">Generate Report</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>
                  Select parameters to generate operational and compliance reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Period Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Time Period</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Department Selection */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-base font-semibold">
                    Department
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Department</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="all">All Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Report Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="report-type" className="text-base font-semibold">
                    Report Type
                  </Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational Report</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                      <SelectItem value="performance">Performance Analysis</SelectItem>
                      <SelectItem value="financial">Financial Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Metrics Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Metrics to Include</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => handleMetricToggle(metric.id)}
                        />
                        <Label htmlFor={metric.id} className="text-sm font-normal cursor-pointer">
                          {metric.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Type */}
                <div className="space-y-2">
                  <Label htmlFor="schedule-type" className="text-base font-semibold">
                    Generation Schedule
                  </Label>
                  <Select value={scheduleType} onValueChange={setScheduleType}>
                    <SelectTrigger id="schedule-type">
                      <SelectValue placeholder="Select schedule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Generate Immediately</SelectItem>
                      <SelectItem value="daily">Daily (Scheduled)</SelectItem>
                      <SelectItem value="weekly">Weekly (Scheduled)</SelectItem>
                      <SelectItem value="monthly">Monthly (Scheduled)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.push("/")} disabled={isGenerating}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={isGenerating} className="min-w-[150px]">
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : scheduleType === "immediate" ? (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
