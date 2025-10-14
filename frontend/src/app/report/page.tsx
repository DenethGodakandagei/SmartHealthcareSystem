"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, Printer, Share2, TrendingUp, TrendingDown, Activity } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const patientAdmissionsData = [
  { date: "Jan 1", admissions: 45, discharges: 38 },
  { date: "Jan 8", admissions: 52, discharges: 45 },
  { date: "Jan 15", admissions: 48, discharges: 50 },
  { date: "Jan 22", admissions: 61, discharges: 52 },
  { date: "Jan 29", admissions: 55, discharges: 48 },
]

const staffWorkloadData = [
  { department: "Emergency", workload: 85 },
  { department: "Cardiology", workload: 72 },
  { department: "Pediatrics", workload: 68 },
  { department: "Surgery", workload: 78 },
  { department: "Radiology", workload: 65 },
]

const resourceUtilizationData = [
  { resource: "ICU Beds", utilization: 92 },
  { resource: "Ventilators", utilization: 78 },
  { resource: "OR Rooms", utilization: 85 },
  { resource: "CT Scanners", utilization: 71 },
  { resource: "MRI Machines", utilization: 68 },
]

export default function ReportPage() {
  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-2xl font-semibold">Operational Report</h1>
              <p className="text-sm text-muted-foreground">January 2025 - Emergency Department</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admissions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">261</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Staff Workload</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73.6%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">3.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.8%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">5.1%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 min</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">8.3%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Admissions & Discharges</CardTitle>
              <CardDescription>Daily patient flow trends for January 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientAdmissionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="admissions" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="discharges" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Staff Workload by Department</CardTitle>
                <CardDescription>Average workload percentage across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={staffWorkloadData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="workload" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current utilization rates of critical resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourceUtilizationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="resource" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="utilization" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Patient admissions increased by 12.5%</p>
                  <p className="text-sm text-muted-foreground">
                    Consider allocating additional staff during peak hours to maintain service quality
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                  <Activity className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">ICU bed utilization at 92%</p>
                  <p className="text-sm text-muted-foreground">
                    High utilization rate may require capacity planning for emergency situations
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Average wait time reduced by 8.3%</p>
                  <p className="text-sm text-muted-foreground">
                    Process improvements are showing positive results in patient experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
