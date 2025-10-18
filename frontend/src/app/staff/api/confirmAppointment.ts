import API from "@/services/api";

export async function confirmAppointment(
  appointmentId: string,
  staffId: string,
  notes?: string
) {
  const res = await API.patch(`/staff/appointments/${appointmentId}/confirm`, {
    notes,
  });
  return res.data;
}
