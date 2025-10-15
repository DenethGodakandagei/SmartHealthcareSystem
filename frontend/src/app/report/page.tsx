"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, FileText, Plus, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit dialog states
  const [openEdit, setOpenEdit] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [updatedReportType, setUpdatedReportType] = useState("");
  const [updatedDepartment, setUpdatedDepartment] = useState("");

  // ✅ Fetch all reports
  const fetchReports = async () => {
    try {
      const response = await API.get("/reports");
      setReports(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 📝 Open edit dialog
  const handleEdit = (report: any) => {
    setEditingReport(report);
    setUpdatedReportType(report.reportType);
    setUpdatedDepartment(report.department);
    setOpenEdit(true);
  };

  // 💾 Update report
  const handleUpdate = async () => {
    if (!editingReport) return;
    try {
      await API.put(`/reports/${editingReport.id}`, {
        reportType: updatedReportType,
        department: updatedDepartment,
      });
      setOpenEdit(false);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Failed to update report");
    }
  };

  // ❌ Delete report
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await API.delete(`/reports/${id}`);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-8">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6" /> Reports
            </h1>
            <Button onClick={() => router.push("/generate-report")}>
              <Plus className="mr-2 h-4 w-4" /> Generate New
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="animate-spin w-4 h-4" /> Loading reports...
            </p>
          ) : reports.length === 0 ? (
            <Card className="text-center py-10">
              <CardHeader>
                <CardTitle>No Reports Found</CardTitle>
                <CardDescription>
                  You haven’t generated any reports yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/generate-report")}>
                  <Plus className="mr-2 h-4 w-4" /> Generate Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">
                      {report.reportType.replace("-", " ")}
                    </CardTitle>
                    <CardDescription>
                      Department: {report.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <strong>From:</strong>{" "}
                        {new Date(report.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>To:</strong>{" "}
                        {new Date(report.endDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Schedule:</strong> {report.scheduleType}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(report)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(report.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 🧩 Edit Report Dialog */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Input
                  value={updatedReportType}
                  onChange={(e) => setUpdatedReportType(e.target.value)}
                  placeholder="e.g. Operational Report"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={updatedDepartment}
                  onChange={(e) => setUpdatedDepartment(e.target.value)}
                  placeholder="e.g. Emergency"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpenEdit(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
