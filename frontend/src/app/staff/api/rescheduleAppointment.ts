import API from "@/services/api";

export async function rescheduleAppointment(
  appointmentId: string,
  staffId: string,
  newDoctorId?: string,
  newAppointmentDate?: string,
  newTimeSlot?: { start: string; end: string }
) {
  const res = await API.patch(
    `/staff/appointments/${appointmentId}/reschedule`,
    {
      staffId,
      newDoctorId,
      newAppointmentDate,
      newTimeSlot,
    }
  );
  return res.data;
}
