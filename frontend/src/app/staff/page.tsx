"use client";

import React, { useEffect, useState } from "react";
import { getPendingAppointments } from "./api/getPendingAppointments";
import PendingList from "./components/PendingList";
import { IAppointment } from "./types/appointment";

export default function StaffPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPendingAppointments();
        setAppointments(data);
        console.log("Appmnt dt", data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-500">Loading appointments...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending Appointments</h1>
      <PendingList appointments={appointments} />
    </div>
  );
}
