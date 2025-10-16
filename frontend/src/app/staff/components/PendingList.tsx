"use client";

import React from "react";
import AppointmentCard from "./AppointmentCard";
import { IAppointment } from "./../types/appointment";

interface Props {
  appointments: IAppointment[];
}

export default function PendingList({ appointments }: Props) {
  if (!appointments.length)
    return <div className="text-gray-500 text-center mt-10">No pending appointments.</div>;

  return (
    <div className="grid gap-4">
      {appointments.map((a) => (
        <AppointmentCard key={a._id} appointment={a} />
      ))}
    </div>
  );
}