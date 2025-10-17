"use client";

import { useEffect, useState, useContext } from "react";
import { AppointmentCard } from "@/components/appointment-card";
import { PageHeader } from "@/components/page-header";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "../../context/authcontext";

export default function PatientAppointmentsPage() {
  const { user, token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ Fetch Patient _id by userId
  useEffect(() => {
    const fetchPatientId = async () => {
      if (!user?._id) return;

      try {
        const res = await fetch(`http://localhost:5000/api/patients/by-user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch patient");
        }

        const data = await res.json();
        setPatientId(data._id);
      } catch (err: any) {
        console.error("Error fetching patient details:", err.message);
        setError(err.message);
      }
    };

    fetchPatientId();
  }, [user, token]);

  // 2️⃣ Fetch Appointments once patientId is available
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:5000/api/appointments/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch appointments");
        }

        const data = await res.json();
        setAppointments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId, token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        icon={<Calendar />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="Find Doctors"
      />

      <Card className="border-emerald-900/20 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-white-900" />
            Your Scheduled Appointments
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">Error: {error}</p>
            </div>
          ) : appointments?.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  userRole="patient"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-xl font-medium text-black mb-2">
                No appointments scheduled
              </h3>
              <p className="text-muted-foreground">
                You don&apos;t have any appointments scheduled yet. Browse our
                doctors and book your first consultation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
