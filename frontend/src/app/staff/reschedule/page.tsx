"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { rescheduleAppointment } from "../api/rescheduleAppointment";

export default function ReschedulePage() {
  const params = useSearchParams();
  const router = useRouter();
  const appointmentId = params.get("appointmentId") || "";
  const staffId = "replace_with_loggedin_staff_id"; // TODO: integrate actual user context
  const [newDate, setNewDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  async function handleReschedule() {
    try {
      await rescheduleAppointment(appointmentId, staffId, undefined, newDate, {
        start,
        end,
      });
      alert("Appointment rescheduled!");
      router.push("/staff");
    } catch (error) {
      console.error(error);
      alert("Error rescheduling appointment.");
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Reschedule Appointment</h1>

      <label className="block mb-2 text-sm font-medium">New Date</label>
      <input
        type="date"
        className="w-full border p-2 rounded mb-4"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />

      <label className="block mb-2 text-sm font-medium">New Time Slot</label>
      <div className="flex gap-2 mb-4">
        <input
          type="time"
          className="flex-1 border p-2 rounded"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="time"
          className="flex-1 border p-2 rounded"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <button
        onClick={handleReschedule}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Reschedule
      </button>
    </div>
  );
}
