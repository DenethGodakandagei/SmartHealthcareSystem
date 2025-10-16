export async function requestPayout(doctorId: string, amount: number) {
  return { success: true };
}

export async function getDoctorPayouts(doctorId?: string) {
  return [];
}

export async function getDoctorEarnings(doctorId?: string) {
  return { total: 0, breakdown: [] };
}
