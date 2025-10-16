// Minimal stubs for doctor actions used by the frontend during development.
export async function getDoctorAppointments(doctorId?: string) {
  return [];
}

export async function getDoctorAvailability(doctorId?: string) {
  return { slots: [] };
}

export async function setAvailabilitySlots(doctorId: string, slots: any[]) {
  return { success: true };
}

export async function cancelAppointment(appointmentId: string) {
  return { success: true };
}

export async function addAppointmentNotes(appointmentId: string, notes: string) {
  return { success: true };
}

export async function markAppointmentCompleted(appointmentId: string) {
  return { success: true };
}

export async function getDoctorEarnings(doctorId?: string) {
  return { total: 0, breakdown: [] };
}

export async function getDoctorPayouts(doctorId?: string) {
  return [];
}
