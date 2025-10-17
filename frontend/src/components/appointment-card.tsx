"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Loader2,
  CheckCircle,
} from "lucide-react";

// ============================
// Type Definitions
// ============================
interface Appointment {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    specialty?: string;
  };
  patientId: {
    _id: string;
    name: string;
    email?: string;
  };
  appointmentDate: string;
  timeSlot: {
    start: string;
    end: string;
  };
  reasonForVisit?: string;
  notes?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt?: string;
  updatedAt?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  userRole: "doctor" | "patient";
  refetchAppointments?: () => void;
}

// ============================
// Component
// ============================
export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}: AppointmentCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || "");

  // Format helpers
  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMMM d, yyyy");
  const formatTime = (time: string) => time || "N/A";

  // ------------------------------
  // ACTION HANDLERS
  // ------------------------------

  const handleCancelAppointment = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/appointments/${appointment._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Appointment cancelled successfully!");
        refetchAppointments ? refetchAppointments() : router.refresh();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      toast.error("Something went wrong while cancelling.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!window.confirm("Mark this appointment as completed?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/appointments/${appointment._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Appointment marked as completed!");
        refetchAppointments ? refetchAppointments() : router.refresh();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/appointments/${appointment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Notes saved successfully!");
        refetchAppointments ? refetchAppointments() : router.refresh();
      } else {
        toast.error(data.message || "Failed to save notes");
      }
    } catch (error) {
      toast.error("Something went wrong while saving notes.");
    } finally {
      setLoading(false);
    }
  };

  const otherParty = userRole === "doctor" ? appointment.patientId : appointment.doctorId;
  const otherPartyIcon = userRole === "doctor" ? <User /> : <Stethoscope />;

  return (
    <>
      <Card className="border-emerald-900/20 hover:border-emerald-700/30 transition-all">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-muted/20 rounded-full p-2 mt-1">{otherPartyIcon}</div>
              <div>
                <h3 className="font-medium text-black">
                  {userRole === "doctor"
                    ? otherParty?.name
                    : `Dr. ${otherParty?.name}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {/* {userRole === "doctor"
                    ? otherParty?.email
                    : otherParty?.specialty} */}
                    Specialization is here
                </p>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {formatTime(appointment.timeSlot.start)} -{" "}
                    {formatTime(appointment.timeSlot.end)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 self-end md:self-start">
              <Badge
                variant="outline"
                className={
                  appointment.status === "Completed"
                    ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                    : appointment.status === "Cancelled"
                    ? "bg-red-900/20 border-red-900/30 text-red-400"
                    : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                }
              >
                {appointment.status}
              </Badge>

              <div className="flex gap-2 mt-2 flex-wrap">
                {userRole === "doctor" && appointment.status === "Pending" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleMarkCompleted}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" /> Complete
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-900/30"
                  onClick={() => setOpen(true)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================ */}
      {/* Details Dialog */}
      {/* ============================ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              View and manage appointment information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <p>
              <strong>Reason:</strong> {appointment.reasonForVisit || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>

            {userRole === "doctor" && (
              <>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="min-h-[100px] text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={loading}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </>
            )}

            {userRole === "patient" &&
              appointment.status !== "Cancelled" &&
              appointment.status !== "Completed" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleCancelAppointment}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cancel Appointment"
                  )}
                </Button>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
