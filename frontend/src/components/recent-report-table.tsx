import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import Link from "next/link"

interface Report {
  id: string
  name: string
  type: string
  date: string
  status: "completed" | "processing" | "scheduled"
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Patient Admissions Report",
    type: "Operational",
    date: "2025-10-14",
    status: "completed",
  },
  {
    id: "2",
    name: "Staff Workload Analysis",
    type: "Performance",
    date: "2025-10-13",
    status: "completed",
  },
  {
    id: "3",
    name: "Resource Utilization",
    type: "Compliance",
    date: "2025-10-12",
    status: "completed",
  },
  {
    id: "4",
    name: "Weekly Summary Report",
    type: "Operational",
    date: "2025-10-15",
    status: "scheduled",
  },
]

export function RecentReportsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    report.status === "completed"
                      ? "bg-accent/10 text-accent"
                      : report.status === "processing"
                        ? "bg-chart-4/10 text-chart-4"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {report.status}
                </span>
                <Link href={`/reports/${report.id}`}>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
