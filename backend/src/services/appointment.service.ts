import Appointment from "../models/appointment.model.js";

const makeReference = () => `APPT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

export const createAppointment = async (payload: any) => {
  const reference = makeReference();
  const appointment = await Appointment.create({ ...payload, reference });
  return appointment;
};

export const findAvailable = async (doctorId: string, from: Date, to: Date) => {
  // simplistic availability check: ensure no confirmed appointment overlaps
  return (
    await Appointment.find({
      doctorId,
      status: "confirmed",
      scheduledAt: { $gte: from, $lte: to },
    })
  ).length === 0;
};

export const confirmAppointment = async (appointmentId: string, staffId?: string) => {
  return await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: "confirmed", staffId },
    { new: true }
  );
};

export const getPendingAppointments = async () => {
  return await Appointment.find({ status: "pending" }).populate("patientId doctorId");
};
