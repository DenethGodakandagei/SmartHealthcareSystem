"use client";

import React from "react";
import Link from "next/link";
import { IAppointment } from "../types/appointment";

export default function AppointmentCard({
  appointment,
}: {
  appointment: IAppointment;
}) {
  const doctorName =
    (appointment.doctorId as any)?.doctorName || "Unknown Doctor"
;
  const patientName =
    (appointment.patientId as any)?.userId?.name || "Unknown Patient";

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white flex justify-between items-center">
      <div>
        <p className="font-semibold">{doctorName}</p>
        <p className="text-sm text-gray-500">Patient: {patientName}</p>
        <p className="text-sm text-gray-400">
          Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400">
          Time: {appointment.timeSlot.start} - {appointment.timeSlot.end}
        </p>
      </div>
      <div className="flex gap-2">
        <Link href={`/staff/confirm?appointmentId=${appointment._id}`}>
          <button className="px-3 py-1 text-white bg-green-800 rounded-md hover:bg-green-700">
            Confirm
          </button>
        </Link>
        <Link href={`/staff/reschedule?appointmentId=${appointment._id}`}>
          <button className="px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Reschedule
          </button>
        </Link>
      </div>
    </div>
  );
}
