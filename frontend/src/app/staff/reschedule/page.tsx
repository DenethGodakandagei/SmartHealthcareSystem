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

  // Dynamically compute today's date for 'min'
  const today = new Date().toISOString().split("T")[0];

  async function handleReschedule() {
    if (!newDate || !start || !end) {
      alert("Please fill all fields before rescheduling.");
      return;
    }

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
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Reschedule Appointment
      </h1>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          New Date
        </label>
        <input
          type="date"
          min={today} // prevents past dates
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          New Time Slot
        </label>
        <div className="flex gap-3">
          <input
            type="time"
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <input
            type="time"
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleReschedule}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200"
      >
        Reschedule
      </button>
    </div>
  );
}
